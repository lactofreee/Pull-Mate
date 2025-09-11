import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRepoCommits } from "@/lib/github/octokit";
import RepoDashboard from "@/components/domains/dashboard/RepoDashboard";

export default async function RepoPage({
  params,
}: {
  params: { owner: string; repo: string };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const username = session?.user.name;

  if (!token) return <p>로그인이 필요합니다.</p>;

  // GitHub API에서 레포 + 커밋 데이터 가져오기
  const commits = await getRepoCommits(
    token,
    params.owner,
    params.repo,
    username
  );

  return (
    <RepoDashboard
      repo={{ full_name: `${params.owner}/${params.repo}` }}
      commits={commits}
      hasCommits={commits.length > 0}
    />
  );
}
