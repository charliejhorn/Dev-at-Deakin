import Link from "next/link";

export const dynamic = "force-dynamic";

export default function QuestionsIndexPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h1 className="h3">Questions</h1>
                            <p className="text-secondary">
                                Newly created questions will appear here once
                                the listing feature is completed.
                            </p>
                            <Link
                                className="btn btn-primary"
                                href="/posts/create"
                            >
                                Create your first post
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
