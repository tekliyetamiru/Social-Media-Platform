import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await pool.query(
      `SELECT 
        c.*,
        u.username,
        u.full_name,
        u.avatar_url,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', r.id,
              'content', r.content,
              'user_id', r.user_id,
              'created_at', r.created_at,
              'user', json_build_object(
                'username', ru.username,
                'full_name', ru.full_name,
                'avatar_url', ru.avatar_url
              )
            )
          )
          FROM comments r
          JOIN users ru ON r.user_id = ru.id
          WHERE r.parent_id = c.id
          ), '[]'::json) as replies,
        EXISTS(
          SELECT 1 FROM comment_likes 
          WHERE comment_id = c.id AND user_id = $2
        ) as is_liked
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1 AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT $3 OFFSET $4`,
      [params.postId, session.user.id, limit, offset]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, parentId } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const commentId = uuidv4();
    const result = await pool.query(
      `WITH new_comment AS (
        INSERT INTO comments (id, post_id, user_id, content, parent_id, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      )
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = $2
      RETURNING (SELECT * FROM new_comment)`,
      [commentId, params.postId, session.user.id, content, parentId]
    );

    // Get user details
    const userResult = await pool.query(
      `SELECT username, full_name, avatar_url FROM users WHERE id = $1`,
      [session.user.id]
    );

    const comment = {
      ...result.rows[0],
      user: userResult.rows[0],
      is_liked: false,
      replies: [],
    };

    // Get post owner for notification
    const post = await pool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [params.postId]
    );

    if (post.rows[0].user_id !== session.user.id) {
      // Create notification
      await pool.query(
        `INSERT INTO notifications (user_id, type, actor_id, post_id, comment_id, content)
         VALUES ($1, 'comment', $2, $3, $4, $5)`,
        [post.rows[0].user_id, session.user.id, params.postId, commentId, `${session.user.username} commented on your post`]
      );
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}