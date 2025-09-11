"use client";

import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";

interface PRFormProps {
  token: string;
  owner: string;
  repo: string;
}

export default function PRForm({ token, owner, repo }: PRFormProps) {
  const octokit = new Octokit({ auth: token });

  const [branches, setBranches] = useState<string[]>([]);
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 브랜치 목록 가져오기
  useEffect(() => {
    async function fetchBranches() {
      try {
        const { data } = await octokit.repos.listBranches({ owner, repo });
        const branchNames = data.map((b) => b.name);
        setBranches(branchNames);
        setSourceBranch(branchNames[0] || "");
        setTargetBranch(branchNames[0] || "");
      } catch (error) {
        console.error(error);
      }
    }
    fetchBranches();
  }, [octokit.repos, owner, repo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceBranch || !targetBranch || !title) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { data } = await octokit.request(
        `POST /repos/${owner}/${repo}/pills`,
        {
          owner,
          repo,
          title,
          head: sourceBranch,
          base: targetBranch,
          body,
        }
      );
      setSuccessMsg(`PR 생성 성공: ${data.html_url}`);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else if (typeof error === "string") {
        setErrorMsg(error);
      } else {
        setErrorMsg("PR 생성 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900 space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-2">Pull Request 생성</h2>

      <div>
        <label className="block text-sm font-medium mb-1">소스 브랜치</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={sourceBranch}
          onChange={(e) => setSourceBranch(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">타겟 브랜치</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={targetBranch}
          onChange={(e) => setTargetBranch(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          className="w-full border rounded px-2 py-1"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명</label>
        <textarea
          className="w-full border rounded px-2 py-1"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "생성중..." : "PR 생성"}
      </button>

      {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
      {errorMsg && <p className="mt-2 text-red-600">{errorMsg}</p>}
    </form>
  );
}
