import { useState } from "react";
import HomeChatPage from "./HomeChatPage";
import ChatPage from "./ChatPage";
import { ArrowLeft, CircleX } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { addNewChat, closeChat, removeChat } from "@/store/chatSlice";
import { assets } from "@/assets";

const ChatBox = () => {
  const [isHome, setIsHome] = useState<boolean>(true);

  const dispatch = useDispatch();

  const [id, setID] = useState<string>("");

  const [uid, setUID] = useState<string>("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onStart = (uid: string, id: string) => {
    fetch("https://newcoindcx.azurewebsites.net/update_user_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: uid, session_id: id }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const movetoChatPage = (uid: string) => {
    const id = Math.floor(Math.random() * 3216549876541).toString();
    setID(id);
    setIsHome(false);
    dispatch(addNewChat({ id: id, uid: uid }));
    setUID(uid);
    onStart(uid, id);
  };

  const onStartNewConv = (uid: string) => {
    const id = Math.floor(Math.random() * 3216549876541).toString();
    setID(id);
    dispatch(addNewChat({ id: id, uid: uid }));
    onStart(uid, id);
  };

  const moveToOldChat = (id: string) => {
    setID(id);
    setIsHome(false);
  };

  const moveToHome = () => {
    setIsHome(true);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    console.log(id);
    fetch("https://newcoindcx.azurewebsites.net/clear_conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setIsRefreshing(false);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .finally(() => {
        setIsRefreshing(false);
        dispatch(removeChat({ id }));
      });
  };

  const onClose = () => {
    setIsRefreshing(true);
    console.log(id);
    fetch("https://newcoindcx.azurewebsites.net/clear_conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setIsRefreshing(false);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const ClearChat = () => {
    dispatch(closeChat({ id: id }));
    onClose();
  };

  return (
    <section className="flex flex-col rounded-xl h-[70vh] overflow-hidden">
      <div className="flex flex-row justify-between flex-shrink-0 bg-darkBlue text-white">
        <div className="flex flex-row gap-2  p-4">
          {!isHome && (
            <Button
              variant={"transparent"}
              className="w-fit h-fit p-0"
              onClick={() => {
                setIsHome(true);
              }}
            >
              <ArrowLeft />
            </Button>
          )}
          <div>
            <img src={assets.images.logo} alt="logo" height={20} width={120} />
          </div>
        </div>
        {!isHome && (
          <Button
            variant={"transparent"}
            className="p-4 mt-2"
            onClick={ClearChat}
          >
            <CircleX />
          </Button>
        )}
      </div>
      <>
        {isHome || id === "" ? (
          <HomeChatPage
            movetoChat={movetoChatPage}
            moveToPage={moveToOldChat}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />
        ) : (
          <ChatPage
            ID={id}
            startNew={onStartNewConv}
            uid={uid}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            moveToHome={moveToHome}
          />
        )}
      </>
    </section>
  );
};

export default ChatBox;
