export default function PostForm({ formData, handleInputChange, handleSubmit, errors }) {
    return (
        <form onSubmit={handleSubmit}>
            <div className="d-flex p-2 align-items-center gap-3">
                <label htmlFor="title" className="form-label m-0">Title</label>
                <input 
                    type="text" 
                    className={`form-control${errors.title ? ' is-invalid' : ''}`}
                    id="title" 
                    name="title"
                    placeholder={formData.postType == 'question' ? 'Start your question with how, what, why, etc.' : 'Enter a descriptive title'}
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="p-2 d-flex gap-3 align-items-center">
                <label className="form-label text-nowrap" htmlFor="image">Add an image</label>
                <input 
                    type="file" 
                    className={`form-control${errors.image ? ' is-invalid' : ''}`}
                    id="image" 
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                />
                {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            </div>

            {formData.postType === 'question' ? (
                <div className="p-2 text-start">
                    <label htmlFor="title" className="form-label m-0 pb-1">Describe your problem</label>
                    <textarea 
                        className={`form-control question-description${errors.questionDescription ? ' is-invalid' : ''}`}
                        id="question-description" 
                        name="questionDescription"
                        placeholder="Enter a 1-paragraph description of your problem"
                        value={formData.questionDescription}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.questionDescription && <div className="invalid-feedback">{errors.questionDescription}</div>}
                </div>
            ) : (<>
                <div className="p-2 text-start">
                    <label htmlFor="title" className="form-label m-0 pb-1">Abstract</label>
                    <textarea 
                        className={`form-control abstract${errors.articleAbstract ? ' is-invalid' : ''}`}
                        id="abstract" 
                        name="articleAbstract"
                        placeholder="Enter a 1-paragraph abstract"
                        value={formData.articleAbstract}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.articleAbstract && <div className="invalid-feedback">{errors.articleAbstract}</div>}
                </div>
                <div className="p-2 text-start">
                    <label htmlFor="title" className="form-label m-0 pb-1">Article Text</label>
                    <textarea 
                        className={`form-control abstract${errors.articleText ? ' is-invalid' : ''}`}
                        id="article-text" 
                        name="articleText"
                        placeholder="Enter the article text"
                        value={formData.articleText}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.articleText && <div className="invalid-feedback">{errors.articleText}</div>}
                </div>
            </>)}

            <div className="d-flex p-2 align-items-center gap-3">
                <label htmlFor="title" className="form-label m-0">Tags</label>
                <input 
                    type="text" 
                    className={`form-control${errors.tags ? ' is-invalid' : ''}`}
                    id="tags" 
                    name="tags"
                    placeholder={'Please add up to 3 tags to describe what your ' + (formData.postType == 'question' ? 'question' : 'article') + ' is about, e.g. Java'}
                    value={formData.tags}
                    onChange={handleInputChange}
                    required
                />
                {errors.tags && <div className="invalid-feedback">{errors.tags}</div>}
            </div>

            <div className="text-center">
                <button type="submit" className="btn btn-primary text-end mt-4">Post</button>
            </div>
        </form>
    )
}