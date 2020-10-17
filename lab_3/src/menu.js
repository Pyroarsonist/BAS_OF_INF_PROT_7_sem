import inquirer from 'inquirer';
import { adminMenu } from './adminMenu';

const askMenu = async () =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'Menu | What do you want to do?',
      choices: ['Login', new inquirer.Separator(), 'Exit'],
    },
  ]);

export const initMenu = async (data) => {
  const { menu } = await askMenu();
  if (menu === 'Exit') {
    return;
  }

  await login(data);
};

const setPassword = async (passwordValidation, user) => {
  const validator = (value) => {
    if (/[A-Za-z]/.test(value) && /[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]/.test(value)) {
      return true;
    }

    return 'Password need to have at least one latin and cyrillic symbol';
  };

  const { password, passwordTwo } = await inquirer.prompt([
    {
      type: 'password',
      message: 'Enter password',
      name: 'password',
      mask: '*',
      ...(passwordValidation && { validate: validator }),
    },
    {
      type: 'password',
      message: 'Enter password second time',
      name: 'passwordTwo',
      mask: '*',
      ...(passwordValidation && { validate: validator }),
    },
  ]);

  if (passwordTwo !== password) {
    console.info('Password not matched');
    return;
  }

  user.password = password;
};

export const changePassword = async (passwordValidation, user) => {
  if (user.password) {
    const { password } = await inquirer.prompt({
      type: 'input',
      message: 'Enter old password',
      name: 'password',
    });
    if (password !== user.password) {
      console.info('Password invalid');
      return;
    }
  }
  await setPassword(passwordValidation, user);
};

const checkPassword = async (user, count = 1) => {
  if (count === 4) {
    process.exit(2);
  }
  const { password } = await inquirer.prompt({
    type: 'input',
    message: 'Enter password',
    name: 'password',
  });
  if (password !== user.password) {
    console.info('Password invalid');
    await checkPassword(user, count + 1);
  }
};

const login = async (data) => {
  const { users, passwordValidation } = data;
  const { username } = await inquirer.prompt({
    type: 'input',
    name: 'username',
    message: 'Username',
  });

  const user = users.find((u) => u.username === username);
  if (!user) {
    console.info('User not found');
    await login(data);
  }

  if (user.password) {
    await checkPassword(user);
  } else {
    await setPassword(passwordValidation, user);
  }

  if (user.isAdmin) {
    await adminMenu(data, user);
  } else {
    await userMenu(passwordValidation, user);
  }
};

const userMenu = async (passwordValidation, user) => {
  const { uMenu } = await inquirer.prompt({
    type: 'list',
    name: 'uMenu',
    message: 'User Menu | What do you want to do?',
    choices: ['Change password', new inquirer.Separator(), 'Exit'],
  });

  if (uMenu === 'Change password') {
    await changePassword(passwordValidation, user);
    await userMenu(passwordValidation, user);
  }
};
