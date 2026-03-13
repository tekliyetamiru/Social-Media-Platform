import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already liked
    const existing = await pool.query(
      `SELECT 1 FROM reactions 
       WHERE post_id = $1 AND user_id = $2 AND reaction_type = 'like'`,
      [params.postId, session.user.id]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await pool.query(
        `DELETE FROM reactions 
         WHERE post_id = $1 AND user_id = $2 AND reaction_type = 'like'`,
        [params.postId, session.user.id]
      );
      
      await pool.query(
        `UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1`,
        [params.postId]
      );

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await pool.query(
        `INSERT INTO reactions (post_id, user_id, reaction_type)
         VALUES ($1, $2, 'like')`,
        [params.postId, session.user.id]
      );
      
      await pool.query(
        `UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1`,
        [params.postId]
      );

      // Get post owner for notification
      const post = await pool.query(
        `SELECT user_id FROM posts WHERE id = $1`,
        [params.postId]
      );

      if (post.rows[0].user_id !== session.user.id) {
        // Create notification
        await pool.query(
          `INSERT INTO notifications (user_id, type, actor_id, post_id, content)
           VALUES ($1, 'like', $2, $3, $4)`,
          [post.rows[0].user_id, session.user.id, params.postId, `${session.user.username} liked your post`]
        );
      }

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}