import { useState } from 'react';
import Heading from '../components/create-post/Heading';
import PostType from '../components/create-post/PostType';
import PostForm from '../components/create-post/PostForm';
import NavBar from '../components/NavBar';
import { addNewPost } from '../services/post';
import { useAuth } from '../hooks/useAuth';

export default function CreatePost() {
    const [postSuccess, setPostSucces] = useState(null)
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        postType: 'question',
        title: '',
        image: '',
        questionDescription: '',
        articleAbstract: '',
        articleText: '',
        tags: '',
    });
    const [errors, setErrors] = useState({});
    // const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // clear error when user starts typing/selecting
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.postType.trim()) {
            newErrors.postType = 'Post type is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters'
        }

        switch (formData.postType) {
            case "question":
                if (!formData.questionDescription.trim()) {
                    newErrors.questionDescription = 'Description is required';
                } else if (formData.questionDescription.trim().length < 100) {
                    newErrors.questionDescription = 'Description must be at least 100 characters';
                }
                break;
                
            case "article":
                if (!formData.articleAbstract.trim()) {
                    newErrors.articleAbstract = 'Abstract is required';
                } else if (formData.articleAbstract.trim().length < 10) {
                    newErrors.articleAbstract = 'Abstract must be at least 10 characters';
                }

                if (!formData.articleText.trim()) {
                    newErrors.articleText = 'Article text is required';
                } else if (formData.articleText.trim().length < 50) {
                    newErrors.articleText = 'Abstract text must be at least 50 characters';
                }
                break;
                    
            default:
                break;
        }

        if (!formData.tags.trim()) {
            newErrors.tags = 'Please add at least one tag';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit (e) {
        e.preventDefault();
        if (validateForm()) {
            try {
                await addNewPost(formData, user);
                setPostSucces(true)
            }
            catch(error) {
                setPostSucces(false)
                console.log("Caught an error in handleSubmit:")
                console.log(error)
            }
        }
    };

    return (<>
        <NavBar />
        <div className='container-fluid p-5'>
            <Heading>New Post</Heading>
            <PostType formData={formData} handleInputChange={handleInputChange} errors={errors} />

            <Heading>What do you want to {formData.postType == "question" ? "ask" : "share"}</Heading>
            <PostForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} errors={errors} />

            {postSuccess !== null && 
            <div className="mt-3 container-fluid text-center">
                <div className={`p-2 d-inline-block rounded bg-${postSuccess ? "success" : "danger"}-subtle`}>
                {postSuccess ? "Post Successful!" : "Post Failed :("}
                </div>
            </div>
            }
        </div>
    </>)
}