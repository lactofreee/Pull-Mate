"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session && session.user) {
    console.log(session.user);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User Avatar"}
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        )}
        <p>안녕하세요, {session.user.name ?? "사용자"}님!</p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  // 로그아웃 상태일 때
  return (
    <div>
      <p>로그인되지 않았습니다.</p>
      <button onClick={() => signIn("github")}>GitHub으로 로그인</button>
    </div>
  );
}
