import LoginButton from "@/components/domains/auth/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Welcome to PullMate</h1>
        <LoginButton />
      </header>

      <section style={{ marginTop: "40px" }}>
        {session && <a href="/my-repositories">내 레포지터리</a>}
      </section>
    </main>
  );
}
