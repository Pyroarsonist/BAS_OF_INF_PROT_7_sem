import fs from 'fs';
import User from './User';
import { initMenu } from './menu';
import { createHash } from 'crypto';
import { getData } from './os';
import { parseKey, parseSignature } from 'sshpk';

const FILE = './data.txt';

const assertData = () => {
  try {
    const buffer = fs.readFileSync(FILE);
    return JSON.parse(buffer.toString());
  } catch (e) {
    console.info('Creating initial data');
    const admin = new User(true, 'ADMIN');
    const buffer = Buffer.from(JSON.stringify([admin]));
    fs.writeFileSync(FILE, buffer);
    return {
      passwordValidation: true,
      users: [admin],
    };
  }
};

const saveData = (data) => {
  const buffer = Buffer.from(JSON.stringify(data));
  fs.writeFileSync(FILE, buffer);
};

(async () => {
  console.info('Starting logging panel');

  try {
    const publicKeyFile = fs.readFileSync('./key.pub');
    const publicKey = parseKey(publicKeyFile, 'ssh');

    const hash = createHash('md5')
      .update(await getData())
      .digest('hex');

    const sign = fs.readFileSync('./sign');
    const isValid = publicKey.createVerify('sha256').update(hash).verify(parseSignature(sign.toString(), 'rsa', 'hex'));
    if (!isValid) throw new Error('Sign invalid!');
  } catch (e) {
    console.error('Sign invalid!');
    return;
  }

  console.info('Signature valid!');

  const data = assertData();
  await initMenu(data);
  await saveData(data);
})();
