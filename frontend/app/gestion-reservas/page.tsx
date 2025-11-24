"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GestionReservas() {
  const router = useRouter();

  useEffect(() => {
    router.push("/gestion-reservas/dashboard");
  }, [router]);

  return null;
}
