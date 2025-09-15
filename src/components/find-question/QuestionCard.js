import Draggable from "react-draggable";
import { useRef } from "react";

export default function QuestionCard({ item, onHide }) {
    const nodeRef = useRef(null);

    // ensure tags is always an array
    const tags = Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
            ? item.tags.split(",").map(t => t.trim()).filter(Boolean)
            : [];

    return (
        // <Draggable 
        //     nodeRef={nodeRef}
        //     handle=".dragHandle"
        // >
            <div ref={nodeRef} className="position-relative">
                <div className="card h-100 custom-card">
                    {item.image && item.image.display_url && (
                        <img draggable="false" src={item.image.display_url} className="card-img-top custom-card-img" alt="..." />
                    )}
                    <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text text-start">{item.questionDescription}</p>
                        <div className="d-flex justify-content-between flex-wrap">
                            <span className="badge bg-secondary">{tags.join(", ")}</span>
                            <span className="text-muted small">{item.createdAt ? item.createdAt.slice(0,10) : item.date}</span>
                        </div>
                    </div>
                </div>
                {/* <button
                    className="dragHandle btn btn-sm btn-light text-secondary border-0 position-absolute top-0 start-0 m-2"
                    style={{ boxShadow: 'none' }}
                    onClick={e => { e.stopPropagation() }}
                    title="Move"
                >
                    <img draggable="false" xmlns="http://www.w3.org/2000/svg" src="move.svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"/>
                </button> */}
                <button
                    className="btn btn-sm btn-light text-secondary border-0 position-absolute top-0 end-0 m-2"
                    style={{ boxShadow: 'none' }}
                    onClick={e => { e.stopPropagation(); onHide(item.id); }}
                    title="Hide this question"
                >
                    <img draggable="false" src="eye.svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"/>
                </button>
            </div>
        // </Draggable>
    );
}
