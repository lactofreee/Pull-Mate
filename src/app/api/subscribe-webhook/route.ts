import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 1. 현재 로그인한 사용자의 세션 정보 가져오기
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. 프론트에서 전달한 리포지토리 정보 받기
  const { owner, repo } = await request.json();
  const userAccessToken = session.accessToken as string;

  // 3. GitHub API를 호출하여 웹훅 생성
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
    method: 'POST',
    headers: {
      // 사용자의 액세스 토큰으로 인증
      Authorization: `token ${userAccessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      name: 'web',
      active: true,
      events: ['pull_request'], // PR 이벤트만 구독
      config: {
        // 웹훅을 수신할 내 서비스의 API 주소
        url: process.env.NEXT_PUBLIC_WEBHOOK_URL, // 예: https://myapp.com/api/webhooks/github
        content_type: 'json',
        // 웹훅 시그니처 검증을 위한 시크릿
        secret: process.env.GITHUB_WEBHOOK_SECRET,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to create webhook:", errorData);
    return NextResponse.json({ message: "Failed to create webhook" }, { status: response.status });
  }

  const responseData = await response.json();
  return NextResponse.json({ message: "Webhook created successfully!", data: responseData }, { status: 201 });
}