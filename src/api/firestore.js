import { getFirestore, collection, doc, setDoc, query as firestoreQuery, where, getDocs } from "firebase/firestore";
import { app } from './firebase'

const firestoreDb = getFirestore(app);

export async function writeNewPost(post) {
    try {
        // 'doc' refers to a specific document within a collection.
        // 'setDoc' creates or overwrites a document.
        await setDoc(doc(firestoreDb, "posts", post.id), post);
        console.log("Firestore: Post saved successfully!");
    } catch (error) {
        console.error("Firestore: The write failed:", error);
        throw error; // Re-throw to handle higher up if needed
    }
}

export async function getAllQuestions() {
    try {
        // get a reference to the 'posts' collection
        const postsCollectionRef = collection(firestoreDb, "posts");
        // build a query to fetch only documents where postType is "question"
        const q = firestoreQuery(postsCollectionRef, where("postType", "==", "question"));
        // get all documents matching the query
        const querySnapshot = await getDocs(q);
        // map each document to its data and include the id
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return posts;
    } catch (error) {
        console.error("Firestore: Error getting all questions:", error);
        throw error;
    }
}

// export async function getUserByEmailFirestore(emailToFind) {
//     try {
//         // 1. Get a reference to the 'users' collection.
//         const usersCollectionRef = collection(firestoreDb, 'users');

//         // 2. Build a query: Look in the 'users' collection where the 'email' field equals 'emailToFind'.
//         const q = firestoreQuery(usersCollectionRef, where('email', '==', emailToFind));

//         // 3. Execute the query and get a snapshot of the results.
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//             // Iterate over the documents found (should be one if email is unique)
//             let foundUser = null;
//             querySnapshot.forEach((document) => {
//                 // document.data() retrieves the data object from the document.
//                 foundUser = document.data();
//                 console.log(`Firestore: Found user:`, foundUser);
//             });
//             return foundUser;
//         } else {
//             console.log("Firestore: No user found with that email.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Firestore: Error querying user by email:", error);
//         throw error;
//     }
// }
