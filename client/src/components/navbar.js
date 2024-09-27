import React, { useState } from "react";
import { ChevronDown, LogOut } from 'lucide-react';
import Modal from './modal';

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      // Simulated API call for logout
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("User logged out successfully");
      // Here you would typically clear user session, cookies, etc.
      setIsLogoutModalOpen(false);
      // You might want to redirect to login page or refresh the app state here
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (show error message, etc.)
    }
  };

  return (
    <nav className="bg-blue-500 h-20 w-full text-white flex justify-center">
      <div className="mx-auto w-full flex justify-between items-center px-10">
        <h1 className="text-xl font-bold">Own Schedule</h1>
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
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
      />
    </nav>
  );
};

export default Navbar;