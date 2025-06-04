import type { Metadata } from "next";
import React from "react";
import SignIn from "../page";

export const metadata: Metadata = {
  title:
    "Kapssul Doctor Dashboard | ",
  description: "This is Kapssul doctor Dashboard Template",
};

export default function Login() {
  return (
    <SignIn/>
  );
}
