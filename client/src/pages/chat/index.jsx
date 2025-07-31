import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../../store/index";
import ContactsContainer from "./contacts-container/index";
import EmptyChatContainer from "./empty-chat-container/index";
import ChatContainer from "./chat-container/index";

const Chat = () => {

    const { userInfo } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue");
            navigate("/profile");
        }
    }, [userInfo, navigate]);
    return (
        <div>
            <ContactsContainer />
            <ChatContainer />
            <EmptyChatContainer />
        </div>
    )
}

export default Chat; 