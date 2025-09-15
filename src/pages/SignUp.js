import { useState } from 'react';
import { addNewUser } from "../services/user"
import { useNavigate } from 'react-router';

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                addNewUser(formData);
                navigate("/login")
            }
            catch(error) {
                console.log(error)
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
                            <h2>Sign up for Dev@Deakin</h2>
                            <a href={"login"}
                                className='p-3 text-secondary-emphasis bg-secondary-subtle rounded-5
                                    link-secondary link-offset-2-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
                            >{"Login"}</a>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="firstName">First Name*</label>
                            <input
                                type="text"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="lastName">Last Name*</label>
                            <input
                                type="text"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address*</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password*</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="confirmPassword">Confirm Password*</label>
                            <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                        <button
                            type="submit"
                            className="mt-3 btn btn-primary"
                            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword}
                        >
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}