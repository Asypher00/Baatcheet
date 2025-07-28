import React, { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; // Although not used, it's imported
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setUserInfo } = useAppStore() ; 
    const navigate = useNavigate();
    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }
    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                const response = await apiClient.post(SIGNUP_ROUTE, {
                    email,
                    password,
                }, {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    toast.success("Account created successfully. Please login.");
                    setUserInfo(response.data.data) ; 
                    navigate("/profile") ; 
                }
            } catch (error) {
                console.log({ error })
                toast.error("An error occurred. Please try again.");
            }
        } else {
            toast.error("Validation failed");
        }
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const response = await apiClient.post(LOGIN_ROUTE, {
                    email,
                    password,
                }, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    toast.success("Account Logged into successfully");
                    setUserInfo(response.data.data) ; 
                }
                if (response.data.data.id) {
                    if (response.data.data.profileSetup){
                        navigate("/chat") ; 
                    } else{
                        navigate("/profile") ; 
                    }
                }
            } catch (error) {
                console.log( { error })
                toast.error("An error occurred. Please try again.");
            }
        } else {
            toast.error("Validation failed");
        }
        setEmail("");
        setPassword("");
    }


    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">Fill in the details to get started with Baatcheet</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue = "login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 " value="login">Login</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 " value="signup">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                <input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={e => setEmail(e.target.value)} />
                                <input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={e => setPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleLogin} >Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                                <input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={e => setEmail(e.target.value)} />
                                <input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={e => setPassword(e.target.value)} />
                                <input placeholder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleSignup} >Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Background" className="h-[700px]" />
                </div>
            </div>
        </div>
    )
}

export default Auth;