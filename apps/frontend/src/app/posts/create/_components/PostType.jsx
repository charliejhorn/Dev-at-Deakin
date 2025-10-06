export default function PostType({ formData, handleInputChange, errors }) {
    return (
        <div className="d-flex gap-5 p-2">
            <p>Select post type:</p>
            <div className="form-check">
                <input
                    className={`form-check-input${
                        errors.postType ? " is-invalid" : ""
                    }`}
                    type="radio"
                    name="postType"
                    id="question-radio"
                    value="question"
                    checked={formData.postType === "question"}
                    onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="question-radio">
                    Question
                </label>
            </div>
            <div className="form-check">
                <input
                    className={`form-check-input${
                        errors.postType ? " is-invalid" : ""
                    }`}
                    type="radio"
                    name="postType"
                    id="article-radio"
                    value="article"
                    checked={formData.postType === "article"}
                    onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="article-radio">
                    Article
                </label>
            </div>
            {errors.postType && (
                <div className="invalid-feedback">{errors.postType}</div>
            )}
        </div>
    );
}
