"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import ErrorBoundary from "@/components/ErrorBoundary";
import QuestionCard from "./_components/QuestionCard";
import QuestionModal from "./_components/QuestionModal";
import Filters from "./_components/Filters";
import QuestionsSkeleton from "./_components/QuestionsSkeleton";
import { formatDateOnly } from "../../lib/dateUtils";

const QUESTIONS_ENDPOINT = "/api/posts/questions";

async function fetcher(url) {
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to load questions"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}

function QuestionsContent({ filters, hiddenIds, onHide, onCardClick }) {
    const { data } = useSWR(QUESTIONS_ENDPOINT, fetcher, {
        revalidateOnFocus: false,
        suspense: true,
    });

    const questions = Array.isArray(data?.items) ? data.items : [];

    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            if (hiddenIds.includes(q.id)) return false;

            const titleFilter = filters.title?.trim().toLowerCase();
            if (titleFilter && !q.title?.toLowerCase().includes(titleFilter)) {
                return false;
            }

            const tagFilter = filters.tag?.trim().toLowerCase();
            if (tagFilter) {
                if (Array.isArray(q.tags)) {
                    const hasMatch = q.tags.some((tag) =>
                        tag.toLowerCase().includes(tagFilter)
                    );
                    if (!hasMatch) return false;
                } else {
                    const normalizedTags = (q.tags || "")
                        .toString()
                        .toLowerCase();
                    if (!normalizedTags.includes(tagFilter)) return false;
                }
            }

            if (filters.startDate || filters.endDate) {
                const created = formatDateOnly(q.createdAt);
                if (filters.startDate && created < filters.startDate) {
                    return false;
                }
                if (filters.endDate && created > filters.endDate) {
                    return false;
                }
            }

            return true;
        });
    }, [filters, hiddenIds, questions]);

    if (!filteredQuestions.length) {
        return (
            <div className="text-center text-muted py-4">
                No questions found.
            </div>
        );
    }

    return (
        <div className="row">
            {filteredQuestions.map((item) => (
                <div className="col-md-4 mb-4" key={item.id}>
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => onCardClick(item)}
                    >
                        <QuestionCard item={item} onHide={onHide} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function FindQuestionPage() {
    const [modalItem, setModalItem] = useState(null);
    const [filters, setFilters] = useState({
        title: "",
        tag: "",
        startDate: "",
        endDate: "",
    });
    const [hiddenIds, setHiddenIds] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleHide = (id) => setHiddenIds((ids) => [...ids, id]);
    const handleCardClick = (item) => setModalItem(item);
    const handleModalClose = () => setModalItem(null);

    return (
        <>
            <div className="container-fluid p-4">
                <h2 className="mb-4">Find a Question</h2>

                <Filters filters={filters} setFilters={setFilters} />

                <div className="mt-3">
                    {!isClient ? (
                        <QuestionsSkeleton count={6} />
                    ) : (
                        <ErrorBoundary
                            fallback={({ error }) => (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error?.message ||
                                        "Failed to load questions."}
                                </div>
                            )}
                        >
                            <Suspense
                                fallback={<QuestionsSkeleton count={6} />}
                            >
                                <QuestionsContent
                                    filters={filters}
                                    hiddenIds={hiddenIds}
                                    onHide={handleHide}
                                    onCardClick={handleCardClick}
                                />
                            </Suspense>
                        </ErrorBoundary>
                    )}
                </div>
            </div>
            {modalItem && (
                <QuestionModal item={modalItem} onClose={handleModalClose} />
            )}
        </>
    );
}
