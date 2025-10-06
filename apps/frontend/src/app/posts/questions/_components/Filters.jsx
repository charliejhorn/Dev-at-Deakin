export default function Filters({ filters, setFilters }) {
    return (
        <div>
            <form className="row g-3 mb-4">
                <div className="col-md-3">
                    <label htmlFor="filter-title" className="form-label small">
                        Title
                    </label>
                    <input
                        id="filter-title"
                        type="text"
                        className="form-control"
                        placeholder="Filter by title"
                        value={filters.title}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="filter-tag" className="form-label small">
                        Tag
                    </label>
                    <input
                        id="filter-tag"
                        type="text"
                        className="form-control"
                        placeholder="Filter by tag"
                        value={filters.tag}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                tag: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="col-md-3">
                    <label
                        htmlFor="filter-start-date"
                        className="form-label small"
                    >
                        Start Date
                    </label>
                    <input
                        id="filter-start-date"
                        type="date"
                        className="form-control"
                        placeholder="Start date"
                        value={filters.startDate}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                startDate: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="col-md-3">
                    <label
                        htmlFor="filter-end-date"
                        className="form-label small"
                    >
                        End Date
                    </label>
                    <input
                        id="filter-end-date"
                        type="date"
                        className="form-control"
                        placeholder="End date"
                        value={filters.endDate}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                endDate: e.target.value,
                            }))
                        }
                    />
                </div>
            </form>
        </div>
    );
}
