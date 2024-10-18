"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import Modal from "./modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';


const Navbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.data.code === 200) {
        console.log("Logged out successfully");
        setIsAuthenticated(false);
        setUsername("");
        setRole("");
        router.push("/authentication");
      } else {
        console.log("Error logging out:", response.data);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/auth",
          {},
          {
            withCredentials: true,
          }
        );
        if (response.data.code === 200) {
          console.log(response.data);
          setIsAuthenticated(true);
          setUsername(
            response.data.staff_fname + " " + response.data.staff_lname
          );
          setPosition(response.data.position);
        } else {
          console.log("error with auth", response.data);
          router.push("/authentication");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/authentication");
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="bg-blue-500 h-20 w-full text-white flex justify-center">
      <div className="mx-auto w-full flex justify-between items-center px-10 pl-20">
        {/* <h1 className="text-xl font-bold">ALLINONE</h1> */}
        <Image
          src="/logo_large.png"
          alt="All In One Logo"
          width={75} // Set your desired width
          height={0} // Set height to 0 to allow auto
          style={{ height: 'auto' }} // Ensure height adjusts automatically
          layout="intrinsic" // or layout="responsive"
          className=""
        />
        {isAuthenticated && (
          <div className="">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="text-right">
                <p className="font-semibold">{username}</p>
                <p className="text-sm">{position}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        buttonMessage={"Logout"}
      />
    </nav>
  );
};

export default Navbar;
