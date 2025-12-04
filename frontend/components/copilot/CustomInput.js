import { forwardRef } from "react";
import { SendIcon } from "../icons/SendIcon";

export const CustomInput = forwardRef(
  ({ inProgress, onSend, isVisible }, ref) => {
    const handleSubmit = async (value) => {
      if (value.trim()) onSend(value);
    };

    return (
      <div className="customCopilotKitInputContainer flex relative w-full border-[0.86px] border-[#CBD5E1] shadow-[0px_1.71px_34.3px_-1.71px_#1717170F] rounded-full overflow-hidden p-2.5 bg-white">
        <input
          ref={ref}
          disabled={inProgress}
          type="text"
          placeholder="Type your question here..."
          className="customCopilotKitInput w-full text-[#475569] text-sm focus:outline-none placeholder:text-[#475569] ps-[6px] md:ps-[3px] disabled:bg-white disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />

        <button
          className="customCopilotKitInputControlButton flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-full bg-primary-100 hover:bg-[#B567FF] disabled:bg-[#E7E7E7] disabled:text-[#A7A7A7] active:bg-[#4E0890] disabled:cursor-not-allowed"
          disabled={inProgress}
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling;
            handleSubmit(input.value);
            input.value = "";
          }}
        >
          <SendIcon />
        </button>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
