import CodeMirror from "@uiw/react-codemirror";
import Markdown from "react-markdown";

export default function PostForm({
    formData,
    handleInputChange,
    handleCodeSnippetChange,
    handleSubmit,
    errors,
    pending,
    isPostDisabled,
}) {
    return (
        <form onSubmit={handleSubmit}>
            {/* TITLE */}
            <div className="d-flex p-2 align-items-center gap-3">
                <label htmlFor="title" className="form-label m-0">
                    Title
                </label>
                <input
                    type="text"
                    className={`form-control${
                        errors.title ? " is-invalid" : ""
                    }`}
                    id="title"
                    name="title"
                    placeholder={
                        formData.postType == "question"
                            ? "Start your question with how, what, why, etc."
                            : "Enter a descriptive title"
                    }
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                )}
            </div>

            {formData.postType === "question" ? (
                <>
                    {/* QUESTION DESCRIPTION */}
                    <div className="p-2 text-start">
                        <div className="d-flex justify-content-between">
                            <label
                                htmlFor="question-description"
                                className="form-label m-0 pb-1"
                            >
                                Describe your problem:
                            </label>
                            <span>
                                <label
                                    htmlFor="question-description-use-markdown"
                                    className="me-2 text-secondary"
                                >
                                    Use Markdown
                                </label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="question-description-use-markdown"
                                    name="questionDescriptionUseMarkdown"
                                    checked={
                                        formData.questionDescriptionUseMarkdown
                                    }
                                    onChange={handleInputChange}
                                    aria-label="Use Markdown formatting for the question description."
                                />
                            </span>
                        </div>

                        {formData.questionDescriptionUseMarkdown ? (
                            <div className="row w-100 g-0">
                                <div className="col-12 col-md-6">
                                    <textarea
                                        className={`form-control font-monospace question-description${
                                            errors.questionDescription
                                                ? " is-invalid"
                                                : ""
                                        }`}
                                        id="question-description"
                                        name="questionDescription"
                                        placeholder="Enter a 1-paragraph description of your problem"
                                        value={formData.questionDescription}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.questionDescription && (
                                        <div className="invalid-feedback">
                                            {errors.questionDescription}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="col-12 col-md-6 standardBorder"
                                    style={{ padding: "0.375rem 0.75rem" }}
                                >
                                    <Markdown>
                                        {formData.questionDescription}
                                    </Markdown>
                                </div>
                            </div>
                        ) : (
                            <>
                                <textarea
                                    className={`form-control question-description${
                                        errors.questionDescription
                                            ? " is-invalid"
                                            : ""
                                    }`}
                                    id="question-description"
                                    name="questionDescription"
                                    placeholder="Enter a 1-paragraph description of your problem"
                                    value={formData.questionDescription}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.questionDescription && (
                                    <div className="invalid-feedback">
                                        {errors.questionDescription}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* QUESTION CODE SNIPPET */}
                    <div className="p-2 text-start">
                        <label
                            htmlFor="question-code-snippet"
                            className="form-label m-0 pb-1"
                        >
                            Code snippet
                        </label>
                        {/* <textarea 
                        className={`form-control question-description${errors.questionDescription ? ' is-invalid' : ''}`}
                        id="code-snippet" 
                        name="codeSnippet"
                        placeholder="Enter a 1-paragraph description of your problem"
                        value={formData.codeSnippet}
                        onChange={handleInputChange}
                        required
                    /> */}
                        <CodeMirror
                            name="questionCodeSnippet"
                            id="question-code-snippet"
                            className="standardBorder"
                            value={formData.questionCodeSnippet}
                            height="200px"
                            onChange={handleCodeSnippetChange}
                        />
                        {errors.questionCodeSnippet && (
                            <div className="invalid-feedback">
                                {errors.questionCodeSnippet}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* ARTICLE IMAGE */}
                    <div className="p-2 d-flex gap-3 align-items-center">
                        <label
                            className="form-label text-nowrap"
                            htmlFor="image"
                        >
                            Add an image
                        </label>
                        <input
                            type="file"
                            className={`form-control${
                                errors.image ? " is-invalid" : ""
                            }`}
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                        {errors.image && (
                            <div className="invalid-feedback">
                                {errors.image}
                            </div>
                        )}
                    </div>

                    {/* ARTICLE ABSTRACT */}
                    <div className="p-2 text-start">
                        <label
                            htmlFor="article-abstract"
                            className="form-label m-0 pb-1"
                        >
                            Abstract
                        </label>
                        <textarea
                            className={`form-control abstract${
                                errors.articleAbstract ? " is-invalid" : ""
                            }`}
                            id="article-abstract"
                            name="articleAbstract"
                            placeholder="Enter a 1-paragraph abstract"
                            value={formData.articleAbstract}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.articleAbstract && (
                            <div className="invalid-feedback">
                                {errors.articleAbstract}
                            </div>
                        )}
                    </div>

                    {/* ARTICLE TEXT */}
                    <div className="p-2 text-start">
                        <label
                            htmlFor="article-text"
                            className="form-label m-0 pb-1"
                        >
                            Article Text
                        </label>
                        <textarea
                            className={`form-control abstract${
                                errors.articleText ? " is-invalid" : ""
                            }`}
                            id="article-text"
                            name="articleText"
                            placeholder="Enter the article text"
                            value={formData.articleText}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.articleText && (
                            <div className="invalid-feedback">
                                {errors.articleText}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* TAGS */}
            <div className="d-flex p-2 align-items-center gap-3">
                <label htmlFor="tags" className="form-label m-0">
                    Tags
                </label>
                <input
                    type="text"
                    className={`form-control${
                        errors.tags ? " is-invalid" : ""
                    }`}
                    id="tags"
                    name="tags"
                    placeholder={
                        "Please add up to 3 tags to describe what your " +
                        (formData.postType == "question"
                            ? "question"
                            : "article") +
                        " is about, e.g. Java"
                    }
                    value={formData.tags}
                    onChange={handleInputChange}
                    required
                />
                {errors.tags && (
                    <div className="invalid-feedback">{errors.tags}</div>
                )}
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="btn btn-primary text-end mt-4"
                    disabled={isPostDisabled}
                >
                    {pending ? "Creating post..." : "Post"}
                </button>
            </div>
        </form>
    );
}
