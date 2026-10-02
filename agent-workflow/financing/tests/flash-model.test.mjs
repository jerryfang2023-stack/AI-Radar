import test from 'node:test';
import assert from 'node:assert/strict';
import {deepSeekModels, selectDeepSeekModel} from '../../tools/deepseek-translation-client.mjs';
test('new DeepSeek jobs use canonical Flash for both short and complex prompts',()=>{
  assert.deepEqual(deepSeekModels({}),{flash:'deepseek-flash',pro:'deepseek-flash'});
  assert.equal(selectDeepSeekModel('a'.repeat(1000),{env:{}}),'deepseek-flash');
  assert.equal(selectDeepSeekModel('short',{preferPro:true,env:{}}),'deepseek-flash');
  assert.deepEqual(deepSeekModels({DEEPSEEK_FLASH_MODEL:'custom-fast',DEEPSEEK_PRO_MODEL:'custom-review'}),{flash:'custom-fast',pro:'custom-review'});
});
