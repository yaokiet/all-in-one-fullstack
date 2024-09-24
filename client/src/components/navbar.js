import React from "react";

const Navbar = ({ user }) => {
  return (
    <nav className="bg-blue-500 h-20 w-full text-white flex justify-center">
      <div className="mx-auto w-full flex justify-between items-center">
        <h1 className="text-xl font-bold h-full flex items-center px-10">
          Own Schedule
        </h1>
        {user && (
          <div className="text-right flex flex-col justify-center items-center h-full px-10">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm">{user.role}</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
