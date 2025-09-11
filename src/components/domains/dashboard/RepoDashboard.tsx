"use client";

import Link from "next/link";
import { useState } from "react";
import PRForm from "./PRForm";

type RepoDashboardProps = {
  repo: {
    watchers_count?: number;
    forks_count?: number;
    stargazers_count?: number;
    description?: string | null;
    full_name: string;
    html_url?: string;
    name?: string;
  };
  commits: {
    sha: string;
    message: string;
    date?: string;
    url: string;
  }[];
  hasCommits: boolean;
  owner: string;
  token: string;
};

export default function RepoDashboard({
  repo,
  commits,
  hasCommits,
  owner,
  token,
}: RepoDashboardProps) {
  const [showPRForm, setShowPRForm] = useState(false);
  return (
    <div className="space-y-6">
      {/* 레포지터리 헤더 */}
      <section className="rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{repo.full_name}</h2>
          <Link
            href={`${repo.html_url}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            GitHub에서 보기 ↗
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {repo.description ?? "No description provided."}
        </p>
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <span>⭐ {repo.stargazers_count ?? 0}</span>
          <span>🍴 {repo.forks_count ?? 0}</span>
          <span>👀 {repo.watchers_count ?? 0}</span>
        </div>
      </section>

      {/* 커밋 기여 현황 */}
      <section className="rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold mb-3">내 기여 현황</h3>
        {hasCommits ? (
          <div>
            <p className="text-green-600 mb-3">✅ 커밋 기록이 있습니다.</p>
            <ul className="space-y-2 text-sm">
              {commits.slice(0, 3).map((commit) => (
                <li key={commit.sha} className="border-b pb-2">
                  <Link
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {commit.message}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(commit.date!).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">아직 커밋 기록이 없습니다.</p>
        )}
      </section>

      {/* PR 섹션 */}
      {/* PR 버튼 */}
      {hasCommits && !showPRForm && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => setShowPRForm(true)}
        >
          PR 작성
        </button>
      )}
      {/* PR 작성 폼 */}
      {showPRForm && <PRForm token={token} owner={owner} repo={repo.name!} />}
    </div>
  );
}
