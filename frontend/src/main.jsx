import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected UI error"
    };
  }

  componentDidCatch(error) {
    // Keep this log for beginner debugging in browser DevTools.
    console.error("Root render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
          <h2>App failed to render</h2>
          <p>{this.state.message}</p>
          <p>Open DevTools Console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
