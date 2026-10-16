import importlib.util
from pathlib import Path
import tempfile
import unittest
import os

spec=importlib.util.spec_from_file_location('hermes_review',Path(__file__).parents[1]/'hermes-review.py')
review=importlib.util.module_from_spec(spec); spec.loader.exec_module(review)

class ReadBoundaryTests(unittest.TestCase):
    def test_review_budget_covers_actual_publication_changes(self):
        self.assertGreaterEqual(review.review_iteration_budget({}),96)
        self.assertEqual(review.review_iteration_budget({'delta':{'subjects':{'added':7,'changed':2}}}),104)
        self.assertEqual(review.review_iteration_budget({'delta':{'events':{'added':1000}}}),240)

    def test_packet_quotes_cannot_replace_private_original_review(self):
        context={'required_originals':{'FI-a':[{'path':'objects/a.txt'}],'FI-b':[{'path':'funding-research/b.json'}]}}
        with self.assertRaisesRegex(RuntimeError,'FI-a,FI-b'):
            review.assert_original_coverage(context,[{'root':'context','path':'publication-delta/subjects-added-FI-a.json'}])
        with self.assertRaisesRegex(RuntimeError,'FI-b'):
            review.assert_original_coverage(context,[{'root':'evidence','path':'objects/a.txt'}])
        review.assert_original_coverage(context,[{'root':'evidence','path':'objects/a.txt'},{'root':'evidence','path':'funding-research/b.json'}])

    @unittest.skipIf(os.name == 'nt', 'VPS symlink boundaries are tested on Linux')
    def test_traversal_credentials_and_symlinks_are_blocked(self):
        with tempfile.TemporaryDirectory() as temp:
            base=Path(temp); repo=base/'repo'; repo.mkdir()
            (base/'secret').write_text('private')
            (repo/'.env').write_text('secret')
            (repo/'safe.md').write_text('evidence\n' * 600)
            (repo/'escape').symlink_to(base/'secret')
            (repo/'credential-alias').symlink_to(repo/'.env')
            roots={'repo':repo.resolve()}
            for name in ['../secret','.env','escape','credential-alias',str(base/'secret')]:
                self.assertIn('error',review.read_file(roots,{'path':name}))
            self.assertEqual(len(review.read_file(roots,{'path':'safe.md','limit':999})['lines']),500)
            found=review.find_files(roots,{'contains':'private'})
            self.assertEqual(found['matches'],[])
            self.assertEqual(review.find_files(roots,{'contains':'evidence'})['matches'],['safe.md'])

if __name__=='__main__':
    unittest.main()
