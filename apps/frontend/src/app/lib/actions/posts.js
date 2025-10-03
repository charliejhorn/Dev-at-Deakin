"use server";

import { createPostDAL } from "@/app/lib/dal/posts";
import { getUser } from "@/app/lib/dal/user";

const POST_TYPES = ["question", "article"];
const DEFAULT_STATUS = "draft";

function normalizeTags(tagsInput) {
    if (!tagsInput || typeof tagsInput !== "string") return [];
    return tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 10);
}

export async function createPostAction(prevState, payload = {}) {
    const errors = {};

    const postType =
        typeof payload.postType === "string"
            ? payload.postType.trim().toLowerCase()
            : "";
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const tags = normalizeTags(payload.tags);
    const image = typeof payload.image === "string" ? payload.image.trim() : "";
    const status =
        typeof payload.status === "string"
            ? payload.status.trim().toLowerCase()
            : DEFAULT_STATUS;

    if (!POST_TYPES.includes(postType)) {
        errors.postType = "Select a post type";
    }

    if (!title) {
        errors.title = "Title is required";
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
        }

        if (!articleText) {
            errors.articleText = "Article text is required";
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
        status,
        ...content,
    };

    if (image) {
        postPayload.image = image;
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
