import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reaction } = await req.json();

    // Add reaction
    await pool.query(
      `INSERT INTO message_reactions (message_id, user_id, reaction)
       VALUES ($1, $2, $3)
       ON CONFLICT (message_id, user_id, reaction) DO NOTHING`,
      [params.messageId, session.user.id, reaction]
    );

    // Get conversation ID for real-time notification
    const messageResult = await pool.query(
      `SELECT conversation_id FROM messages WHERE id = $1`,
      [params.messageId]
    );

    if (messageResult.rows.length > 0) {
      // Get user details for the reaction
      const userResult = await pool.query(
        `SELECT username, avatar_url FROM users WHERE id = $1`,
        [session.user.id]
      );

      await pusherServer.trigger(
        `conversation-${messageResult.rows[0].conversation_id}`,
        'message-reaction',
        {
          messageId: params.messageId,
          reaction: {
            user_id: session.user.id,
            reaction,
            created_at: new Date().toISOString(),
            user: userResult.rows[0],
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reaction } = await req.json();

    // Remove reaction
    await pool.query(
      `DELETE FROM message_reactions
       WHERE message_id = $1 AND user_id = $2 AND reaction = $3`,
      [params.messageId, session.user.id, reaction]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}