import { Bot } from "lucide-react";
import "./App.css";
import { assets } from "./assets";
import ChatBox from "./components/ChatBox";
import { Button } from "./components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";

function App() {
  return (
    <>
      <div className="relative flex flex-row h-screen w-full">
        <div className="absolute top-0 w-full h-10 flex flex-row justify-between items-center px-2 md:px-20 py-8">
          <div className="flex flex-row gap-4 font-inter text-slate-800">
            <img src={assets.images.coin} alt="logo" height={30} width={100} />
            <span className="hidden md:block">Trade</span>
            <span className="hidden md:block">Futures</span>
            <span className="hidden md:block">Learn</span>
            <span className="hidden md:block">Business</span>
            <span className="hidden md:block">About Us</span>
            <span className="hidden md:block">Support</span>
          </div>
          <div className="flex flex-row gap-4">
            <Button variant={"darkBlue"} size={"sm"}>
              Create Account
            </Button>
            <Button variant={"lightBlue"} size={"sm"} className="text-darkBlue">
              Login
            </Button>
          </div>
        </div>
        <div className="absolute right-5 bottom-5 md:right-20 md:bottom-10">
          <Popover>
            <PopoverTrigger>
              <div className="bg-darkBlue h-12 w-12 rounded-full flex flex-row items-center justify-center">
                <Bot color="white" height={24} width={24} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 rounded-xl shadow-lg mr-10">
              <ChatBox />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

export default App;
