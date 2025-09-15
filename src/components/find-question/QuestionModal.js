
import React from "react";

export default function QuestionModal({ item, onClose }) {
  if (!item) return null;

  // ensure tags is always an array
  const tags = Array.isArray(item.tags)
    ? item.tags
    : typeof item.tags === "string"
      ? item.tags.split(",").map(t => t.trim()).filter(Boolean)
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
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{item.title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {item.image && item.image.display_url && (
              <img
                src={item.image.display_url}
                className="img-fluid mb-3"
                alt="Question visual"
                style={{ maxHeight: 300, objectFit: "cover", width: "100%" }}
              />
            )}
            <p className="text-start"><strong>Description:</strong> {item.questionDescription}</p>
            {item.articleAbstract && (
              <p className="text-start"><strong>Abstract:</strong> {item.articleAbstract}</p>
            )}
            {item.articleText && (
              <p className="text-start"><strong>Article:</strong> {item.articleText}</p>
            )}
            <div className="mb-2">
              <span className="text-muted small me-2">{item.createdAt ? item.createdAt.slice(0,10) : item.date}</span>
              <span className="badge bg-secondary">{tags.join(", ")}</span>
            </div>
            {item.createdBy && (
              <div className="text-muted small">By: {item.createdBy.displayName || item.createdBy.id}</div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}