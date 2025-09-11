"use client";

import Link from "next/link";

type RepoDashboardProps = {
  repo: {
    watchers_count: ReactNode;
    forks_count: ReactNode;
    stargazers_count: ReactNode;
    description: string;
    full_name: string;
  };
  commits: {
    sha: string;
    message: string;
    date: string | undefined;
    url: string;
  }[];
  hasCommits: boolean;
};

export default function RepoDashboard({
  repo,
  commits,
  hasCommits,
}: RepoDashboardProps) {
  // console.log(`repo:${repo}`);
  return (
    <div className="space-y-6">
      {/* 1. Repository Header */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{repo.full_name}</h2>
          <Link
            href={"/"}
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
          <span>⭐ {repo.stargazers_count}</span>
          <span>🍴 {repo.forks_count}</span>
          <span>👀 {repo.watchers_count}</span>
        </div>
      </div>

      {/* 2. Contribution Panel */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-900">
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
      </div>

      {/* 3. Pull Request Panel */}
      <div className="rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold mb-3">Pull Request</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          새 기능이나 버그 수정을 제안하려면 PR을 작성하세요.
        </p>
        <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          PR 작성하기
        </button>
      </div>
    </div>
  );
}
