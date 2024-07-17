import { useEffect, useRef, useState } from "react";
import { assets } from "../assets";
import { Button } from "./ui/button";
import { TypeAnimation } from "react-type-animation";
import { ChevronRight } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Calendar } from "./ui/calendar";
// import { cn } from "../lib/utils";
// import { ChevronRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type BotChatProps = {
  chat: any;
  isLast: boolean;
  setText?: React.Dispatch<React.SetStateAction<string>>;
  Ended: () => void;
};

const BotChat = (props: BotChatProps) => {
  const [showOptions, setShowOptions] = useState(false);
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // const [date, setDate] = useState<Date>();

  const regex = /\((https:\/\/[^\s()]+)\)/g;
  let matches;
  const results: string[] = [];

  const [typingStatus, setTypingStatus] = useState("Initializing");

  const [AllTyped, setAllTyped] = useState(false);

  const [currentId, setCurrentId] = useState<number>(0);

  while ((matches = regex.exec(props.chat.data)) !== null) {
    results.push(matches[1]);
  }

  const cleanedText = props.chat.data.replace(
    /\[([^\]]+)\]\([^)]+\)|<<completed>>/g,
    ""
  );

  const isEnded = props.chat.data.endsWith("<<completed>>");

  const textArray: string[] = cleanedText
    .split(/(?<=\.)/)
    .map((sentence: string) => sentence.trim())
    .filter(Boolean);

  const botChatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    botChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Split the text into lines intelligently
  const lines: string[] = props.chat.data
    .split(/(?<=[.!?])\s+/)
    .map((line: string) => line.trim())
    .filter(Boolean);

  // Create the output array
  const output: { link: string; line: number }[] = [];

  lines.forEach((line, index) => {
    results.forEach((result) => {
      if (
        line.includes(result) &&
        !output.some(
          (entry) => entry.link === result && entry.line === index + 1
        )
      ) {
        output.push({ link: result, line: index + 1 });
      }
    });
  });

  useEffect(() => {
    let intervalId: any;

    if (typingStatus === "Typing...") {
      intervalId = setInterval(scrollToBottom, 400); // Adjust the interval as needed
    } else if (typingStatus === "Done Typing") {
      scrollToBottom();
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [typingStatus]);

  useEffect(() => {
    if (typingStatus === "Done Typing" && isEnded && AllTyped) {
      props.Ended();
    }
  }, [typingStatus, isEnded, props, AllTyped]);

  return (
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
        <span className="text-[9px]">{props.chat.timeStamp}</span>
      </div>
      <div className="max-w-[220px] flex flex-col">
        <div
          className="bg-lightBlue max-w-[220px] text-black p-4 rounded-r-3xl rounded-es-3xl text-xs whitespace-pre-line"
          onClick={() => {
            setShowOptions((pre) => !pre);
          }}
        >
          {props.isLast ? (
            textArray.map((sentences, index) => {
              const linkIndex = output.findIndex(
                (item) => item.line === index + 1
              );
              return (
                <>
                  {currentId === index ? (
                    <TypeAnimation
                      sequence={[
                        1500,
                        () => {
                          setTypingStatus("Typing...");
                        },
                        sentences,
                        () => {
                          setCurrentId((pre) => pre + 1);
                          setTypingStatus("Done Typing");
                          if (index + 1 === textArray.length) {
                            setAllTyped(true);
                          }
                        },
                      ]}
                      cursor={false}
                      repeat={0}
                      speed={60}
                      className="whitespace-pre-line"
                    />
                  ) : currentId > index ? (
                    output.findIndex((item) => item.line === index + 1) !==
                    -1 ? (
                      <div key={index}>
                        <span className="whitespace-pre-line">{sentences}</span>
                        <Button
                          variant={"lightBlue"}
                          size={"xs"}
                          className="flex flex-row justify-between bg-lightDarkBlue text-white"
                          onClick={() => {
                            window.open(output[linkIndex].link, "_blank");
                          }}
                        >
                          <span className="line-clamp-1 text-xs w-[160px]">
                            {output[linkIndex].link}
                          </span>
                          <div className="min-w-5">
                            <ChevronRight size={16} />
                          </div>
                        </Button>
                      </div>
                    ) : (
                      <span key={index} className="whitespace-pre-line">
                        {sentences}
                      </span>
                    )
                  ) : (
                    <span> </span>
                  )}
                </>
              );
            })
          ) : (
            <div className="flex flex-col">
              {textArray.map((sentences, index) => {
                const linkIndex = output.findIndex(
                  (item) => item.line === index + 1
                );
                return output.findIndex((item) => item.line === index + 1) !==
                  -1 ? (
                  <div>
                    <span className="whitespace-pre-line">{sentences}</span>
                    <Button
                      variant={"lightBlue"}
                      size={"xs"}
                      className="flex flex-row justify-between bg-lightDarkBlue text-white"
                      onClick={() => {
                        window.open(output[linkIndex].link, "_blank");
                      }}
                    >
                      <span className="line-clamp-1 text-xs w-[160px]">
                        {output[linkIndex].link}
                      </span>
                      <div className="min-w-5">
                        <ChevronRight size={16} />
                      </div>
                    </Button>
                  </div>
                ) : (
                  <span className="whitespace-pre-line">{sentences}</span>
                );
              })}

              {/* {uniqueResults.length !== 0 && (
                <div className="flex flex-col gap-2">
                  {uniqueResults.map((link) => {
                    return (
                      <Button
                        variant={"lightBlue"}
                        size={"xs"}
                        className="flex flex-row justify-between bg-lightDarkBlue text-white"
                        onClick={() => {
                          window.open(link, "_blank");
                        }}
                      >
                        <span className="line-clamp-1 text-xs">{link}</span>
                        <div className="min-w-5">
                          <ChevronRight size={16} />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )} */}
            </div>
          )}
          {/* {uniqueResults.length !== 0 &&
            typingStatus === "Done Typing" &&
            props.isLast && (
              <div className="flex flex-col gap-2">
                {uniqueResults.map((link) => {
                  return (
                    <Button
                      variant={"lightBlue"}
                      size={"xs"}
                      className="flex flex-row justify-between bg-lightDarkBlue text-white"
                      onClick={() => {
                        window.open(link, "_blank");
                      }}
                    >
                      <span className="line-clamp-1 text-xs">{link}</span>
                      <div className="min-w-5">
                        <ChevronRight size={16} />
                      </div>
                    </Button>
                  );
                })}
              </div>
            )} */}

          {/* {typeof props.chat.data === "string" &&
            props.isLast &&
            (props.chat.data.toLowerCase().includes("yes") ||
              props.chat.data.toLowerCase().includes("if you need")) &&
            (props.chat.data.toLowerCase().includes("no") ||
              props.chat.data.toLowerCase().includes("please let me know")) && (
              <div className="flex flex-row gap-6 w-full justify-end">
                <Button
                  variant={"blue"}
                  className="rounded-3xl"
                  onClick={() => {
                    if (props.setText) {
                      props.setText("Yes");
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant={"blueOutline"}
                  onClick={() => {
                    if (props.setText) {
                      props.setText("No");
                    }
                  }}
                >
                  No
                </Button>
              </div>
            )} */}
          {/* {props.isLast && (
            <div>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"darkBlue"}
                    className={cn("w-full font-light h-10 text-sm")}
                    onClick={() => {
                      setShowOptions(false);
                    }}
                  >
                    <span>Choose Date</span>
                    <ChevronRight color="white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="z-50 w-auto rounded-md bg-slate-225 p-0"
                >
                  <>
                    <Calendar
                      initialFocus
                      captionLayout="dropdown-buttons"
                      className="p-0 bg-white rounded-xl flex-grow"
                      fromYear={1900}
                      id="DOB"
                      mode="single"
                      selected={date}
                      toYear={new Date().getFullYear()}
                      classNames={{
                        day_hidden: "invisible",
                        dropdown:
                          "rounded-[5px] bg-lightGrey text-popover-foreground text-xs font-bold focus-visible:outline-none ring-offset-background",
                        caption_dropdowns: "flex gap-3",
                        vhidden: "hidden",
                        caption_label: "hidden",
                        head: "flex items-center",
                        cell: "h-8 font-medium text-center justify-center w-full mx-[1px] bg-lightGrey",
                        day_selected: "bg-lightDarkBlue text-white",
                        day_outside: "bg-white text-slate-400",
                      }}
                      onDayClick={(e) => {
                        if (e) {
                          setDate(e);
                          if (props.setText) {
                            e.setMinutes(
                              e.getMinutes() - e.getTimezoneOffset()
                            );
                            props.setText(e.toISOString().split("T")[0]);
                          }
                          setIsCalendarOpen(false);
                        }
                      }}
                    />
                  </>
                </PopoverContent>
              </Popover>
            </div>
          )} */}
        </div>
        {showOptions && (
          <div className="flex flex-row w-full justify-end ">
            <Button variant={"transparent"} size={"iconSmall"}>
              <img src={assets.icons.volume} height={24} width={24} alt="vol" />
            </Button>
            <Button variant={"transparent"} size={"iconSmall"}>
              <img src={assets.icons.copy} height={20} width={20} alt="copy" />
            </Button>
            <Button variant={"transparent"} size={"iconSmall"}>
              <img
                src={assets.icons.dislike}
                height={20}
                width={20}
                alt="dislike"
              />
            </Button>
          </div>
        )}
        <div ref={botChatEndRef}></div>
      </div>
    </div>
  );
};

export default BotChat;
