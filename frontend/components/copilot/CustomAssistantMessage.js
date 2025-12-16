import { Markdown, useChatContext } from "@copilotkit/react-ui";
import React from "react";

export const CustomAssistantMessage = (props) => {
  const { icons } = useChatContext();
  const { message, isLoading, subComponent } = props;

  const isCurrentMessage = props?.isCurrentMessage && props?.isOverTwo;

  return (
    <React.Fragment>
      <div
        className={`copilotKitMessage copilotKitAssistantMessage ${
          isCurrentMessage ? "isCurrentMessage" : ""
        }`}
      >
        {message && <Markdown content={message.content || ""} />}
        {isLoading && icons.spinnerIcon}
      </div>

      <div style={{ marginBottom: "0.5rem" }}>{subComponent}</div>
    </React.Fragment>
  );
};
