import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DoctorAlertsPage from "@/components/notification";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Patient Alerts" />
      <div className="space-y-6">
       <DoctorAlertsPage/>
       </div>
    </div>
  );
}
