import crypto from 'crypto';

const IV_LENGTH = 16;
const KEY_LENGTH_BYTES = 32;

export const getEncryptionKey = () => {
  const configuredKey = process.env.ENCRYPTION_KEY;

  if (!configuredKey) {
    throw new Error('ENCRYPTION_KEY is required and must contain 64 hexadecimal characters.');
  }

  if (!/^[0-9a-fA-F]{64}$/.test(configuredKey)) {
    throw new Error('ENCRYPTION_KEY must contain exactly 64 hexadecimal characters (32 bytes).');
  }

  const key = Buffer.from(configuredKey, 'hex');
  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error('ENCRYPTION_KEY must decode to exactly 32 bytes.');
  }

  return key;
};

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(payload) {
  if (typeof payload !== 'string' || !payload.includes(':')) {
    throw new Error('Invalid encrypted answer format.');
  }

  const [ivHex, encryptedHex] = payload.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  if (iv.length !== IV_LENGTH || encryptedText.length === 0) {
    throw new Error('Invalid encrypted answer payload.');
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc', getEncryptionKey(), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}
