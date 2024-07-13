"use client";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import Button from "@/components/Button";

export default function PlatformPage() {
  const { user } = useUserInfoContext();

  return (
    <>
      <PageHeader title="Plataforma" />
    </>
  );
}
