"use server";

import { createPostDAL } from "@/app/lib/dal/posts";
import { getUser } from "@/app/lib/dal/user";

const POST_TYPES = ["question", "article"];

function normalizeTags(tagsInput) {
    if (!tagsInput || typeof tagsInput !== "string") return [];
    return tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 10);
}

export async function createPostAction(prevState, payload = {}) {
    // wait for 0.5 seconds then simulate failure
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const message = "testing fail state";
    // return {
    //     success: false,
    //     errors: {
    //         general: message,
    //     },
    //     message,
    //     data: null,
    // };

    const errors = {};

    const postType =
        typeof payload.postType === "string"
            ? payload.postType.trim().toLowerCase()
            : "";
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const tags = normalizeTags(payload.tags);

    let imageBase64 = null;
    if (payload?.imageBase64 && typeof payload.imageBase64 === "object") {
        const data =
            typeof payload.imageBase64.data === "string"
                ? payload.imageBase64.data.trim()
                : "";
        const name =
            typeof payload.imageBase64.name === "string"
                ? payload.imageBase64.name.trim()
                : "";
        const type =
            typeof payload.imageBase64.type === "string"
                ? payload.imageBase64.type.trim()
                : "";

        if (data) {
            imageBase64 = {
                data,
                name: name || undefined,
                type: type || undefined,
            };
        }
    }

    if (!POST_TYPES.includes(postType)) {
        errors.postType = "Select a post type";
    }

    if (!title) {
        errors.title = "Title is required";
    } else if (title.length < 10) {
        errors.title = "Title must be at least 10 characters.";
    }

    let content = {};
    if (postType === "question") {
        const questionDescription =
            typeof payload.questionDescription === "string"
                ? payload.questionDescription.trim()
                : "";
        const questionDescriptionUseMarkdown = Boolean(
            payload.questionDescriptionUseMarkdown
        );
        const questionCodeSnippet =
            typeof payload.questionCodeSnippet === "string"
                ? payload.questionCodeSnippet.trim()
                : "";

        if (!questionDescription) {
            errors.questionDescription =
                "Description is required for questions";
        } else if (questionDescription.length < 10) {
            errors.questionDescription =
                "Question Description must be at least 10 characters";
        }

        content = {
            questionDescription,
            questionDescriptionUseMarkdown,
            questionCodeSnippet: questionCodeSnippet || undefined,
        };
    } else if (postType === "article") {
        const articleAbstract =
            typeof payload.articleAbstract === "string"
                ? payload.articleAbstract.trim()
                : "";
        const articleText =
            typeof payload.articleText === "string"
                ? payload.articleText.trim()
                : "";

        if (!articleAbstract) {
            errors.articleAbstract = "Abstract is required for articles";
        } else if (articleAbstract.length < 10) {
            errors.articleAbstract =
                "Article Abstract must be at least 10 characters";
        }

        if (!articleText) {
            errors.articleText = "Article text is required";
        } else if (articleText.length < 50) {
            errors.articleText = "Article Text must be at least 50 characters";
        }

        content = {
            articleAbstract,
            articleText,
        };
    }

    if (Object.keys(errors).length) {
        return {
            success: false,
            errors,
            message: null,
            data: null,
        };
    }

    const user = await getUser();
    if (!user?.id) {
        return {
            success: false,
            errors: {
                general: "You must be logged in to create a post",
            },
            message: null,
            data: null,
        };
    }

    const createdBy = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
    };

    const postPayload = {
        postType,
        title,
        tags,
        createdBy,
        ...content,
    };

    if (imageBase64) {
        postPayload.imageBase64 = imageBase64;
    }

    try {
        const result = await createPostDAL({ post: postPayload });
        return {
            success: true,
            errors: {},
            message: "Post created successfully",
            data: result,
        };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Failed to create post";
        return {
            success: false,
            errors: {
                general: message,
            },
            message,
            data: null,
        };
    }
}
