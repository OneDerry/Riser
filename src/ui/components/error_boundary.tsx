import React from "react";


import ErrorFallback from "./error_fallback";
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Optionally report to an error service here
    console.error(error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback reset={this.reset} />;
    }
    return this.props.children;
  }
}
