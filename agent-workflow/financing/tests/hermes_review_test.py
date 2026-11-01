import importlib.util
from pathlib import Path
import tempfile
import unittest
import os
import json

spec=importlib.util.spec_from_file_location('hermes_review',Path(__file__).parents[1]/'hermes-review.py')
review=importlib.util.module_from_spec(spec); spec.loader.exec_module(review)

class ReadBoundaryTests(unittest.TestCase):
    def test_only_typed_transport_and_known_protocol_errors_are_retryable(self):
        for error in [TimeoutError('provider'),ConnectionError('provider'),RuntimeError('hermes_review_submission_missing')]:
            self.assertTrue(review.classify_failure(error)['retryable'])
        for error in [RuntimeError('unknown timeout business rule'),RuntimeError('hermes_review_identity_mismatch:head_sha')]:
            self.assertFalse(review.classify_failure(error)['retryable'])
        for status,expected in [(401,False),(403,False),(429,True),(503,True)]:
            error=RuntimeError('provider');error.status_code=status
            self.assertEqual(review.classify_failure(error)['retryable'],expected)

    def test_structured_submission_does_not_depend_on_prose_json(self):
        decision={'date':'2026-11-01','head_sha':'a'*40,'verdict':'approved',
                  'checks':{'sources':True,'facts':True,'scope':True,'classification':True,'preservation':True},
                  'evidence':['Original says "€1.5 million" and $2 million.'],'issues':[],'observations':[]}
        schema={'type':'object','required':list(decision),'additionalProperties':False,
                'properties':{key:{'type':kind} for key,kind in [('date','string'),('head_sha','string'),('verdict','string'),('checks','object'),('evidence','array'),('issues','array'),('observations','array')]}}
        context={'date':decision['date'],'head_commit':decision['head_sha'],'required_originals':{'FI-a':[{'path':'objects/a.txt'}]}}
        reads=[{'root':'evidence','path':'objects/a.txt'}]
        submission=review.ReviewSubmission(schema,context,reads)
        self.assertFalse(json.loads(submission.submit({'verdict':'approved'}))['accepted'])
        self.assertFalse(json.loads(submission.submit({**decision,'head_sha':'wrong'}))['accepted'])
        self.assertIsNone(submission.decision)
        self.assertTrue(json.loads(submission.submit(decision))['accepted'])
        with tempfile.TemporaryDirectory() as temp:
            result={'completed':True,'final_response':'Acknowledged. No JSON text needed.'}
            path=Path(temp)/'result.json';audit={'reads':reads}
            self.assertEqual(review.finalize_review(result,schema,context,audit,path,submission),decision)
            self.assertEqual(json.loads(path.read_text(encoding='utf-8')),decision)
            self.assertEqual(audit['decision_transport'],'validated_tool_submission')
            with self.assertRaisesRegex(RuntimeError,'incomplete'):
                review.finalize_review({**result,'partial':True},schema,context,audit,Path(temp)/'partial.json',submission)
        other=review.ReviewSubmission(schema,context,[])
        self.assertFalse(json.loads(other.submit(decision))['accepted'])
        self.assertIsNone(other.decision)
        self.assertFalse(json.loads(submission.submit({**decision,'verdict':'hold'}))['accepted'])
        self.assertTrue(submission.conflict)

    def test_single_final_json_can_follow_explanation_or_fence(self):
        expected={'verdict':'approved','checks':{'sources':True}}
        body=json.dumps(expected)
        for text in [body,'Review complete.\n'+body,'```json\n'+body+'\n```','Review complete.\n```json\n'+body+'\n```']:
            self.assertEqual(review.parse_review_response(text),expected)

    def test_multiple_incomplete_or_trailing_decisions_are_rejected(self):
        for text in ['{"verdict":"hold"}\n{"verdict":"approved"}', '{"verdict":"approved"', '{"verdict":"approved"}\nActually hold', 'approved']:
            with self.assertRaises(ValueError):
                review.parse_review_response(text)

    def test_recovered_output_preserves_identity_completion_and_read_gates(self):
        decision={'date':'2026-10-16','head_sha':'abc','verdict':'approved','checks':{'sources':True},'evidence':['original read and confirmed']}
        result={'completed':True,'final_response':'Review complete.\n'+json.dumps(decision)}
        context={'date':'2026-10-16','head_commit':'abc','required_originals':{'FI-a':[{'path':'objects/a.txt'}]}}
        audit={'verdict':'unknown','reads':[{'root':'evidence','path':'objects/a.txt'}]}
        with tempfile.TemporaryDirectory() as temp:
            target=Path(temp)/'result.json'
            for patch in [{'completed':False},{'partial':True},{'failed':True},{'interrupted':True}]:
                with self.assertRaisesRegex(RuntimeError,'incomplete'):
                    review.finalize_review({**result,**patch},{},context,dict(audit),target)
            with self.assertRaisesRegex(RuntimeError,'identity_mismatch'):
                review.finalize_review(result,{}, {**context,'head_commit':'different'},dict(audit),target)
            with self.assertRaisesRegex(RuntimeError,'without_reading'):
                review.finalize_review(result,{},context,{'reads':[]},target)
            with self.assertRaisesRegex(RuntimeError,'required_originals'):
                review.finalize_review(result,{},context,{'reads':[{'root':'repo','path':'packet.json'}]},target)
            self.assertFalse(target.exists())
            self.assertEqual(review.finalize_review(result,{},context,dict(audit),target),decision)
            with self.assertRaises(FileExistsError):
                review.finalize_review(result,{},context,dict(audit),target)

    def test_catalog_search_reads_beyond_the_old_prefix_limit(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            (root/'catalog.json').write_text('padding\n'*30000+'Uvi 模思智能 Tamr\n',encoding='utf-8')
            found=review.find_files({'repo':root.resolve()},{'glob':'catalog.json','contains':'模思智能'})
            self.assertEqual(found['matches'],['catalog.json'])
            self.assertEqual(found['match_locations'],[{'path':'catalog.json','line':30001}])
            self.assertTrue(found['search_complete'])
            excerpt=review.read_file({'repo':root.resolve()},{'path':'catalog.json','offset':30001,'limit':1})
            self.assertIn('Uvi 模思智能 Tamr',excerpt['lines'][0])
            self.assertTrue(review.find_files({'repo':root.resolve()},{'glob':'catalog.json','contains':'absent'})['search_complete'])

    def test_incomplete_search_cannot_prove_absence(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            (root/'broken.json').write_bytes(bytes([255]))
            result=review.find_files({'repo':root.resolve()},{'glob':'*.json','contains':'Uvi'})
            self.assertFalse(result['search_complete'])
            self.assertEqual(result['unreadable'],['broken.json'])

    def test_review_budget_covers_actual_publication_changes(self):
        self.assertGreaterEqual(review.review_iteration_budget({}),192)
        self.assertEqual(review.review_iteration_budget({'delta':{'subjects':{'added':7,'changed':2}}}),192)
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
