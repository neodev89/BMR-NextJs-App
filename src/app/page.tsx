"use client";
import { useState, useEffect } from "react";
import { OneDiv } from "./bothDiv/page";
import { DivLeft } from "./divLeft/page";
import { DivRight } from "./divRight/page";
import { LoadingPage } from "./loadingPage/page";
import { Provider } from "react-redux";
import store from "@/store-redux/Store";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    function change() {
      const isTrue = isLoading === false ? setIsLoading(true) : setIsLoading(false);
      return isTrue;
    }
    change();
  }, []);

  return (
    <Provider store={store}>
      <div className="flex xs:flex-col xs:overflow-y-scroll sm:flex-row justify-evenly items-center h-screen w-screen border-solid border-black border-2 p-x-4 p-y-2">
        <OneDiv>
          {isLoading ? (<DivLeft />) : (<LoadingPage />)}
        </OneDiv>
        <OneDiv>
          <DivRight />
        </OneDiv>
      </div>
    </Provider>
  );
}
