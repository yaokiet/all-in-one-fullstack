import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, User } from "lucide-react";

export default function TeamCard({ team }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-4">
      <div className="h-full flex flex-row text-center">
        <div className="w-1/4 p-6 bg-green-50 justify-center flex flex-col items-center">
          <h2 className="text-lg font-semibold">{team.position} Team</h2>
        </div>
        <div className="w-full">
          <div className="p-6  h-1/2 bg-blue-50 flex flex-row">
            <div className="w-1/2 font-semibold">AM In-Office</div>
            <div className="w-1/2 font-semibold">PM In-Office</div>
          </div>
          <div className="p-6  bg-red-50 h-1/2 flex flex-row">
            <div className="w-1/2">{team.in_office_count} / {team.total_count}</div>
            <div className="w-1/2">21253 / 35151</div>
          </div>
        </div>
      </div>
    </div>
  );
}
