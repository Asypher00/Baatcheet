import React, { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "../../../../../lib/utils";
import { apiClient } from "../../../../../lib/api-client";
import { SEARCH_CONTACTS_ROUTE, HOST } from "../../../../../utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "../../../../../store";
const NewDm = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState("false");
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { setSelectedChatType, setSelectedChatData } = useAppStore() ; 
    const searchContacts = async (contact) => {
        try {
            if (contact.length > 0) {
                const res = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { contact },
                    { withCredentials: true },
                );
                if (res.status === 200 && res.data.data) {
                    setSearchedContacts(res.data.data);
                }
            } else {
                setSearchedContacts([]);
            }
        } catch (error) {
            console.log({ error });
        }
    }

    const selectNewContact = (contact) => {
        setSelectedChatType("contact") ; 
        setSelectedChatData(contact) ; 
        setOpenNewContactModal(false);
        setSearchedContacts([]);
    }
    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-small text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModal(true)} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {
                        searchedContacts.length <= 0
                            ? (
                                <div className="flex-1 md:bg-[#1c1d25] md:flex md:flex-col mt-5 justify-center items-center duration-1000 transition-all">
                                    <Lottie
                                        isClickToPauseDisabled={true}
                                        height={100}
                                        width={100}
                                        options={animationDefaultOptions}
                                    />
                                    <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                        <h3 className="coming-soon-regular">
                                            Hi<span className="text-purple-500">! </span>
                                            Search
                                            <span className="text-purple-500"> New Contact</span>
                                        </h3>
                                    </div>
                                </div>
                            )
                            : <ScrollArea className="h-[250px]">
                                <div className="flex flex-col gap-5">
                                    {
                                        searchedContacts.map((contact) => <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={(contact) => selectNewContact(contact)}>
                                            <div className="w-12 h-12 relative">
                                                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                                    {
                                                        contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" /> : (
                                                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                                {
                                                                    contact.firstName
                                                                        ? contact.firstName.split("").shift()
                                                                        : contact.email.split("").shift()
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                {
                                                    contact.firstName
                                                        ? <span>{contact.firstName} {contact.lastName}</span>
                                                        : <span>{contact.email}</span>
                                                }
                                                <span className="text-xs">{contact.email}</span>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </ScrollArea>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDm;