"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { createPostAction } from "@/app/lib/actions/posts";

const INITIAL_FORM = {
    postType: "question",
    title: "",
    tags: "",
    image: "",
    status: "draft",
    questionDescription: "",
    questionDescriptionUseMarkdown: false,
    questionCodeSnippet: "",
    articleAbstract: "",
    articleText: "",
};

const INITIAL_STATE = {
    success: false,
    errors: {},
    message: null,
    data: null,
};

export default function CreatePostForm({ user }) {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [state, action] = useActionState(createPostAction, INITIAL_STATE);
    const [isPending, startTransition] = useTransition();

    const postType = formData.postType;

    const disabled = useMemo(() => isPending, [isPending]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePostTypeChange = (event) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            postType: value,
            questionDescription:
                value === "question" ? prev.questionDescription : "",
            questionDescriptionUseMarkdown:
                value === "question"
                    ? prev.questionDescriptionUseMarkdown
                    : false,
            questionCodeSnippet:
                value === "question" ? prev.questionCodeSnippet : "",
            articleAbstract: value === "article" ? prev.articleAbstract : "",
            articleText: value === "article" ? prev.articleText : "",
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        startTransition(async () => {
            const result = await action({
                ...formData,
            });
            if (result?.success) {
                setFormData(INITIAL_FORM);
            }
        });
    };

    const renderFieldError = (field) => {
        if (!state?.errors?.[field]) return null;
        return (
            <div className="invalid-feedback d-block">
                {state.errors[field]}
            </div>
        );
    };

    const generalError = state?.errors?.general;

    const successMessage = state?.success
        ? state?.message || "Post created successfully"
        : null;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h2 className="mb-0">Create a new post</h2>
                        </div>
                        <div className="card-body">
                            {user && (
                                <p className="text-secondary">
                                    Posting as {user.firstName || user.email}
                                </p>
                            )}

                            {generalError && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {generalError}
                                </div>
                            )}

                            {successMessage && (
                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >
                                    {successMessage}
                                    {state?.data?.id && (
                                        <div className="mt-3">
                                            <Link
                                                href="/posts/questions"
                                                className="btn btn-sm btn-outline-success"
                                            >
                                                View posts
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="postType"
                                    >
                                        Post type
                                    </label>
                                    <select
                                        id="postType"
                                        name="postType"
                                        className="form-select"
                                        value={formData.postType}
                                        onChange={handlePostTypeChange}
                                        disabled={disabled}
                                    >
                                        <option value="question">
                                            Question
                                        </option>
                                        <option value="article">Article</option>
                                    </select>
                                    {renderFieldError("postType")}
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="title"
                                    >
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        className={`form-control${
                                            state?.errors?.title
                                                ? " is-invalid"
                                                : ""
                                        }`}
                                        value={formData.title}
                                        onChange={handleChange}
                                        disabled={disabled}
                                        placeholder="Enter a descriptive title"
                                    />
                                    {renderFieldError("title")}
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="tags"
                                    >
                                        Tags
                                    </label>
                                    <input
                                        id="tags"
                                        name="tags"
                                        type="text"
                                        className="form-control"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        disabled={disabled}
                                        placeholder="Comma separated tags"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="image"
                                    >
                                        Image URL
                                    </label>
                                    <input
                                        id="image"
                                        name="image"
                                        type="url"
                                        className="form-control"
                                        value={formData.image}
                                        onChange={handleChange}
                                        disabled={disabled}
                                        placeholder="Optional image URL"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="status"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={disabled}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>

                                {postType === "question" && (
                                    <>
                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                htmlFor="questionDescription"
                                            >
                                                Question description
                                            </label>
                                            <textarea
                                                id="questionDescription"
                                                name="questionDescription"
                                                className={`form-control${
                                                    state?.errors
                                                        ?.questionDescription
                                                        ? " is-invalid"
                                                        : ""
                                                }`}
                                                value={
                                                    formData.questionDescription
                                                }
                                                onChange={handleChange}
                                                disabled={disabled}
                                                rows={5}
                                                placeholder="Describe your question"
                                            />
                                            {renderFieldError(
                                                "questionDescription"
                                            )}
                                        </div>

                                        <div className="form-check mb-3">
                                            <input
                                                id="questionDescriptionUseMarkdown"
                                                name="questionDescriptionUseMarkdown"
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={
                                                    formData.questionDescriptionUseMarkdown
                                                }
                                                onChange={handleChange}
                                                disabled={disabled}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="questionDescriptionUseMarkdown"
                                            >
                                                Use markdown for description
                                            </label>
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                htmlFor="questionCodeSnippet"
                                            >
                                                Code snippet
                                            </label>
                                            <textarea
                                                id="questionCodeSnippet"
                                                name="questionCodeSnippet"
                                                className="form-control"
                                                value={
                                                    formData.questionCodeSnippet
                                                }
                                                onChange={handleChange}
                                                disabled={disabled}
                                                rows={4}
                                                placeholder="Optional code snippet"
                                            />
                                        </div>
                                    </>
                                )}

                                {postType === "article" && (
                                    <>
                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                htmlFor="articleAbstract"
                                            >
                                                Article abstract
                                            </label>
                                            <textarea
                                                id="articleAbstract"
                                                name="articleAbstract"
                                                className={`form-control${
                                                    state?.errors
                                                        ?.articleAbstract
                                                        ? " is-invalid"
                                                        : ""
                                                }`}
                                                value={formData.articleAbstract}
                                                onChange={handleChange}
                                                disabled={disabled}
                                                rows={4}
                                                placeholder="Summarize your article"
                                            />
                                            {renderFieldError(
                                                "articleAbstract"
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                htmlFor="articleText"
                                            >
                                                Article text
                                            </label>
                                            <textarea
                                                id="articleText"
                                                name="articleText"
                                                className={`form-control${
                                                    state?.errors?.articleText
                                                        ? " is-invalid"
                                                        : ""
                                                }`}
                                                value={formData.articleText}
                                                onChange={handleChange}
                                                disabled={disabled}
                                                rows={8}
                                                placeholder="Write your article"
                                            />
                                            {renderFieldError("articleText")}
                                        </div>
                                    </>
                                )}

                                <div className="d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={disabled}
                                    >
                                        {isPending
                                            ? "Creating..."
                                            : "Create post"}
                                    </button>
                                    <Link
                                        href="/"
                                        className="btn btn-outline-secondary"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
