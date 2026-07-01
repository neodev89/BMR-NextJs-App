import { Metadata } from "next";
import LoginComponent from "./Login";

export const metadata: Metadata = {
  title: "Login — BMR Calculator",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default async function Login() {
    return <LoginComponent />
}