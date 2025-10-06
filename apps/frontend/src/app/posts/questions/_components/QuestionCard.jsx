// import Draggable from "react-draggable";
import Image from "next/image";
import { useRef } from "react";
import RemoveMarkdown from "remove-markdown";
import { formatDateTime } from "../../../lib/dateUtils";

export default function QuestionCard({ item, onHide }) {
    const nodeRef = useRef(null);

    var plainDescription;
    if (item.questionDescriptionUseMarkdown) {
        plainDescription = RemoveMarkdown(item.questionDescription);
    } else {
        plainDescription = item.questionDescription;
    }
    const shortDescription =
        plainDescription.length > 150
            ? `${plainDescription.slice(0, 150)}...`
            : plainDescription;

    // ensure tags is always an array
    const tags = Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
        ? item.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
        : [];

    return (
        <div ref={nodeRef} className="position-relative">
            <div className="card h-100 custom-card">
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-start">{shortDescription}</p>
                    <div className="d-flex justify-content-between flex-wrap">
                        <span className="badge bg-secondary">
                            {tags.join(", ")}
                        </span>
                        <span className="text-muted small">
                            {formatDateTime(item.createdAt || item.date)}
                        </span>
                    </div>
                </div>
            </div>
            <button
                className="btn btn-sm btn-light text-secondary border-0 position-absolute top-0 end-0 m-2"
                style={{ boxShadow: "none" }}
                onClick={(e) => {
                    e.stopPropagation();
                    onHide(item.id);
                }}
                title="Hide this question"
            >
                <Image
                    draggable="false"
                    src="/eye.svg"
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    alt="eye for hiding the card"
                />
            </button>
        </div>
    );
}
