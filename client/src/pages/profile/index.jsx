import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../store//index";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom";
import { getColor, colors } from "../../lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE } from "../../utils/constants";
const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        if(userInfo.image){
            setImage(`${HOST}/${userInfo.image}`) ; 
        }
    }, [userInfo])
    const validateProfile = () => {
        if (!firstName) {
            toast.error("Please Enter Your First Name");
            return false;
        }
        if (!lastName) {
            toast.error("Please Enter Your Last Name");
            return false;
        }
        return true;
    }

    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const res = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    {
                        firstName,
                        lastName,
                        color: selectedColor
                    },
                    {
                        withCredentials: true,
                    }
                );
                console.log({ res });
                if (res.status === 200 && res.data.data) {
                    setUserInfo({ ...res.data.data });
                    toast.success("Profile Updated Successfully");
                    navigate("/chat");
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong")
            }
        }
    }

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");
        } else {
            toast.error("Please setup profile to continue");
            navigate("/profile");
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]; 
        console.log(file) ; 
        const formData = new FormData ; 
        formData.append("profile-image", file)
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
            withCredentials: true,
        }) ; 
        if(res.status === 200 && res.data.data.image){
            setUserInfo({...userInfo, image: res.data.data.image}) ; 
            toast.success("Profile Image Updated Successfully") ; 
        }
    }

    const handleDeleteImage = async () => {
        try {
            const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{
                withCredentials: true,
            }) ; 
            if(res.status === 200){
                setUserInfo({...userInfo, image: null}) ; 
                toast.success("Profile Image Deleted Successfully") ; 
                setImage(null) ; 
            }
        } catch (error) {
            console.log({error}) ; 
            toast.error("Something went wrong") ; 
        }
    }
    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[800vw] md:w-max">
                <div onClick={handleNavigate}>
                    <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
                </div>
                <div className="grid grid-cols-2">
                    <div className="h-full w-32 md:w-48 relative flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
                            {
                                image ? <Avatar src={image} alt="profile" className="object-cover w-full h-full bg-black" /> : (
                                    <div className={`uppercase h-32 2-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                        {
                                            firstName
                                                ? firstName.split("").shift()
                                                : userInfo.email.split("").shift()
                                        }
                                    </div>
                                )
                            }
                        </Avatar>
                        {
                            hovered &&
                            <div className="absolute  flex items-center justify-center bg-black/50 ring-fuchsia-100 rounded-full" onClick={image ? handleDeleteImage : handleFileInputClick} name="prfile-image" accept=".jpg .jpeg .png .svg .webp ">
                                {
                                    image ? (<FaTrash className="text-white text-3xl cursor-pointer" />) : (<FaPlus className="text-white text-3xl cursor-pointer" />)
                                }
                            </div>
                        }
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".jpg,.jpe,, .png, .svg .webp" />
                    </div>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                        <div className="w-full">
                            <Input placeholder="Email" type="email" disabled className="rounded-lg p-6 bg-[#2c2e3b] border-none" value={userInfo.email} />

                        </div>
                        <div className="w-full">
                            <Input placeholder="First Name" type="text" className="rounded-lg p-6 bg-[#2c2e3b] border-none" value={firstName} onChange={e => setFirstName(e.target.value)} />

                        </div>
                        <div className="w-full">
                            <Input placeholder="Last Name" type="text" className="rounded-lg p-6 bg-[#2c2e3b] border-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="w-full flex gap-5">
                            {
                                colors.map((color, index) => (
                                    <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-white/75 outline-1" : ""
                                        }`} key={index} onClick={() => setSelectedColor(index)}></div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Button className="h-16 w-full bg-purple hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>

        </div>

    )
}

export default Profile; 