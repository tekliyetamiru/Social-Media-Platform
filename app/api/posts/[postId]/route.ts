import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns the post
    const post = await pool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [params.postId]
    );

    if (post.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.rows[0].user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete post (cascade will handle comments, reactions, etc.)
    await pool.query(
      `DELETE FROM posts WHERE id = $1`,
      [params.postId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, visibility } = await req.json();

    // Check if user owns the post
    const post = await pool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [params.postId]
    );

    if (post.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.rows[0].user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update post
    const result = await pool.query(
      `UPDATE posts 
       SET content = COALESCE($1, content),
           visibility = COALESCE($2, visibility),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [content, visibility, params.postId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}