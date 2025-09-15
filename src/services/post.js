import { writeNewPost, getAllQuestions } from '../api/firestore'
import { uploadImage } from '../api/imgbb';

export async function addNewPost(formData, user) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

    var post = {
        id: id,
        postType: formData.postType,
        title: formData.title,
        tags: formData.tags,
        createdBy: user ? {
            id: user.id,
            displayName: `${user.firstName} ${user.lastName}` || '',
        } : null,
        createdAt: new Date().toISOString()
    }
    
    if(formData.image) {
        post.image = await uploadImage(formData.image);
    }

    switch (formData.postType) {
        case "question":
            post.questionDescription = formData.questionDescription;
            break;
        
        case "article":
            post.articleAbstract = formData.articleAbstract;
            post.articleText = formData.articleText;
            break;
            
        default:
            throw new Error("Post type was not valid.")
    }

    await writeNewPost(post);
}

// get all questions from firestore
export async function fetchAllQuestions() {
    try {
        const posts = await getAllQuestions();
        // filter only questions
        return posts.filter(post => post.postType === "question");
    } catch (error) {
        console.error("Error fetching all questions:", error);
        throw error;
    }
}

// export async function loginUser(formData) {
//     console.log(`Logging in ${formData.email}`);

//     let userData = await getUserByEmail(formData.email);

//     if (userData == null) {
//         console.log("in loginUser, userData is null")
//         throw emailDoesntExist;
//     }

//     let passwordCorrect = checkPassword(formData.password, userData.password);

//     console.log(`Password is ${passwordCorrect ? "correct" : "incorrect."}`)

//     return passwordCorrect;
// }

