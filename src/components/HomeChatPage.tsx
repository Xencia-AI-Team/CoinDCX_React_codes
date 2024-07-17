import { RootState } from "@/store/store";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

type HomeChatPageProps = {
  movetoChat: (uid: string) => void;
  moveToPage: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

const HomeChatPage = (props: HomeChatPageProps) => {
  const chatList = useSelector((state: RootState) => state.chat);
  const [uid, setUID] = useState("");
  return (
    <div className="flex flex-col h-full w-full p-2">
      <div className="flex flex-col flex-grow items-center justify-between font-inter p-8 shadow rounded-xl">
        <div className="flex flex-col h-full justify-center items-center">
          <span className="text-xl font-bold">Need any Assistance</span>
          <span className="text-sm text-slate-700">
            We are here to help you
          </span>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row ">
            <Input
              className="focus:border-none focus:outline-none"
              placeholder="Enter User Id"
              value={uid}
              onChange={(e) => {
                setUID(e.target.value);
              }}
            />
            <div>
              <Button
                variant={"ghost"}
                className="py-0 px-4 rounded-full"
                onClick={props.onRefresh}
                disabled={props.isRefreshing}
              >
                <RefreshCw />
              </Button>
            </div>
          </div>
          <Button
            onClick={() => {
              props.movetoChat(uid);
            }}
            className="w-full"
            variant={"lightButton"}
            disabled={uid === ""}
          >
            Start a Conversation
          </Button>
        </div>
      </div>
      <div className="max-h-32 overflow-y-scroll overflow-x-hidden">
        {chatList.length !== 0 &&
          chatList.map((chat) => {
            return (
              <div
                key={chat.id}
                className="shadow w-full m-2 rounded-md p-2 flex flex-col cursor-pointer"
                onClick={() => {
                  props.moveToPage(chat.id);
                }}
              >
                <span className="font-semibold text-sm">
                  Chat ID:{" "}
                  <span className="text-lightDarkBlue">{chat.id} </span>
                </span>
                <span className="text-[11px]">{chat.timeStamp}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HomeChatPage;
