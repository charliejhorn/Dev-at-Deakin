// The Find Question page (appears on home page navigation bar) includes a list of questions as
// cards that will show the title, description, tag and date of questions. A user will see question
// details to answer the question or check solutions. The page has the following features:
// - The user can filter out questions based on date, tag, or question title.
// - The user can hide questions that they do not want to see, and the question list will be updated accordingly.
// - When a user adds a new question, the question will be added to the list of questions.
// - When a user clicks on the selected question card, it will be expanded to show more details.
// - (Optional) A user can reorder the list. You could use React Draggable npm package to implement this feature.

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import QuestionCard from "../components/find-question/QuestionCard";
import QuestionModal from "../components/find-question/QuestionModal";
import { fetchAllQuestions } from "../services/post";

export default function FindQuestion() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalItem, setModalItem] = useState(null);
    const [filter, setFilter] = useState({ title: '', tag: '', startDate: '', endDate: '' });
    const [hiddenIds, setHiddenIds] = useState([]);

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            setError(null);
            try {
                const posts = await fetchAllQuestions();
                // filter only questions (not articles)
                const questionsOnly = posts.filter(post => post.postType === "question");
                setQuestions(questionsOnly);
            } catch (err) {
                setError("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    // Filtering logic
    const filteredQuestions = questions.filter(q => {
        if (hiddenIds.includes(q.id)) return false;
        if (filter.title && !q.title?.toLowerCase().includes(filter.title.toLowerCase())) return false;
        if (filter.tag && !(Array.isArray(q.tags) ? q.tags.some(tag => tag.toLowerCase().includes(filter.tag.toLowerCase())) : (q.tags || "").toLowerCase().includes(filter.tag.toLowerCase()))) return false;
        // filter by start and end date
        if (filter.startDate || filter.endDate) {
            const created = q.createdAt ? q.createdAt.slice(0, 10) : '';
            if (filter.startDate && created < filter.startDate) return false;
            if (filter.endDate && created > filter.endDate) return false;
        }
        return true;
    });

    const handleHide = id => setHiddenIds(ids => [...ids, id]);
    const handleCardClick = item => setModalItem(item);
    const handleModalClose = () => setModalItem(null);

    return (
        <>
            <NavBar />
            <div className="container-fluid p-4">
                <h2 className="mb-4">Find a Question</h2>
                <form className="row g-3 mb-4">
                    <div className="col-md-3">
                        <label htmlFor="filter-title" className="form-label small">Title</label>
                        <input
                            id="filter-title"
                            type="text"
                            className="form-control"
                            placeholder="Filter by title"
                            value={filter.title}
                            onChange={e => setFilter(f => ({ ...f, title: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="filter-tag" className="form-label small">Tag</label>
                        <input
                            id="filter-tag"
                            type="text"
                            className="form-control"
                            placeholder="Filter by tag"
                            value={filter.tag}
                            onChange={e => setFilter(f => ({ ...f, tag: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="filter-start-date" className="form-label small">Start Date</label>
                        <input
                            id="filter-start-date"
                            type="date"
                            className="form-control"
                            placeholder="Start date"
                            value={filter.startDate}
                            onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="filter-end-date" className="form-label small">End Date</label>
                        <input
                            id="filter-end-date"
                            type="date"
                            className="form-control"
                            placeholder="End date"
                            value={filter.endDate}
                            onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))}
                        />
                    </div>
                </form>
                <div className="row ">
                    {loading && <div className="text-center text-muted">Loading questions...</div>}
                    {error && <div className="text-center text-danger">{error}</div>}
                    {!loading && !error && filteredQuestions.length === 0 && (
                        <div className="text-center text-muted">No questions found.</div>
                    )}
                    {!loading && !error && filteredQuestions.map((item, idx) => (
                        <div className="col-md-4 mb-4" key={item.id}>
                            <div style={{ cursor: "pointer" }} onClick={() => handleCardClick(item)}>
                                <QuestionCard item={item} onHide={handleHide} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {modalItem && (
                <QuestionModal item={modalItem} onClose={handleModalClose} />
            )}
        </>
    );
}