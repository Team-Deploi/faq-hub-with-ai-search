import {
  useCopilotAdditionalInstructions,
  useCopilotChat,
  useCopilotReadable,
} from "@copilotkit/react-core";

import React, { useState, useRef } from "react";
import { FiMinimize2 } from "react-icons/fi";
import {
  AI_INSTRUCTIONS,
  BLOG_DATA_DESCRIPTION,
  MESSAGE_THRESHOLD,
} from "@/constants/copilot";
import { ChatComponent } from "./ChatComponent";
import { AIIcon } from "../icons/AIIcon";

const buttonStyles = {
  primary:
    "flex items-center text-base font-medium rounded-md text-white bg-primary-100 py-2.5 px-5 mt-[23px] cursor-pointer shadow-[0px_1px_4px_0px_#00000040] hover:bg-[#B567FF] hover:text-white hover:shadow-[0px_4px_24px_0px_#B567FF73] active:bg-[#4E0890] active:text-white active:shadow-[0px_4px_24px_0px_#4E089073] disabled:bg-[#E7E7E7] disabled:text-[#A7A7A7] disabled:shadow-none",
  floatingButton:
    "flex items-center justify-center fixed bottom-[20px] right-[20px] z-30 rounded-full md:h-[90px] md:w-[90px] h-[60px] w-[60px] bg-primary-100 cursor-pointer hover:bg-[#B567FF] active:bg-[#4E0890] disabled:bg-[#E7E7E7] disabled:text-[#A7A7A7] group",
};

const iconStyles =
  "absolute md:right-[21px] md:top-[16px] right-[10px] top-[8px] z-[49] text-[18px] md:text-[22px] text-[#818181] cursor-pointer";

const WelcomeComponent = ({
  handleCopilotState,
  welcomeComponentClass = "",
}) => {
  const handleOpen = () => handleCopilotState({ isOpen: true });
  const handleHide = () => handleCopilotState({ isVisible: false });

  return (
    <div className={`wrapper2 mb-8 md:mb-20 ${welcomeComponentClass}`}>
      <div className="bg-[#F9F9F9] p-[20px] md:p-[42px] rounded-[20px] relative">
        <p className="text-[#202020] text-[18px] md:text-[24px] md:leading-[56px]">
          <span className="font-bold">Hi, I&apos;m Deploi AI,</span> I know a
          lot about this particular topic. Feel free to ask me any questions.
          I&apos;m here to help.
        </p>
        <button
          type="button"
          className={buttonStyles.primary}
          onClick={handleOpen}
        >
          Chat with Deploi AI
        </button>
        <FiMinimize2 className={iconStyles} onClick={handleHide} />
      </div>
    </div>
  );
};

export const CopilotCustomChat = ({
  data,
  isVisible = true,
  welcomeComponentClass,
  chatComponentClass,
  chatbot = {},
}) => {
  const [copilotState, setCopilotState] = useState({
    isVisible: isVisible,
    isOpen: false,
    isExpanded: false,
  });

  const chatComponentRef = useRef(null);
  const { visibleMessages } = useCopilotChat();

  const { attributes = {} } = chatbot;
  const chatInstructions = attributes?.chatInstructions || AI_INSTRUCTIONS;
  const dataDescription = attributes?.dataDescription || BLOG_DATA_DESCRIPTION;
  const additionalInstructions = attributes?.additionalInstructions || "";

  useCopilotReadable({
    description: dataDescription,
    value: data,
  });

  useCopilotAdditionalInstructions(
    {
      instructions: additionalInstructions,
      available: Boolean(additionalInstructions) ? "enabled" : "disabled",
    },
    [Boolean(additionalInstructions)]
  );

  const handleCopilotState = (state) => {
    setCopilotState((prev) => ({ ...prev, ...state }));
  };

  const handleScrollToComponent = () => {
    setTimeout(() => {
      if (chatComponentRef.current) {
        const navbarHeight = 100;
        const elementPosition =
          chatComponentRef.current.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleFloatingButtonClick = () => {
    handleCopilotState({ isVisible: true, isOpen: true });
    handleScrollToComponent();
  };

  const isExpanded =
    visibleMessages.length > MESSAGE_THRESHOLD || copilotState.isExpanded;

  return (
    <>
      {copilotState.isVisible && (
        <>
          {!copilotState.isOpen && (
            <WelcomeComponent
              handleCopilotState={handleCopilotState}
              welcomeComponentClass={welcomeComponentClass}
            />
          )}
          {copilotState.isOpen && (
            <ChatComponent
              ref={chatComponentRef}
              isExpanded={isExpanded}
              visibleMessages={visibleMessages}
              chatInstructions={chatInstructions}
              handleCopilotState={handleCopilotState}
              chatComponentClass={chatComponentClass}
            />
          )}
        </>
      )}
      <button
        type="button"
        className={buttonStyles.floatingButton}
        onClick={handleFloatingButtonClick}
      >
        <AIIcon />
      </button>
    </>
  );
};
