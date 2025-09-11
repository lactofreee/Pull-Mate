import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { getUserRepos, safeOctokitCall } from "@/lib/github/octokit";
import { textEllipsis } from "@/utils/format";

export default async function MyRepositoriesPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const repos = token ? await safeOctokitCall(() => getUserRepos(token)) : null;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg font-medium text-gray-700 mb-4">
          로그인이 필요합니다.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          로그인 하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 GitHub 저장소</h1>
      {!repos || repos.length === 0 ? (
        <p className="text-gray-500">저장소가 없습니다.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-700"
            >
              {/* <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {repo.full_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {textEllipsis(repo.description ?? "", 25)}
                </p>
              </a> */}
              
              <Link href={`/my-repositories/${repo.owner.login}/${repo.name}`}>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {repo.full_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {textEllipsis(repo.description ?? "", 25)}
                </p>
              </Link>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span>⭐ {repo.stargazers_count}</span>
                <span>
                  업데이트:{" "}
                  {repo.updated_at
                    ? new Date(repo.updated_at).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
