import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAlertPayload } from './normalizeAlertPayload.js';

test('normalizes nested alert payloads from socket events', () => {
  const payload = {
    alert: {
      id: 'alert-1',
      title: 'Liquidity alert',
      severity: 'high',
      confidence: 87,
      provider: 'bkash',
    },
    case: { id: 'case-1' },
    localizedTitle: { en: 'Liquidity alert' },
  };

  const normalized = normalizeAlertPayload(payload);

  assert.equal(normalized.id, 'alert-1');
  assert.equal(normalized.title, 'Liquidity alert');
  assert.equal(normalized.severity, 'high');
  assert.equal(normalized.provider, 'bkash');
});

test('returns direct alert payloads unchanged', () => {
  const payload = {
    id: 'alert-2',
    title: 'Direct alert',
    severity: 'medium',
    confidence: 64,
  };

  assert.deepEqual(normalizeAlertPayload(payload), payload);
});
