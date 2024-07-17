import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
// import { ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { addBotChat, addUserChat, closeChat } from "@/store/chatSlice";
import UserChat from "./UserChat";
import BotChat from "./BotChat";
import { assets } from "@/assets";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";

type ChatPageProps = {
  ID: string;
  startNew: (uid: string) => void;
  uid: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  moveToHome: () => void;
};

const ChatPage = (props: ChatPageProps) => {
  const chatList = useSelector((state: RootState) => state.chat);
  const findChatIndexbyID = chatList.findIndex((data) => data.id === props.ID);
  const Chat = findChatIndexbyID !== -1 ? chatList[findChatIndexbyID] : null;
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState("");

  const [isEnded, setIsEnded] = useState(false);

  const [isEndLoading, setEndLoading] = useState(true);

  const Ended = () => {
    setIsEnded(true);
    setDisabled(true);
  };

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const [replyText, setReplyText] = useState("");

  // let reply = "";

  // const [isRefreshing, setIsRefreshing] = useState(false);

  const [isLoading, setIsLoading] = useState<{
    id: string;
    isloading: boolean;
  }>({ id: "", isloading: false });

  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isEndLoading]);

  useEffect(() => {
    if (isEnded && isEndLoading) {
      const timer = setTimeout(() => {
        setEndLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isEnded, isEndLoading]);

  // const [isStreaming, setIsStreaming] = useState<{
  //   id: string;
  //   isstreaming: boolean;
  // }>({ id: "", isstreaming: false });

  // const [showOptions, setShowOptions] = useState(false);

  // const [curSelected, setCurSelected] = useState("");

  const dispatch = useDispatch();

  // const sendData = () => {
  //   setShowOptions(false);
  //   dispatch(addUserChat({ id: props.ID, user: curSelected }));
  // };

  const onChangeChat = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onStart = () => {
    setDisabled(false);
    props.startNew(props.uid);
  };

  useEffect(() => {
    if (Chat !== null && !Chat.closed && Chat.chatHistory.length !== 0) {
      const targetTime = new Date(
        Chat.chatHistory[Chat.chatHistory.length - 1].fulltimeStamp
      );

      targetTime.setMinutes(targetTime.getMinutes() + 2);

      const checkTime = () => {
        const currentTime = new Date();
        if (currentTime > targetTime) {
          dispatch(closeChat({ id: props.ID }));
        }
      };

      const interval = setInterval(checkTime, 2000);

      return () => clearInterval(interval);
    }
  }, [Chat]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // if (event.key === "Enter" && text.toLowerCase() === "options") {
    //   setShowOptions(true);
    // } else
    if (event.key === "Enter" && text !== "") {
      onSend();
    }
  };

  const onSendMessage = () => {
    // if (text.toLowerCase() === "options") {
    //   setShowOptions(true);
    // } else {
    onSend();
    // }
  };

  const onSend = async () => {
    if (!props.ID) return;
    setIsLoading({ id: props.ID, isloading: true });
    setDisabled(true);

    dispatch(addUserChat({ user: text, id: props.ID }));

    try {
      const response = await fetch(
        "https://newcoindcx.azurewebsites.net/send_message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            session_id: props.ID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botText = data.ai_response;
      dispatch(addBotChat({ bot: botText, id: props.ID }));
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setDisabled(false);
      setIsLoading({ id: "", isloading: false });
    }
    setText("");
  };

  return (
    <div className="w-full h-[85%] font-inter flex flex-col justify-between">
      {Chat?.chatHistory.length === 0 ? (
        <div className="flex flex-col px-4 py-2 gap-2 font-inter justify-between flex-grow h-full">
          <div className="flex-grow"></div>
          <section className="flex-row flex gap-1 p-1 md:p-3 w-full items-center justify-center flex-shrink-0">
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row">
                <div>
                  <img
                    src={assets.images.profilePlaceholder}
                    alt="profilePic"
                    className="h-auto w-5 md:w-6"
                    height={20}
                    width={20}
                  />
                </div>
              </div>
              <div className="flex flex-grow font-inter">
                <Input
                  type="text"
                  placeholder="Type your text here"
                  className="focus:border-none focus:outline-none"
                  value={text}
                  onChange={onChangeChat}
                  disabled={disabled}
                  onKeyDown={handleKeyPress}
                />
              </div>

              <div>
                <Button
                  variant={"darkBlue"}
                  onClick={onSend}
                  disabled={disabled || text === ""}
                >
                  SEND
                </Button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex-grow flex flex-col px-1 py-2 justify-start overflow-y-scroll gap-2"
            )}
          >
            <div className="flex items-center flex-row gap-5">
              <div className="flex-grow border-t border-gray-300"></div>
              <div className="flex flex-row justify-end font-bold text-xs">
                NEW
              </div>
            </div>
            {Chat !== null &&
              Chat.chatHistory.map((chat, index, array) => {
                if (chat.type === "User") {
                  return (
                    <div
                      ref={index === array.length - 1 ? chatEndRef : null}
                      key={chat.id}
                    >
                      <UserChat chat={chat} key={chat.id} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      ref={index === array.length - 1 ? chatEndRef : null}
                      key={chat.id}
                    >
                      <BotChat
                        chat={chat}
                        isLast={index === array.length - 1}
                        setText={setText}
                        Ended={Ended}
                      />
                    </div>
                  );
                }
              })}
            {isLoading && isLoading.isloading && isLoading.id === props.ID && (
              <div className="flex w-full flex-row justify-start gap-2">
                <div className="flex flex-col justify-end gap-1 items-center">
                  <div className="flex items-center justify-center h-12 w-12 bg-[#D9D9D9] rounded-full">
                    <img
                      src={assets.images.coin}
                      alt="profilePic"
                      className="h-auto w-8"
                      height={30}
                      width={30}
                    />
                  </div>
                </div>
                <div className="max-w-[220px] flex flex-col">
                  <div className="bg-white min-w-[100px] text-greyText2 p-4 rounded-r-3xl rounded-ss-3xl">
                    <SyncLoader
                      color={"#000000"}
                      size={10}
                      speedMultiplier={0.7}
                    />
                  </div>
                </div>
              </div>
            )}
            {isEnded && isEndLoading && (
              <div className="flex w-full flex-row justify-start gap-2">
                <div className="flex flex-col justify-end gap-1 items-center">
                  <div className="flex items-center justify-center h-12 w-12 bg-[#D9D9D9] rounded-full">
                    <img
                      src={assets.images.coin}
                      alt="profilePic"
                      className="h-auto w-8"
                      height={30}
                      width={30}
                    />
                  </div>
                </div>
                <div className="max-w-[220px] flex flex-col">
                  <div className="bg-white min-w-[100px] text-greyText2 p-4 rounded-r-3xl rounded-ss-3xl">
                    <SyncLoader
                      color={"#000000"}
                      size={10}
                      speedMultiplier={0.7}
                    />
                  </div>
                </div>
              </div>
            )}
            {isEnded && !isEndLoading && (
              <div className="flex w-full flex-row justify-start gap-2">
                <div className="flex flex-col justify-start gap-1 items-center">
                  <div className="flex items-center justify-center h-9 w-9 bg-[#D9D9D9] rounded-full">
                    <img
                      src={assets.images.coin}
                      alt="profilePic"
                      className="h-auto w-8"
                      height={30}
                      width={30}
                    />
                  </div>
                </div>
                <div className="max-w-[320px] flex flex-col">
                  <div className="bg-lightBlue max-w-[320px] min-w-[220px] text-black p-4 rounded-r-3xl rounded-es-3xl text-xs whitespace-pre-line flex flex-col gap-2">
                    <span className="font-semibold">Was this Useful?</span>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant={"darkBlueHover"}
                        size={"xs"}
                        className="text-xs w-full"
                        onClick={props.moveToHome}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={"darkBlueHover"}
                        size={"xs"}
                        className="text-xs w-full"
                        onClick={props.moveToHome}
                      >
                        No
                      </Button>
                      <Button
                        variant={"darkBlueHover"}
                        size={"xs"}
                        className="text-xs w-full"
                        onClick={props.moveToHome}
                      >
                        Ask another query
                      </Button>
                      <div ref={endRef}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* {isStreaming &&
              isStreaming.id === props.ID &&
              isStreaming.isstreaming && (
                <div className="flex w-full flex-row justify-start gap-2">
                  <div className="flex flex-col justify-end gap-1 items-center">
                    <div className="flex items-center justify-center h-12 w-12 bg-[#D9D9D9] rounded-full">
                      <img
                        src={assets.images.coin}
                        alt="profilePic"
                        className="h-auto w-8"
                        height={30}
                        width={30}
                      />
                    </div>
                  </div>
                  <div className="min-w-[220px] flex flex-col">
                    <div className="bg-white max-w-[420px] text-greyText2 p-4 rounded-r-3xl rounded-ss-3xl">
                      <div>{replyText}</div>
                    </div>
                  </div>
                </div>
              )} */}
            {/* {showOptions && (
              <div className="p-4 m-2 rounded-xl h-fit shadow">
                <div className="flex flex-col w-full gap-2">
                  <Button
                    variant={"lightBlue"}
                    className={cn("flex flex-row justify-between px-4", {
                      "bg-lightDarkBlue text-white":
                        curSelected === "Lorem Ipsum donor sit amet consector",
                    })}
                    onClick={() => {
                      setCurSelected("Lorem Ipsum donor sit amet consector");
                    }}
                  >
                    <span className=" line-clamp-1 ">
                      Lorem Ipsum donor sit amet consector
                    </span>
                    <div className="min-w-5">
                      <ChevronRight />
                    </div>
                  </Button>
                  <Button
                    variant={"lightBlue"}
                    className={cn("flex flex-row justify-between px-4", {
                      "bg-lightDarkBlue text-white":
                        curSelected === "Lorem Ipsum donor sit amet",
                    })}
                    onClick={() => {
                      setCurSelected("Lorem Ipsum donor sit amet");
                    }}
                  >
                    <span className=" line-clamp-1 ">
                      Lorem Ipsum donor sit amet consector
                    </span>
                    <div className="min-w-5">
                      <ChevronRight />
                    </div>
                  </Button>
                  <Button
                    variant={"lightBlue"}
                    className={cn("flex flex-row justify-between px-4", {
                      "bg-lightDarkBlue text-white":
                        curSelected === "Lorem Ipsum donor sit amet cons",
                    })}
                    onClick={() => {
                      setCurSelected("Lorem Ipsum donor sit amet cons");
                    }}
                  >
                    <span className=" line-clamp-1 ">
                      Lorem Ipsum donor sit amet consector
                    </span>
                    <div className="min-w-5">
                      <ChevronRight />
                    </div>
                  </Button>
                  {curSelected && (
                    <div className="flex flex-col bg-lightBlue text-slate-400 p-4 rounded-lg text-sm gap-4">
                      <span>Select {curSelected}</span>
                      <div className="flex flex-row justify-end gap-2">
                        <Button
                          variant={"positive"}
                          className="px-8"
                          onClick={sendData}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={"hollowPositive"}
                          className="px-8"
                          onClick={() => {
                            setCurSelected("");
                          }}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </div>
          <>
            {Chat?.closed ? (
              <div className="bg-lightBlue flex flex-col items-center justify-center gap-2 py-4">
                <span>This conversation has been closed</span>
                <Button variant={"hollowPositive"} onClick={onStart}>
                  Start Conversation
                </Button>
              </div>
            ) : (
              <section className="bg-white flex-row flex gap-1 p-1 md:p-3 w-full items-center justify-center flex-shrink-0">
                <div className="flex flex-row items-center gap-4">
                  <div className="flex flex-row">
                    <div>
                      <img
                        src={assets.images.profilePlaceholder}
                        alt="profilePic"
                        className="h-auto w-5 md:w-6"
                        height={20}
                        width={20}
                      />
                    </div>
                  </div>
                  <div className="flex flex-grow font-inter">
                    <Input
                      type="text"
                      placeholder="Type your text here"
                      className="focus:border-none focus:outline-none"
                      value={text}
                      onChange={onChangeChat}
                      disabled={disabled}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  {/* <div>
                    <Button
                      variant={"ghost"}
                      className="py-0 px-0 rounded-full"
                      onClick={props.onRefresh}
                      disabled={props.isRefreshing}
                    >
                      <RefreshCw />
                    </Button>
                  </div> */}
                  <div>
                    <Button
                      variant={"darkBlue"}
                      onClick={onSendMessage}
                      disabled={disabled || text === ""}
                    >
                      SEND
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default ChatPage;
