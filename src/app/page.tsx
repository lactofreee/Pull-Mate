import LoginButton from "@/components/domains/auth/LoginButton";

export default function Home() {
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
        {/* ... 서비스 소개 내용 ... */}
        <div>
          <button className="bg-red-500 rounded-3xl p-2">
            PR을 날려보세용
          </button>
        </div>
      </section>
    </main>
  );
}
