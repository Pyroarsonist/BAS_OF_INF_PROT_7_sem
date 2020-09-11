import fs from 'fs'
import User from "./User";
import {initMenu} from "./menu";

const FILE = './data.txt'

const assertData = () => {
    try {
        const buffer = fs.readFileSync(FILE);
        return JSON.parse(buffer.toString())
    } catch (e) {
        console.log('Creating initial data')
        const admin = new User(true, 'ADMIN')
        const buffer = Buffer.from(JSON.stringify([admin]))
        fs.writeFileSync(FILE, buffer);
        return {
            passwordValidation: true,
            users: [admin]
        }
    }
};

const saveData = (data) => {
    const buffer = Buffer.from(JSON.stringify(data))
    fs.writeFileSync(FILE, buffer);
}


(async () => {
    console.log('Starting logging panel')
    const data = assertData()
    await initMenu(data)
    await saveData(data)
})()