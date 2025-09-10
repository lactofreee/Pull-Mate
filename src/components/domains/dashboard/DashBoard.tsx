"use client";

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import Image from 'next/image';

// PR 데이터 타입을 정의
interface PullRequest {
  id: number;
  title: string;
  url: string;
  number: number;
  author: string;
  authorAvatar: string;
}

export default function DashBoard() {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ---- 1. 초기 데이터 로딩 ----
    // 실제 앱에서는 이 부분에 API를 호출하여 현재 열려있는 PR 목록을 가져옵니다.
    // 예: fetch('/api/get-initial-prs').then(...)
    // 여기서는 간단하게 빈 배열로 시작합니다.
    setIsLoading(false);


    // ---- 2. Pusher 실시간 연결 설정 ----
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // 'pr-channel'을 구독합니다.
    const channel = pusher.subscribe('pr-channel');

    // 'new-pr' 이벤트가 수신되면 실행될 콜백 함수를 바인딩합니다.
    channel.bind('new-pr', (newPr: PullRequest) => {
      console.log('New PR received from Pusher:', newPr);
      
      // 상태를 업데이트하여 화면을 다시 렌더링합니다.
      // 중복 추가를 방지하기 위해 ID 존재 여부를 확인합니다.
      setPullRequests((prevPrs) => 
        prevPrs.some(pr => pr.id === newPr.id) ? prevPrs : [newPr, ...prevPrs]
      );
    });

    // ---- 3. 컴포넌트 언마운트 시 연결 해제 (Clean-up) ----
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []); // 이 useEffect는 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Real-time Pull Requests</h1>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {pullRequests.length > 0 ? (
            pullRequests.map((pr) => (
              <li key={pr.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
                <Image src={pr.authorAvatar} alt={pr.author} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <a href={pr.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    #{pr.number} {pr.title}
                  </a>
                  <p className="text-sm text-gray-600">Opened by {pr.author}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">
              Waiting for new Pull Requests...
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}