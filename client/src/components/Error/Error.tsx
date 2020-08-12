import React from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner = ({ message = "We've encountered an error", description = "Please try again."}: Props) => {
  return (
    <Alert
      banner
      message={message}
      description={description}
      type="error"
    />
  );
};
