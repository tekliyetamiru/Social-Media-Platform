// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/queries';
import { z } from 'zod';

const postSchema = z.object({
  content: z.string().min(1).max(5000),
  media_urls: z.array(z.string()).optional(),
  media_types: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'followers', 'close_friends']).default('public'),
  tags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'feed';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let posts;
    if (type === 'explore') {
      posts = await db.posts.getExploreFeed(limit, offset);
    } else if (type === 'user') {
      const userId = searchParams.get('userId');
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }
      posts = await db.posts.getUserPosts(userId, session?.user?.id, limit, offset);
    } else {
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      posts = await db.posts.getFeed(session.user.id, limit, offset);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = postSchema.parse(body);

    const post = await db.posts.create({
      ...validatedData,
      user_id: session.user.id,
    });

    // Process hashtags
    if (validatedData.tags) {
      for (const tag of validatedData.tags) {
        const hashtag = await db.hashtags.findOrCreate(tag.toLowerCase());
        await pool.query(
          'INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)',
          [post.id, hashtag.id]
        );
      }
    }

    // Create notifications for mentions
    if (validatedData.mentions) {
      for (const userId of validatedData.mentions) {
        await db.notifications.create({
          user_id: userId,
          type: 'mention',
          actor_id: session.user.id,
          post_id: post.id,
          content: `${session.user.username} mentioned you in a post`,
        });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const post = await db.posts.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check visibility permissions
    if (post.visibility !== 'public' && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (post.visibility === 'followers') {
      const isFollower = await pool.query(
        'SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2',
        [session?.user.id, post.user_id]
      );
      if (!isFollower.rows[0] && post.user_id !== session?.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (post.visibility === 'close_friends') {
      const isCloseFriend = await pool.query(
        'SELECT 1 FROM close_friends WHERE user_id = $1 AND friend_id = $2',
        [post.user_id, session?.user.id]
      );
      if (!isCloseFriend.rows[0] && post.user_id !== session?.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await db.posts.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.user_id !== session.user.id && !session.user.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.posts.delete(params.id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/stories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stories = await db.stories.getActiveStories(session.user.id);
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('media') as File;
    const caption = formData.get('caption') as string;
    const audience = formData.get('audience') as string;

    if (!file) {
      return NextResponse.json({ error: 'Media file required' }, { status: 400 });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload logic here...
    const mediaUrl = 'https://res.cloudinary.com/...'; // Replace with actual upload

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await db.stories.create({
      user_id: session.user.id,
      media_url: mediaUrl,
      media_type: file.type.startsWith('video/') ? 'video' : 'image',
      caption,
      audience,
      expires_at: expiresAt,
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const notifications = await db.notifications.getUserNotifications(
      session.user.id,
      limit,
      offset
    );
    const unreadCount = await db.notifications.getUnreadCount(session.user.id);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationIds, markAll } = await req.json();

    if (markAll) {
      await db.notifications.markAllAsRead(session.user.id);
    } else if (notificationIds) {
      for (const id of notificationIds) {
        await db.notifications.markAsRead(id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    let results;
    if (type === 'users') {
      results = await db.users.search(query, limit);
    } else if (type === 'hashtags') {
      results = await db.hashtags.search(query, limit);
    } else {
      results = await db.search.global(query, limit);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}