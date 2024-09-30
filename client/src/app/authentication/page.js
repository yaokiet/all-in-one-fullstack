"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import { Input, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

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
        "http://localhost:5000/login",
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
              color={inputColor} // Change input color dynamically
            />
            <div className="relative max-w-xs">
              <Input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color={inputColor} // Change input color dynamically
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-6 w-6" /> // EyeSlashIcon for "hide"
                ) : (
                  <EyeIcon className="h-6 w-6" /> // EyeIcon for "show"
                )}
              </button>
            </div>
            {message && <p className={`${messageColor}`}>{message}</p>}
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
