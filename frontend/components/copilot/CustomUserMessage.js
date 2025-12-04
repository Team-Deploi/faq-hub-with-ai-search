import { forwardRef } from "react";
import { formatTime } from "@/utils/date";

export const CustomUserMessage = forwardRef((props, ref) => {
  return (
    <div
      className="flex flex-col items-end gap-2 justify-center mb-4"
      ref={ref}
    >
      <div className="flex items-center gap-[15px]">
        <span className="text-sm font-semibold text-[#94A3B8]">
          {formatTime(props.rawData.createdAt)}
        </span>
        <span className="text-base font-bold text-black">You</span>
      </div>
      <div className="bg-white text-[#262626] text-[18px] leading-[30px] md:text-[24px] md:leading-[40px] md:tracking-[0.03em] font-normal py-[10px] px-[15px] rounded-[14px] wrap-break-word shrink-0 max-w-[80%]">
        {typeof props.message === "string"
          ? props.message
          : props.message?.content ?? ""}
      </div>
    </div>
  );
});

CustomUserMessage.displayName = "CustomUserMessage";
