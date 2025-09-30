"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError() { return { hasError: true }; }
	componentDidCatch(err, info) {
		// log error to monitoring
		console.error(err, info);
	}
	render() {
		if (this.state.hasError) return this.props.fallback || <p className="text-danger">something went wrong.</p>;
		return this.props.children;
	}
}
