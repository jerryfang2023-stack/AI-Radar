import importlib.util
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('hermes_review',Path(__file__).parents[1]/'hermes-review.py')
review=importlib.util.module_from_spec(spec); spec.loader.exec_module(review)

class ReadBoundaryTests(unittest.TestCase):
    def test_traversal_credentials_and_symlinks_are_blocked(self):
        with tempfile.TemporaryDirectory() as temp:
            base=Path(temp); repo=base/'repo'; repo.mkdir()
            (base/'secret').write_text('private')
            (repo/'.env').write_text('secret')
            (repo/'safe.md').write_text('evidence\n' * 600)
            (repo/'escape').symlink_to(base/'secret')
            roots={'repo':repo.resolve()}
            for name in ['../secret','.env','escape',str(base/'secret')]:
                self.assertIn('error',review.read_file(roots,{'path':name}))
            self.assertEqual(len(review.read_file(roots,{'path':'safe.md','limit':999})['lines']),500)
            found=review.find_files(roots,{'contains':'private'})
            self.assertEqual(found['matches'],[])
            self.assertEqual(review.find_files(roots,{'contains':'evidence'})['matches'],['safe.md'])

if __name__=='__main__':
    unittest.main()
