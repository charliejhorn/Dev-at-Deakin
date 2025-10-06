export default function QuestionsSkeleton({ count = 6 }) {
    const placeholders = Array.from({ length: count });

    return (
        <div className="row">
            {placeholders.map((_, index) => (
                <div className="col-md-4 mb-4" key={index}>
                    <div className="card h-100 border-secondary-subtle">
                        <div className="card-body">
                            <div className="placeholder-glow mb-2">
                                <span className="placeholder col-8"></span>
                            </div>
                            <div className="placeholder-glow">
                                <span className="placeholder col-12"></span>
                                <span className="placeholder col-10"></span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
