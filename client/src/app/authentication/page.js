import React from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";

// // Email component
// export function Email() {
//     return (
//         <Input
//             isRequired
//             type="email"
//             label="Email"
//             defaultValue=""
//             className="max-w-xs"
//         />
//     );
// }

// // Password component
// export function Password() {
//     return (
//         <Input
//             isRequired
//             type="password"
//             label="Password"
//             defaultValue=""
//             className="max-w-xs"
//         />
//     );
// }

export default function LoginPage() {
    const colorMap = {
        default: 'default',
        primary: 'primary',
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-slate-500">
            <div className="flex overflow-hidden rounded-lg shadow-lg w-[400px] h-[300px] md:w-[600px] md:h-[400px]">
                <div className="flex-1 bg-white p-6 flex flex-col justify-center">
                    <div className="space-y-6">
                        <Input
                            type="text"
                            label="Username"
                            defaultValue=""
                            className="max-w-xs"
                            color={colorMap.primary}
                        />
                        <Input
                            type="email"
                            label="Email"
                            defaultValue=""
                            className="max-w-xs"
                            color={colorMap.primary}
                        />
                        <div className="flex items-center justify-between text-sm">
                            <a href="#" className="text-gray-500">Forgot Password?</a>
                        </div>
                    </div>
                </div>
                <div className="w-24 bg-gray-800 flex items-center justify-center">
                    <Button className="bg-gray-800 text-white hover:bg-gray-700">
                        LOGIN
                    </Button>
                </div>
            </div>
        </div>
    );
}


