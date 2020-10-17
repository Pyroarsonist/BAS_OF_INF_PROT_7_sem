import util from 'util';
import { exec as execWithCB } from 'child_process';
import os from 'os';

const exec = util.promisify(execWithCB);

const getUserName = () => {
  return os.userInfo().username;
};

const getPCName = () => {
  return os.hostname();
};

const getOSInstalledFolder = () => {
  return '/';
};

const getSystemFilesInstalledFolder = () => {
  return os.homedir();
};

const getKeyboardInfo = async () => {
  const { stdout } = await exec(`grep keyboard /sys/class/input/*/name`);
  return stdout?.split(':')?.[1]?.trim();
};

const getDisplayWidth = async () => {
  const { stdout } = await exec(`xdpyinfo | grep dimensions | sed -r 's/^[^0-9]*([0-9]+x[0-9]+).*$/\\1/'`);
  return stdout?.split('x')?.[0]?.trim();
};

const getRam = () => os.totalmem();

const getDiskTotalSize = async () => {
  const { stdout } = await exec(`df -h / | awk '{print $2;}'`);
  return stdout?.split('Size')?.[1]?.trim();
};

export const getData = async () => {
  const userName = await getUserName();
  const pcName = await getPCName();
  const osInstalledFolder = await getOSInstalledFolder();
  const systemInstalledFolder = await getSystemFilesInstalledFolder();
  const keyboardInfo = await getKeyboardInfo();
  const displayWidth = await getDisplayWidth();
  const ram = getRam();
  const diskTotalSize = await getDiskTotalSize();
  const data = {
    userName,
    pcName,
    osInstalledFolder,
    systemInstalledFolder,
    keyboardInfo,
    displayWidth,
    ram,
    diskTotalSize,
  };
  return JSON.stringify(data);
};
