"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import { Input, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const [message, setMessage] = useState(""); // Used for both success and error messages
  const [messageColor, setMessageColor] = useState(""); // To handle message color
  const [inputColor, setInputColor] = useState("primary"); // Track input field color
  const router = useRouter(); // Initialize the router hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
        {
          email: username,
          password: password,
        },
        { withCredentials: true }
      );

      console.log(response.data);

      const responseCode = response.data.code;

      if (responseCode === 200) {
        // Reset input color and message on successful login
        setInputColor("primary");
        setMessage("");
        router.push("/"); // Redirect to home page
      } else {
        // Set input color to red and show error message
        setInputColor("danger");
        setMessage(response.data.message || "Login failed");
        setMessageColor("text-red-500"); // Set message text color to red
      }
    } catch (error) {
      console.error("There was an error logging in:", error);
      setInputColor("error"); // Set input color to red for failed login
      setMessage("An error occurred while logging in.");
      setMessageColor("text-red-500");
    }
  };
  // Keydown event handler to check for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-500">
      <div className="flex overflow-hidden rounded-lg shadow-lg w-[800px] h-[500px]">
        <div className="flex-1 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <div className="space-y-6">
            <Input
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown} // Add keydown event handler for password input
              className="max-w-xs"
              color={inputColor}
            />
            <div className="relative max-w-xs">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown} // Add keydown event handler for password input
                color={inputColor}
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <EyeSlashIcon className="text-blue-500 h-6 w-6" />
                ) : (
                  <EyeIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {message && <p className={messageColor}>{message}</p>}
            <Button
              className="bg-blue-500 text-white hover:bg-blue-700 w-full"
              onClick={handleLogin}
            >
              LOGIN
            </Button>
          </div>
        </div>
        <div className="w-[400px] bg-blue-500 flex flex-col items-center justify-center p-8">
          <div className="mb-8">
            <Image
              src="/logo_large.png"
              alt="Logo"
              width={500} // specify both width and height, or use fill
              height={auto}
              priority // set priority for above-the-fold images
            />
          </div>
          <div>
            <Image
              src="/title.png"
              alt="All in One"
              width={200}
              height={auto}
              priority
            />

          </div>
        </div>
      </div>
    </div>
  );
}
