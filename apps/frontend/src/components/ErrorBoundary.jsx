"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(err, info) {
        // log error to monitoring
        console.error(err, info);
    }
    render() {
        if (this.state.hasError) {
            const { fallback } = this.props;
            if (typeof fallback === "function") {
                return fallback({ error: this.state.error });
            }
            return (
                fallback || <p className="text-danger">something went wrong.</p>
            );
        }
        return this.props.children;
    }
}
