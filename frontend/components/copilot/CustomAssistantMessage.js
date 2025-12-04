import { useChatContext } from "@copilotkit/react-ui";
import { Markdown } from "@copilotkit/react-ui";
import React from "react";

const LoadingIcon = (icons) => <span>{icons.activityIcon}</span>;

export const CustomAssistantMessage = (props) => {
  const { icons } = useChatContext();
  const { message, isLoading, subComponent } = props;

  const isCurrentMessage = props?.isCurrentMessage && props?.isOverTwo;

  return (
    <React.Fragment>
      {(message || isLoading) && (
        <div
          className={`copilotKitMessage copilotKitAssistantMessage ${
            isCurrentMessage ? "isCurrentMessage" : ""
          }`}
        >
          {message && (
            <Markdown
              content={
                typeof message === "string" ? message : message?.content ?? ""
              }
            />
          )}
          {isLoading && <LoadingIcon icons={icons} />}
        </div>
      )}
      <div style={{ marginBottom: "0.5rem" }}>{subComponent}</div>
    </React.Fragment>
  );
};
