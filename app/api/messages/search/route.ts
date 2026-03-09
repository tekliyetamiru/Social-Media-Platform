import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'users';

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    if (type === 'users') {
      // Search users
      const result = await pool.query(
        `SELECT id, username, full_name, avatar_url, last_login,
                EXISTS(SELECT 1 FROM followers 
                       WHERE follower_id = $2 AND following_id = users.id) as is_following
         FROM users
         WHERE (username ILIKE $1 OR full_name ILIKE $1)
           AND id != $2
           AND NOT EXISTS(SELECT 1 FROM blocks 
                         WHERE user_id = $2 AND blocked_user_id = users.id)
         LIMIT 10`,
        [`%${query}%`, session.user.id]
      );

      // Add online status
      const users = result.rows.map(user => ({
        ...user,
        is_online: user.last_login ? 
          (Date.now() - new Date(user.last_login).getTime() < 5 * 60 * 1000) : false
      }));

      return NextResponse.json(users);
    } else if (type === 'groups') {
      // Search groups
      const result = await pool.query(
        `SELECT g.*,
                COUNT(gm.user_id) as members_count,
                EXISTS(SELECT 1 FROM group_members 
                      WHERE group_id = g.id AND user_id = $2) as is_member
         FROM groups g
         LEFT JOIN group_members gm ON g.id = gm.group_id
         WHERE g.name ILIKE $1 OR g.description ILIKE $1
         GROUP BY g.id
         LIMIT 10`,
        [`%${query}%`, session.user.id]
      );

      return NextResponse.json(result.rows);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}