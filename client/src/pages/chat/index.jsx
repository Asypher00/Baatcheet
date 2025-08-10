import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../../store/index";
import ContactsContainer from "./contacts-container/index";
import EmptyChatContainer from "./empty-chat-container/index";
import ChatContainer from "./chat-container/index";

const Chat = () => {

    const { userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue");
            navigate("/profile");
        }
    }, [userInfo, navigate]);
    return (
        <div className="flex h-[100vh] text-white overflow-hidden coming-soon-regular">
            <ContactsContainer />
            {
                selectedChatType === undefined
                    ? <EmptyChatContainer />
                    : <ChatContainer />

            }
        </div>
    )
}

export default Chat; 