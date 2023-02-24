import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, you have come to an uncharted territory.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}