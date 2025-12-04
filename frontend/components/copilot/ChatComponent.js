import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { CustomAssistantMessage } from "./CustomAssistantMessage";
import { CustomUserMessage } from "./CustomUserMessage";
import { CopilotChat } from "@copilotkit/react-ui";
import { CustomInput } from "./CustomInput";
import { forwardRef, useCallback, useEffect, useRef } from "react";

const iconStyles =
  "absolute md:right-[21px] md:top-[16px] right-[10px] top-[8px] z-[49] text-[18px] md:text-[22px] text-[#818181] cursor-pointer";

export const ChatComponent = forwardRef(
  (
    {
      isExpanded,
      handleCopilotState,
      visibleMessages,
      chatInstructions,
      chatComponentClass = "",
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const userMessageRef = useRef(null);

    useEffect(() => {
      document.body.classList.toggle("overflow-hidden", isExpanded);
      return () => document.body.classList.remove("overflow-hidden");
    }, [isExpanded]);

    const containerClass = isExpanded
      ? "fixed left-0 bottom-0 w-full h-[calc(100dvh-85px)] md:h-[calc(100dvh-100px)] z-40 bg-white md:py-[30px] py-[20px] animatePopupIn origin-center"
      : `wrapper2 mb-8 md:mb-20 ${chatComponentClass}`;

    const copilotChatContainerClass = isExpanded
      ? "copilotChatContainer max-w-4xl xl:max-w-6xl mx-auto bg-[#F9F9F9] px-[2px] py-[20px] md:py-[42px] md:px-[18px] relative w-full h-full rounded-[20px]"
      : "copilotChatContainer bg-[#F9F9F9] px-[2px] py-[20px] md:py-[42px] md:px-[18px] relative w-full h-full rounded-[20px]";

    const focusInput = useCallback(() => {
      if (inputRef.current) {
        setTimeout(() => {
          if (visibleMessages.length >= 2) {
            // Temporarily set readonly to prevent scroll jumping
            inputRef.current.setAttribute("readonly", "readonly");
            inputRef.current.focus({ preventScroll: true });
            inputRef.current.removeAttribute("readonly");
          } else {
            inputRef.current.focus({ preventScroll: true });
          }
        }, 0);
      }
    }, [visibleMessages.length]);

    const handleMinimize = () => handleCopilotState({ isVisible: false });
    const handleMaximize = () => {
      handleCopilotState({ isExpanded: true });
      focusInput();
    };

    return (
      <div ref={ref} className={containerClass}>
        {isExpanded && (
          <div className="absolute inset-0 z-0" onClick={handleMinimize}></div>
        )}
        <div className={copilotChatContainerClass}>
          {visibleMessages.length === 0 && !isExpanded && (
            <h2 className="font-bold md:text-[34px] text-[20px] md:leading-[56px] text-center mb-[32px]">
              What can I help you with?
            </h2>
          )}
          <CopilotChat
            className="blog-content w-full h-full"
            instructions={chatInstructions}
            Input={({ inProgress, onSend }) => (
              <div className="md:px-[24px] px-[18px]">
                <CustomInput
                  ref={inputRef}
                  inProgress={inProgress}
                  onSend={(value) => {
                    onSend(value);
                  }}
                />
              </div>
            )}
            UserMessage={(props) => (
              <CustomUserMessage {...props} ref={userMessageRef} />
            )}
            AssistantMessage={(props) => (
              <CustomAssistantMessage
                {...props}
                isOverTwo={visibleMessages.length > 2}
              />
            )}
            onInProgress={(inProgress) => {
              if (!inProgress) {
                focusInput();
              }
            }}
          />

          {isExpanded ? (
            <FiMinimize2 className={iconStyles} onClick={handleMinimize} />
          ) : (
            <FiMaximize2 className={iconStyles} onClick={handleMaximize} />
          )}
        </div>
      </div>
    );
  }
);

ChatComponent.displayName = "ChatComponent";
