import { getDatabase, ref, query, orderByChild, equalTo, get, set } from "firebase/database"
import { app } from "./firebase";

// initialise database and get connection
const database = getDatabase(app)

export function writeNewUser(user) {
    const db = database;

    set(ref(db, `users/${user.id}`), user)
        .then(() => {
            console.log("Realtime: User saved successfully!");
        })
        .catch((error) => {
            console.error("Realtime: The write failed:", error);
        });
}

export async function getUserByEmail(emailToFind) {
    const db = database;
    const usersRef = ref(db, 'users');
    const userQuery = query(usersRef, orderByChild('email'), equalTo(emailToFind));

    try {
        const snapshot = await get(userQuery);
        if (snapshot.exists()) {
            // the query returns a snapshot of all matching children
            // since email should be unique for a user, there should ideally be only one
            let foundUser = null;
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const userId = childSnapshot.key;
                foundUser = userData;
                // return the first user found
                return true;
            });
            return foundUser;
        } else {
            console.log("Realtime: No user found with that email.");
            return null;
        }
    } catch (error) {
        console.error("Realtime: Error querying user by email:", error);
        throw error;
    }
}