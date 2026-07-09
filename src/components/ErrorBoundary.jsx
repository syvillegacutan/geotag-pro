import { Component } from "react";

// Catches rendering errors in its children and shows `fallback` instead of
// letting the whole app crash. Used to isolate the map so a map failure never
// takes down the rest of the tool.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
