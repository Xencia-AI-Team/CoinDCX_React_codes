import { assets } from "@/assets";

/* eslint-disable @typescript-eslint/no-explicit-any */
type UserChatProps = {
  chat: any;
};

const UserChat = (props: UserChatProps) => {
  return (
    <div className="flex w-full flex-row justify-end items-start gap-2">
      <div className="max-w-[220px] flex flex-col">
        <div className="p-3 text-xs rounded-l-3xl rounded-ee-3xl whitespace-pre-wrap break-words text-white bg-lightDarkBlue">
          {props.chat.data}
        </div>
      </div>

      <div className="flex flex-col justify-end gap-1 items-center">
        <div className="flex items-center justify-center h-8 w-8 bg-[#D9D9D9] rounded-full">
          <img src={assets.icons.profile} alt="profile" />
        </div>
        <span className="text-[9px]">{props.chat.timeStamp}</span>
      </div>
    </div>
  );
};

export default UserChat;
