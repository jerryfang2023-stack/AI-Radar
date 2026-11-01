import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('cleanup',Path(__file__).parents[1]/'worktree-cleanup.py')
cleanup=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleanup)


@unittest.skipUnless(os.name=='posix','Bootstrap uses the VPS Bash runtime')
class BootstrapTests(unittest.TestCase):
    def test_startup_retries_network_reads_but_not_authentication(self):
        source=(Path(__file__).parents[1]/'vps/run.sh').read_text(encoding='utf-8')
        function='git_read() {'+source.split('git_read() {',1)[1].split('\n}\n',1)[0]+'\n}\n'
        for message,expected,code in [('connection reset',3,0),('authentication denied HTTP 401',1,1)]:
            with tempfile.TemporaryDirectory() as temp:
                root=Path(temp);fake=root/'fake.sh'
                fake.write_text('n=0\n[ ! -f "$COUNTER" ] || n=$(cat "$COUNTER")\nn=$((n+1))\nprintf "%s" "$n" > "$COUNTER"\n[ "$n" -lt 3 ] || exit 0\nprintf "%s" "$FAILURE" >&2\nexit 1\n')
                env={**os.environ,'TMPDIR':temp,'GUANLAN_FINANCING_RUNTIME':temp,'COUNTER':str(root/'count'),'FAILURE':message,'FAKE_GIT':str(fake)}
                result=subprocess.run(['bash','-c',function+'\nsleep() { :; }\ngit_read fetch bash "$FAKE_GIT"'],env=env,capture_output=True,text=True)
                self.assertEqual(result.returncode,code,result.stderr)
                self.assertEqual(int((root/'count').read_text()),expected)


@unittest.skipUnless(os.name=='posix','VPS process and symlink inspection requires Linux')
class CleanupTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name).resolve();self.repo=self.root/'repo';self.day=self.root/'2026-11-01';self.day.mkdir()
        subprocess.run(['git','init','--quiet',str(self.repo)],check=True)
        (self.repo/'tracked.txt').write_text('accepted')
        self.git('add','tracked.txt');self.git('-c','user.name=Test','-c','user.email=test@example.com','commit','--quiet','-m','accepted')
        self.head=self.git('rev-parse','HEAD');self.git('update-ref','refs/remotes/origin/main',self.head)
        self.target=self.day/f'review-{self.head[:12]}-{self.head[:12]}'/'attempt-1'/'checkout'
        self.git('worktree','add','--quiet','--detach',str(self.target),self.head)
        self.entry={'checkout':str(self.target),'head':self.head}

    def git(self,*args,cwd=None):
        return subprocess.check_output(['git','-C',str(cwd or self.repo),*args],text=True).strip()

    def test_clean_published_checkout_archives_before_removal_and_keeps_link_target(self):
        (self.target/'diagnostic.json').write_text('{"retained":true}')
        outside=self.root/'private.txt';outside.write_text('must remain')
        (self.target/'outside-link').symlink_to(outside)
        result=cleanup.retire_checkout(self.repo,self.day,self.entry)
        self.assertEqual(result['status'],'removed');self.assertEqual(result['preserved_files'],2)
        self.assertFalse(self.target.exists());self.assertEqual(outside.read_text(),'must remain')
        self.assertTrue(Path(result['archive']).is_file())

    def test_dirty_and_active_checkouts_are_preserved(self):
        (self.target/'tracked.txt').write_text('user change')
        self.assertEqual(cleanup.retire_checkout(self.repo,self.day,self.entry)['status'],'preserved_dirty')
        (self.target/'tracked.txt').write_text('accepted')
        child=subprocess.Popen([sys.executable,'-c','import time;time.sleep(30)'],cwd=self.target)
        try:self.assertEqual(cleanup.retire_checkout(self.repo,self.day,self.entry)['status'],'preserved_active')
        finally:child.terminate();child.wait(timeout=5)
        self.assertTrue(self.target.exists())

    def test_unmerged_or_unregistered_work_is_never_removed(self):
        (self.target/'tracked.txt').write_text('not published')
        self.git('add','tracked.txt',cwd=self.target)
        self.git('-c','user.name=Test','-c','user.email=test@example.com','commit','--quiet','-m','unmerged',cwd=self.target)
        with self.assertRaises(subprocess.CalledProcessError):
            cleanup.retire_checkout(self.repo,self.day,{**self.entry,'head':self.git('rev-parse','HEAD',cwd=self.target)})
        with self.assertRaisesRegex(RuntimeError,'path_rejected'):
            cleanup.retire_checkout(self.repo,self.day,{'checkout':str(self.repo),'head':self.head})
        self.assertTrue(self.target.exists())

    def test_cleanup_reads_only_its_explicit_registry_and_is_idempotent(self):
        unknown=self.day/'other-work';unknown.mkdir();(unknown/'keep.txt').write_text('keep')
        (self.day/'temporary-checkouts.json').write_text(json.dumps([self.entry]))
        self.assertEqual(cleanup.cleanup(self.repo,self.day)['results'][0]['status'],'removed')
        self.assertEqual(cleanup.cleanup(self.repo,self.day)['results'][0]['status'],'already_removed')
        self.assertTrue((unknown/'keep.txt').exists())


if __name__=='__main__':unittest.main()
