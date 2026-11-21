import assert from 'node:assert/strict';
import { test } from 'node:test';
import { safetyLevel } from '../src/data/safety.mjs';
import { chatResponse } from '../server/chat.mjs';

test('the reported child breathing symptoms go to urgent guidance', () => {
  assert.equal(safetyLevel('My son is 8. He’s breathing really fast, sweating and shaking.'), 'urgent');
  assert.equal(safetyLevel('he is not breathing properly'), 'emergency');
  assert.equal(safetyLevel("he's still not slowing", 'He was breathing so fast'), 'urgent');
  assert.equal(safetyLevel('hes calming down', 'He was breathing so fast'), 'followup');
  assert.equal(safetyLevel('My 14-year-old is worried about exam results'), null);
});

test('emergency chat returns 112 guidance without contacting Gemini', async () => {
  const request = new Request('https://bridge.example/api/chat', {
    method: 'POST', headers: { origin: 'https://bridge.example' },
    body: JSON.stringify({ messages: [{ role: 'user', text: 'He is struggling to breathe and has blue lips' }] })
  });
  const response = await chatResponse(request, 'unused-test-key');
  const data = await response.json();
  assert.equal(data.level, 'emergency');
  assert.match(data.parts[1], /Call 112 now/);
});

test('safe demo questions can fall back when no key is set', async () => {
  const request = new Request('https://bridge.example/api/chat', { method: 'POST' });
  assert.deepEqual(await (await chatResponse(request)).json(), { mode: 'demo' });
});
