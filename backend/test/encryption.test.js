import test from 'node:test';
import assert from 'node:assert/strict';

const validKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.ENCRYPTION_KEY = validKey;
const { decrypt, encrypt, getEncryptionKey } = await import('../src/utils/encryption.js');

test('getEncryptionKey returns exactly 32 bytes for a valid key', () => {
  assert.equal(getEncryptionKey().length, 32);
});

test('encrypt and decrypt preserve answer text', () => {
  const encrypted = encrypt('Option B');
  assert.match(encrypted, /^[0-9a-f]{32}:[0-9a-f]+$/);
  assert.equal(decrypt(encrypted), 'Option B');
});

test('getEncryptionKey rejects malformed keys', () => {
  const original = process.env.ENCRYPTION_KEY;
  process.env.ENCRYPTION_KEY = 'not-a-key';
  assert.throws(() => getEncryptionKey(), /64 hexadecimal/);
  process.env.ENCRYPTION_KEY = '';
  assert.throws(() => getEncryptionKey(), /ENCRYPTION_KEY is required/);
  process.env.ENCRYPTION_KEY = original;
});
