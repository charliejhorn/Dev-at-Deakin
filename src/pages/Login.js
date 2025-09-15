import { useState } from 'react';
import { loginUser } from "../services/user"
import { emailDoesntExist, passwordIncorrect } from '../utils/errors'
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
            const newErrors = {};
    
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
    
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (validateForm()) {
                try {
                    const userData = await loginUser(formData);
                    await login( userData );
                }
                catch(error) {
                    const newErrors = {}
                    switch (error) {
                        case emailDoesntExist:
                            newErrors.email = "Email doesn't exist";
                            break;
                            
                        case passwordIncorrect:
                            newErrors.password = "Password is incorrect"
                            break

                        default:
                            console.log(error)
                    }
                    setErrors(newErrors)
                }
            }
        };

    return(
        <>
            {/* <img className="position-absolute z-n1 centered" src="egg.png"></img> */}
            <a className="position-absolute m-2 top-0 end-0" href="/">Back to Home</a>
            <div className="text-center p-5">
                <div className="container-fluid text-start w-75 border rounded p-4 shadow blur">
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-between">
                            <h2>Login to Dev@Deakin</h2>
                            <a href={"signup"}
                                className='p-3 text-secondary-emphasis bg-secondary-subtle rounded-5
                                    link-secondary link-offset-2-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
                            >{"Sign up"}</a>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                aria-describedby="emailHelp"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="mt-3 btn btn-primary"
                            disabled={!formData.email || !formData.password}
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}