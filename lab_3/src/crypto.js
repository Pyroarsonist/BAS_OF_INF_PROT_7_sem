import { createHash, createDecipheriv, createCipheriv } from 'crypto';

const SALT = 'lkgnkd4gi24ngi24h9g';

const makeMD5Hash = async (password) => {
  return createHash('md5')
    .update(password + SALT)
    .toString();
};

export const parseRC4HashedString = async (str, password) => {
  const key = await makeMD5Hash(password);
  const decipher = createDecipheriv('rc4', key, '');
  let decrypted = decipher.update(str, 'hex');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const makeRC4Hash = async (str, password) => {
  const key = await makeMD5Hash(password);
  const decipher = createCipheriv('rc4', key, '');
  return decipher.update(str, 'utf8', 'hex');
};
