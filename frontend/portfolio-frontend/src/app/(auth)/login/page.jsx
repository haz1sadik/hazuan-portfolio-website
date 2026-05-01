"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext.jsx";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton.jsx";
import TextInputField from "@/components/ui/input/TextInputField.jsx";

const LoginPage = () => {
    const { login, loading, error } = useAuth();
    const router = useRouter();
    const [formState, setFormState] = useState({ username: "", password: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const ok = await login(formState.username, formState.password);
        if (ok) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="font-bold text-[1.5rem] md:text-[2rem]">Admin Login</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <TextInputField type="text" name="username" value={formState.username} onChange={handleChange} label="Username" placeholder="Enter username" required/>
                <TextInputField type="password" name="password" value={formState.password} onChange={handleChange} label="Password" placeholder="Enter password" required/>
            
                <PrimaryButton text="Log In" disabled={loading} onClick={handleSubmit} />
            </form>
            {error && (
                <div className="p-3 px-4 bg-red-200 text-red-700 w-80 rounded-2xl text-wrap">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default LoginPage