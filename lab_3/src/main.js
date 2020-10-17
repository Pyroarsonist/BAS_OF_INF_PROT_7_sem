import fs from 'fs';
import User from './User';
import { initMenu } from './menu';
import { createHash } from 'crypto';
import { getData } from './os';
import { parseKey, parseSignature } from 'sshpk';
import inquirer from 'inquirer';
import { makeRC4Hash, parseRC4HashedString } from './crypto';

const FILE = './data.txt';

const askForPassword = async () => {
  const { password } = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      mask: '*',
    },
  ]);
  return password;
};

const assertData = async (password) => {
  try {
    const hash = fs.readFileSync(FILE).toString();
    const str = await parseRC4HashedString(hash, password);
    const data = JSON.parse(str);
    console.info('Parsed data successfully!');
    return data;
  } catch (e) {
    console.info('Creating initial data');
    const admin = new User(true, 'ADMIN');
    const data = {
      passwordValidation: true,
      users: [admin],
    };
    await saveData(data, password);
    return data;
  }
};

const saveData = async (data, password) => {
  const hash = await makeRC4Hash(JSON.stringify(data), password);
  const buffer = Buffer.from(hash);
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

  const password = await askForPassword();

  const data = await assertData(password);
  await initMenu(data);
  await saveData(data, password);
})();
