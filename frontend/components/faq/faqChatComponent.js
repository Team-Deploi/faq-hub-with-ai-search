import React, { useRef } from "react";
import { ChatComponent } from "../copilot/ChatComponent";
import {
  useCopilotAdditionalInstructions,
  useCopilotChat,
} from "@copilotkit/react-core";

import { faqCopilotInstructions } from "@/sanity/copilotInstructions";

export const FAQChatComponent = ({ handleCopilotState, response }) => {
  const chatComponentRef = useRef(null);
  const { visibleMessages } = useCopilotChat();

  const additionalInstructions =
    response?.additionalInstructions ||
    faqCopilotInstructions.additionalInstructions;
  const chatInstructions =
    response?.chatInstructions || faqCopilotInstructions.chatInstructions;

  useCopilotAdditionalInstructions(
    {
      instructions: additionalInstructions,
      available: Boolean(additionalInstructions) ? "enabled" : "disabled",
    },
    [Boolean(additionalInstructions)]
  );

  return (
    <ChatComponent
      ref={chatComponentRef}
      isExpanded={true}
      visibleMessages={visibleMessages}
      chatInstructions={chatInstructions}
      handleCopilotState={handleCopilotState}
    />
  );
};
