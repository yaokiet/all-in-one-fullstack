"use client";

import { useState } from "react";
import React from "react";
import Navbar from "../components/navbar";
import { DatePicker } from "@nextui-org/date-picker";

export default function Home() {
  // const ...
  const [pageState, setPageState] = useState("homepage");

  //useEffect ...

  return (
    <div className="w-full h-screen border border-gray-200 bg-red-200 flex flex-row">
      {pageState === "homepage" && <h1 className=" h-10 ">Home Page</h1>}

      <div className="  bg-red-50">
        <Navbar pageState={pageState} />

        <DatePicker />
      </div>
    </div>
  );
}
