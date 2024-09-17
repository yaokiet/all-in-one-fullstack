"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { Input, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Import eye icons from Heroicons

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Track password visibility
    const [message, setMessage] = useState(''); // Used for both success and error messages
    const [messageColor, setMessageColor] = useState(''); // To handle message color
    const router = useRouter(); // Initialize the router hook

    const colorMap = {
        default: 'default',
        primary: 'primary',
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle the showPassword state
    };

    const handleLogin = () => {
        // Dummy validation for credentials (replace with actual authentication logic)
        const validUsername = "user";
        const validPassword = "password";

        if (username === validUsername && password === validPassword) {
            setMessageColor('text-green-500'); // Green text for success
            setMessage('Login successful!'); // Success message
            router.push('/dashboard'); // Navigate to the dashboard after successful login
        } else {
            setMessageColor('text-red-500'); // Red text for error
            setMessage('Invalid username or password.'); // Error message
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-slate-500">
            <div className="flex overflow-hidden rounded-lg shadow-lg w-[400px] h-[300px] md:w-[600px] md:h-[400px]">
                <div className="flex-1 bg-white p-6 flex flex-col justify-center">
                    <div className="space-y-6">
                        <Input
                            type="text"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="max-w-xs"
                            color={colorMap.primary}
                        />
                        <div className="relative max-w-xs">
                            <Input
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                color={colorMap.primary}
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-6 w-6" /> // EyeSlashIcon for "hide"
                                ) : (
                                    <EyeIcon className="h-6 w-6" /> // EyeIcon for "show"
                                )}
                            </button>
                        </div>
                        {message && (
                            <p className={`${messageColor}`}>{message}</p>
                        )}
                    </div>
                </div>
                <div className="w-24 bg-gray-800 flex items-center justify-center">
                    <Button
                        className="bg-gray-800 text-white hover:bg-gray-700"
                        onClick={handleLogin}
                    >
                        LOGIN
                    </Button>
                </div>
            </div>
        </div>
    );
}

