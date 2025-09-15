import { writeNewUser, getUserByEmail } from '../api/realtime'
import { emailDoesntExist, passwordIncorrect } from '../utils/errors'
import bcrypt from "bcryptjs"

export function addNewUser(formData) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

    var user = {
        id: id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: hashPassword(formData.password)
    }

    writeNewUser(user);
}

export async function loginUser(formData) {
    console.log(`Logging in ${formData.email}`);

    let userData = await getUserByEmail(formData.email);

    if (userData == null) {
        console.log("in loginUser, userData is null")
        throw emailDoesntExist;
    }

    let passwordCorrect = checkPassword(formData.password, userData.password);

    console.log(`Password is ${passwordCorrect ? "correct" : "incorrect."}`)

    if (!passwordCorrect) {
        throw passwordIncorrect;
    }

    // return the user object if password is correct
    return userData;
}

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

function checkPassword(givenPassword, storedHash) {
    return bcrypt.compareSync(givenPassword, storedHash);
}

