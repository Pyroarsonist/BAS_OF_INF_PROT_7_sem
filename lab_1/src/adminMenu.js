import inquirer from "inquirer";
import { changePassword } from "./menu";
import User from "./User";

const blockUser = async (data) => {
  const { username } = await inquirer.prompt({
    type: "input",
    message: "Enter username to ban",
    name: "username",
  });

  const user = data.users.find((u) => u.username === username);
  if (!user) {
    console.log("Such user not found");
    return;
  }

  user.blocked = true;
  console.log("User successfully blocked");
};

const addUser = async (data) => {
  const { username } = await inquirer.prompt({
    type: "input",
    message: "Enter username",
    name: "username",
  });

  const user = data.users.find((u) => u.username === username);
  if (user) {
    console.log("Such user already found");
    return;
  }

  data.users.push(new User(false, username));
  console.log("User successfully added");
};

const passwordOptions = async (data) => {
  const { passwordIsOn } = await inquirer.prompt({
    type: "checkbox",
    name: "passwordIsOn",
    message: "Choose password option",
    choices: [
      { name: "Password verification", checked: data.passwordValidation },
    ],
  });

  data.passwordValidation = passwordIsOn.includes("Password verification");
};

const listUsers = async (data) => {
  const { user } = await inquirer.prompt({
    type: "list",
    name: "user",
    message: "Choose user",
    choices: data.users.map((u) => ({
      name: `${u.username} - ${u.blocked ? "Blocked" : "Not blocked"} - ${
        u.passwordVerification ? "Verification on" : "Verification off"
      }`,
      value: u,
    })),
  });

  console.log(`User - ${user.username}`);
  console.log(`Blocked: ${!!user.blocked}`);
  console.log(`Verification: ${!!user.passwordVerification}`);
  console.log(`Password set: ${!!user.password}`);
  console.log(`Admin: ${!!user.isAdmin}`);

  await inquirer.prompt({
    type: "confirm",
    name: "ok",
    message: "OK?",
  });
};

export const adminMenu = async (data, user) => {
  const { menu } = await inquirer.prompt({
    type: "list",
    name: "menu",
    message: "Admin Menu | What do you want to do?",
    choices: [
      "Change password",
      "List users",
      "Add new user",
      "Ban user",
      "Password options",
      new inquirer.Separator(),
      "Exit",
    ],
  });

  if (menu === "Exit") return;

  if (menu === "Password options") {
    await passwordOptions(data);
  }

  if (menu === "Block user") {
    await blockUser(data);
  }

  if (menu === "Add new user") {
    await addUser(data);
  }

  if (menu === "List users") {
    await listUsers(data);
  }

  if (menu === "Change password") {
    await changePassword(data.passwordValidation, user);
  }

  await adminMenu(data, user);
};
