import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  // Ensure key is 32 bytes (256 bits)
  const key = Buffer.from(ENCRYPTION_KEY, 'hex'); 

  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text.toString());
  
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  
  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
