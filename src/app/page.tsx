"use client";
import React, { useState, useEffect, FormEvent } from "react";

import { OneDiv } from "./bothDiv/page";
import { DivLeft } from "./divLeft/page";
import { DivRight } from "./divRight/page";
import { LoadingPage } from "./loadingPage/page";

import { Provider } from "react-redux";
import store from "@/store-redux/Store";

import { userAuthProps } from "@/@types/user-auth";
import { CustomInput } from "@/components/generic-inputs/inputs";

import './style-page.sass';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<userAuthProps[]>([]);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [stateInputs, setStateInputs] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: ""
  });
  const [isOkLength, setIsOkLength] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStateInputs(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLength =
    (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const { name, value } = e.target;
      if (value.length >= 6 && value.length <= 30) {
        setIsOkLength(`Il valore di ${name} è corretto`);
      } else {
        setIsOkLength(`il valore di ${name} è corto o troppo lungo`)
      }
    }

  async function handleSignIn(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const response = await fetch('/api/auth/save-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stateInputs  }),
    });

    if (!response.ok) {
      setIsAuth(false);
      console.error("Autenticazione fallita!");
    } else {
      setIsAuth(true);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const isState = stateInputs ?? { email: "", password: "" }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  isState })
    });

    if (!response.ok) {
      setIsAuth(false);
      console.log("Autenticazione fallita");
    } else {
      setIsAuth(true);
    }
  }

  useEffect(() => {
    function change() {
      const isTrue = isLoading === false ? setIsLoading(true) : setIsLoading(false);
      return isTrue;
    }
    change();
  }, [isOkLength]);

  return (
    <Provider store={store}>
      <div className="flex xs:flex-col xs:overflow-y-scroll sm:flex-row justify-evenly items-center h-screen w-screen border-solid border-black border-2 p-x-4 p-y-2">
        {
          isAuth ? (
            <>
              <OneDiv>
                {isLoading ? (<DivLeft />) : (<LoadingPage />)}
              </OneDiv>
              <OneDiv>
                {isLoading ? (<DivRight />) : (<LoadingPage />)}
              </OneDiv>
            </>
          ) : (
            <OneDiv>
              <div className="contenitore">
                <div className="login">
                  <p>{isOkLength}</p>
                  <form action="/api/auth/save-auth" method="POST" className="save-auth">
                    <fieldset className="fieldset-form">
                      <CustomInput
                        type="email"
                        name="email"
                        placeholder="email"
                        value={stateInputs.email}
                        onChange={handleChange}
                        onBlur={handleLength}
                        className="login-input"
                      />
                      <CustomInput
                        type="password"
                        name="password"
                        placeholder="password"
                        value={stateInputs.password}
                        onChange={handleChange}
                        onBlur={handleLength}
                        className="login-input"
                      />
                    </fieldset>
                    <div className="enter-user">
                      <input type="submit" value="Sign in" onSubmit={handleSignIn}/>
                      <input type="submit" value="Sign up" onSubmit={handleSignUp} />
                    </div>
                  </form>
                </div>
              </div>
            </OneDiv>
          )
        }
      </div>
    </Provider >
  );
}
