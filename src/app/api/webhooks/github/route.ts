// app/api/webhooks/github/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import Pusher from 'pusher';

// Pusher 인스턴스 초기화
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const eventType = request.headers.get('x-github-event');
  
  // 1. 시그니처 검증 (보안)
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = 'sha256=' + hmac.update(bodyText).digest('hex');

  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  // 2. 이벤트가 'pull_request'일 때만 처리
  if (eventType !== 'pull_request') {
    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
  }
  
  const payload = JSON.parse(bodyText);

  // 3. PR이 'opened'(생성)되었을 때만 로직 실행
  if (payload.action === 'opened') {
    console.log('New PR opened:', payload.pull_request.title);

    // 프론트엔드에 전달할 데이터 정제
    const newPrData = {
      id: payload.pull_request.id,
      title: payload.pull_request.title,
      url: payload.pull_request.html_url,
      number: payload.pull_request.number,
      author: payload.pull_request.user.login,
      authorAvatar: payload.pull_request.user.avatar_url,
    };

    try {
      // 4. Pusher를 통해 'pr-channel' 채널에 'new-pr' 이벤트를 발행
      await pusher.trigger('pr-channel', 'new-pr', newPrData);
      console.log('Successfully triggered Pusher event');
    } catch (error) {
      console.error('Pusher trigger error:', error);
      return NextResponse.json({ message: 'Error triggering Pusher event' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
}