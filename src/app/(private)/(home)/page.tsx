'use client';

import { getCookie } from "cookies-next";
import "./style.css"

export default function Home() {
  const payload = JSON.parse(getCookie('payload')?.toString() || "{}");

  return (
    <div className="private-home flex">
      <span>Olá</span>
      <strong>{payload?.nome || "Usuário"}</strong>
    </div>
  );
}
