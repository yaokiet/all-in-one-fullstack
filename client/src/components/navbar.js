import React from 'react';

const Navbar = ({ user }) => {
    return (
        <nav className="bg-blue-500 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Own Schedule</h1>
                {user && (
                    <div className="text-right">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm">{user.role}</p>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;