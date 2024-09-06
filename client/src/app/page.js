"use client";

import { useState } from "react";
import React from "react";
import Navbar from "@/components/navbar";
import { DatePicker } from "@nextui-org/date-picker";

export default function Home() {
  // const ...
  const [pageState, setPageState] = useState("homepage");

  //useEffect ...

  return (
    <div className=" w-full h-full bg-red-200 flex flex-col  ">

      {pageState === "hompage" && (<h1>Home Page</h1>)}

      <div className=" w-full h-full bg-red-50">
        <Navbar pageState={pageState} />

        <DatePicker />
      </div>
    </div>
  );
}
