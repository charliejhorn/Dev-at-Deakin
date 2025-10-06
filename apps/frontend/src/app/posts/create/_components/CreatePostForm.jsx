"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createPostAction } from "@/app/lib/actions/posts";
import { fileToBase64 } from "@/app/lib/client/fileToBase64";
import PostType from "./PostType";
import PostForm from "./PostForm";

function Heading({ children }) {
    return (
        <div className="container-fluid bg-secondary-subtle p-2">
            <h2 className="text-start m-0">{children}</h2>
        </div>
    );
}

const INITIAL_FORM = {
    postType: "question",
    title: "",
    tags: "",
    image: null,
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
    const [pending, startTransition] = useTransition();
    const [clientErrors, setClientErrors] = useState({});

    // determine if required fields are filled and errors are cleared
    const requiredFieldsFilled = (() => {
        if (formData.postType === "question") {
            return (
                formData.title.trim() !== "" &&
                formData.questionDescription.trim() !== ""
            );
        } else if (formData.postType === "article") {
            return (
                formData.title.trim() !== "" &&
                formData.articleAbstract.trim() !== "" &&
                formData.articleText.trim() !== ""
            );
        }
        return false;
    })();

    // const serverErrors = state?.errors || {};
    // const mergedErrors = { ...serverErrors, ...clientErrors };

    // whenever state.errors changes, 'copy' them to clientErrors so they can be edited
    useEffect(() => {
        if (state?.errors && Object.keys(state.errors).length > 0) {
            setClientErrors(state.errors);
        }
    }, [state.errors]);

    const hasActiveErrors = (() => {
        if (formData.postType === "question") {
            return !!clientErrors.title || !!clientErrors.questionDescription;
        }
        if (formData.postType === "article") {
            return (
                !!clientErrors.title ||
                !!clientErrors.articleAbstract ||
                !!clientErrors.articleText ||
                !!clientErrors.image
            );
        }
        return false;
    })();

    const isPostDisabled =
        pending || !requiredFieldsFilled || hasActiveErrors || state?.success;

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else if (name === "questionDescriptionUseMarkdown") {
            setFormData((prev) => ({
                ...prev,
                [name]: !prev[name],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // reset errors when client starts typing
        if (clientErrors[name]) {
            console.log("resetting error");
            setClientErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    // need this specifically because handleInputChange doesn't work
    // because CodeMirror returns the content of the input field as the event
    const handleCodeSnippetChange = (code) => {
        setFormData((prev) => ({
            ...prev,
            questionCodeSnippet: code,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { image, ...payload } = formData;

        if (image instanceof File) {
            let base64;
            try {
                base64 = await fileToBase64(image);
            } catch (error) {
                console.error("failed to encode image", error);
                setClientErrors((prev) => ({
                    ...prev,
                    image: "We couldn't read that image. Please try another file.",
                }));
                return;
            }

            if (!base64) {
                setClientErrors((prev) => ({
                    ...prev,
                    image: "We couldn't read that image. Please try another file.",
                }));
                return;
            }

            payload.imageBase64 = {
                data: base64,
                name: image.name || undefined,
                type: image.type || undefined,
            };
        }

        startTransition(() => {
            action(payload);
        });
    };

    return (
        <div className="container-fluid p-5">
            <p className="text-secondary">
                Posting as {user?.firstName} {user?.lastName}
            </p>
            <Heading>New Post</Heading>
            <PostType
                formData={formData}
                handleInputChange={handleInputChange}
                errors={clientErrors}
            />

            <Heading>
                What do you want to{" "}
                {formData.postType == "question" ? "ask" : "share"}
            </Heading>
            <PostForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleCodeSnippetChange={handleCodeSnippetChange}
                handleSubmit={handleSubmit}
                errors={clientErrors}
                pending={pending}
                isPostDisabled={isPostDisabled}
            />

            {/* success message */}
            {state?.success && (
                <div className="mt-4 container-fluid text-center">
                    <div className="p-2 d-inline-block rounded bg-success-subtle">
                        {state.message}
                    </div>
                </div>
            )}

            {/* error message */}
            {clientErrors?.general && (
                <div className="mt-4 container-fluid text-center">
                    <div className="p-2 d-inline-block rounded bg-danger-subtle">
                        {clientErrors.general}
                    </div>
                </div>
            )}
        </div>
    );
}
