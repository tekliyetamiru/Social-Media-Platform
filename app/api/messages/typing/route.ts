import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pusherServer, isPusherAvailable } from '@/lib/pusher';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, isTyping } = await req.json();

    // Only trigger if Pusher is available
    if (isPusherAvailable && pusherServer) {
      await pusherServer.trigger(
        `conversation-${conversationId}`,
        'typing-indicator',
        {
          conversationId,
          userId: session.user.id,
          isTyping,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending typing indicator:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}