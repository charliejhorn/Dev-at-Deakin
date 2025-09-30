"use client";
import { Suspense, useState } from "react";
import useSWR from "swr";
import ErrorBoundary from "@/components/ErrorBoundary";
import Link from "next/link";

function JobDetailModal({ job, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        // render backdrop sibling so modal sits above it
        <>
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                style={{ zIndex: 1040 }}
            ></div>
            <div
                className="modal fade show"
                style={{ display: "block", zIndex: 1050 }}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Job Details</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Basic Information</h6>
                                    <dl className="row">
                                        <dt className="col-sm-4">Job ID:</dt>
                                        <dd className="col-sm-8">#{job.id}</dd>
                                        <dt className="col-sm-4">Title:</dt>
                                        <dd className="col-sm-8">
                                            {job.title}
                                        </dd>
                                        <dt className="col-sm-4">Customer:</dt>
                                        <dd className="col-sm-8">
                                            {job.customer}
                                        </dd>
                                        <dt className="col-sm-4">Status:</dt>
                                        <dd className="col-sm-8">
                                            <span
                                                className={`badge ${
                                                    job.status === "completed"
                                                        ? "bg-success"
                                                        : job.status ===
                                                          "in_progress"
                                                        ? "bg-warning text-dark"
                                                        : "bg-secondary"
                                                }`}
                                            >
                                                {job.status}
                                            </span>
                                        </dd>
                                    </dl>
                                </div>
                                <div className="col-md-6">
                                    <h6>Schedule & Assignment</h6>
                                    <dl className="row">
                                        {job.mechanic && (
                                            <>
                                                <dt className="col-sm-4">
                                                    Mechanic:
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {job.mechanic}
                                                </dd>
                                            </>
                                        )}
                                        {job.start && (
                                            <>
                                                <dt className="col-sm-4">
                                                    Start:
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {new Date(
                                                        job.start
                                                    ).toLocaleString()}
                                                </dd>
                                            </>
                                        )}
                                        {job.end && (
                                            <>
                                                <dt className="col-sm-4">
                                                    End:
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {new Date(
                                                        job.end
                                                    ).toLocaleString()}
                                                </dd>
                                            </>
                                        )}
                                        {job.createdAt && (
                                            <>
                                                <dt className="col-sm-4">
                                                    Created:
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {new Date(
                                                        job.createdAt
                                                    ).toLocaleString()}
                                                </dd>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {job.notes && (
                                <div className="mt-3">
                                    <h6>Notes</h6>
                                    <p className="text-muted">{job.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Edit Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function JobCard({ job, onJobClick }) {
    return (
        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div
                className="card h-100"
                style={{ cursor: "pointer" }}
                onClick={() => onJobClick(job)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onJobClick(job);
                    }
                }}
            >
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="card-title mb-0">{job.title}</h6>
                        <span
                            className={`badge ${
                                job.status === "completed"
                                    ? "bg-success"
                                    : job.status === "in_progress"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                            }`}
                        >
                            {job.status}
                        </span>
                    </div>
                    <p className="card-text small text-muted mb-0">
                        Customer: {job.customer}
                    </p>
                    {job.mechanic && (
                        <p className="card-text small text-muted mb-0">
                            Mechanic: {job.mechanic}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function JobsList({ onJobClick }) {
    // fetch jobs list directly from backend
    const { data } = useSWR("/api/jobs");
    const jobs = data?.items || [];

    if (!jobs || jobs.length === 0) {
        return (
            <div className="col-12">
                <div className="alert alert-info">No jobs found.</div>
            </div>
        );
    }

    return (
        <>
            {jobs.map((job, index) => (
                <JobCard
                    key={job.id || index}
                    job={job}
                    onJobClick={onJobClick}
                />
            ))}
        </>
    );
}

function JobsLoading() {
    return (
        <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="placeholder-glow">
                                <div className="placeholder col-8 mb-2"></div>
                                <div className="placeholder col-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function JobsPage() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4">Jobs</h2>
                <Link href="/create-job" className="btn btn-primary">
                    New Job
                </Link>
            </div>

            {/* filters removed - job list shows all jobs */}

            <ErrorBoundary
                fallback={
                    <div className="alert alert-danger">
                        Failed to load jobs. Please try again.
                    </div>
                }
            >
                <Suspense fallback={<JobsLoading />}>
                    <div className="row g-3">
                        <JobsList onJobClick={handleJobClick} />
                    </div>
                </Suspense>
            </ErrorBoundary>

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
