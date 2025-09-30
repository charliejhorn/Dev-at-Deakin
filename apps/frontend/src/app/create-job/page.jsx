"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

async function createJob(url, { arg: body }) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {
        const err = new Error("request failed");
        err.status = res.status;
        err.info = await res.json().catch(() => ({}));
        throw err;
    }
    return res.json();
}

// backend jobs endpoint takes:
// title, customer, mechanic, start, end, status, notes
// title and customer are required

export default function CreateJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        customer: "",
        mechanic: "",
        start: "",
        end: "",
        status: "pending",
        notes: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    // trigger(payload) performs the mutation
    // isMutating is true while the request is unresolved
    const { trigger, isMutating, error } = useSWRMutation(
        "http://localhost:4000/api/jobs",
        createJob
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    function navigateJobs() {
        router.push("/jobs");
    }

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Job title is required";
        }

        if (!formData.customer.trim()) {
            newErrors.customer = "Customer name is required";
        }

        if (formData.start && formData.end) {
            const startDate = new Date(formData.start);
            const endDate = new Date(formData.end);
            if (endDate <= startDate) {
                newErrors.end = "End date must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            try {
                // create the job by triggering the mutation
                const data = await trigger(formData);
                setMessage("Job created successfully!");
                // optionally redirect to jobs list after success
                // router.push("/jobs");
            } catch (error) {
                console.log(error);
                if (error.status === 400) {
                    setMessage("Invalid job data. Please check your inputs.");
                } else {
                    setMessage(
                        `Error creating job. Response status: ${error.status}`
                    );
                }
            }
        }
    }

    return (
        <>
            <div className="container-fluid">
                <div className="d-flex justify-content-between">
                    <h2>Create New Job</h2>
                    <Link href={"/jobs"} className="btn btn-secondary">
                        View Jobs
                    </Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-3">
                        <label htmlFor="title">Job Title*</label>
                        <input
                            type="text"
                            className={`form-control ${
                                errors.title ? "is-invalid" : ""
                            }`}
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.title && (
                            <div className="invalid-feedback">
                                {errors.title}
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="customer">Customer Name*</label>
                        <input
                            type="text"
                            className={`form-control ${
                                errors.customer ? "is-invalid" : ""
                            }`}
                            id="customer"
                            name="customer"
                            value={formData.customer}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.customer && (
                            <div className="invalid-feedback">
                                {errors.customer}
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="mechanic">Mechanic Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="mechanic"
                            name="mechanic"
                            value={formData.mechanic}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mt-3">
                                <label htmlFor="start">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className={`form-control ${
                                        errors.start ? "is-invalid" : ""
                                    }`}
                                    id="start"
                                    name="start"
                                    value={formData.start}
                                    onChange={handleInputChange}
                                />
                                {errors.start && (
                                    <div className="invalid-feedback">
                                        {errors.start}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mt-3">
                                <label htmlFor="end">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className={`form-control ${
                                        errors.end ? "is-invalid" : ""
                                    }`}
                                    id="end"
                                    name="end"
                                    value={formData.end}
                                    onChange={handleInputChange}
                                />
                                {errors.end && (
                                    <div className="invalid-feedback">
                                        {errors.end}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="status">Status</label>
                        <select
                            className="form-control"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            className="form-control"
                            id="notes"
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Additional notes about the job..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-3 btn btn-primary"
                        disabled={
                            !formData.title || !formData.customer || isMutating
                        }
                    >
                        {isMutating ? "Creating Job…" : "Create Job"}
                    </button>

                    {message && (
                        <div
                            className={`mt-3 alert ${
                                message.includes("successful")
                                    ? "alert-success"
                                    : "alert-danger"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
