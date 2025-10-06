import CodeMirror, { highlightActiveLine } from "@uiw/react-codemirror";
import Markdown from "react-markdown";
import { formatDateTime } from "../../../lib/dateUtils";

export default function QuestionModal({ item, onClose }) {
    if (!item) return null;

    // ensure tags is always an array
    const tags = Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
        ? item.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
        : [];

    // close modal if clicking on backdrop, but not if clicking inside modal content
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={handleBackdropClick}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{item.title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {item.questionDescriptionUseMarkdown ? (
                            <>
                                <p className="text-start mb-0">
                                    <strong>Description:</strong>{" "}
                                </p>
                                <Markdown>{item.questionDescription}</Markdown>
                            </>
                        ) : (
                            <p className="text-start">
                                <strong>Description:</strong>{" "}
                                {item.questionDescription}
                            </p>
                        )}

                        {item.questionCodeSnippet && (
                            <>
                                <p className="text-start mb-0">
                                    <strong>Code:</strong>{" "}
                                </p>
                                <CodeMirror
                                    className="mb-3 createCodeSnippet"
                                    value={item.questionCodeSnippet}
                                    height="200px"
                                    editable={false}
                                    basicSetup={{
                                        highlightActiveLine: false,
                                        highlightActiveLineGutter: false,
                                    }}
                                ></CodeMirror>
                            </>
                        )}

                        <div className="mb-2">
                            <span className="text-muted small me-2">
                                {formatDateTime(item.createdAt || item.date)}
                            </span>
                            <span className="badge bg-secondary">
                                {tags.join(", ")}
                            </span>
                        </div>

                        {item.createdBy && (
                            <div className="text-muted small">
                                By:{" "}
                                {item.createdBy.displayName ||
                                    item.createdBy.id}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
