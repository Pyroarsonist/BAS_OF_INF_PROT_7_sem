import fs from 'fs';
import { getData } from './os';
import { createHash } from 'crypto';
import { /*parseKey,*/ parsePrivateKey } from 'sshpk';
import inquirer from 'inquirer';

const askFolderToInstall = async () => {
  const { folder } = await inquirer.prompt([
    {
      type: 'input',
      name: 'folder',
      message: 'Set install folder',
    },
  ]);
  return folder;
};

(async () => {
  console.info('Starting installer');
  const folder = await askFolderToInstall();

  const privateKeyFile = fs.readFileSync('./key');
  // const publicKeyFile = fs.readFileSync('./key.pub');

  const privateKey = parsePrivateKey(privateKeyFile, 'ssh');
  // const publicKey = parseKey(publicKeyFile, 'ssh');

  const hash = createHash('md5')
    .update(await getData())
    .digest('hex');

  const sign = privateKey.createSign('sha256').update(hash).sign();
  fs.writeFileSync('./sign', sign.toString());

  console.info(`Successfully installed to ${folder} and created sign ${sign}`);
})();
