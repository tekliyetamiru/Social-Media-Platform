import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const testResult = await pool.query('SELECT NOW()');
    
    // Check if posts table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'posts'
      );
    `);
    
    // Get count of posts
    const postCount = await pool.query('SELECT COUNT(*) FROM posts');
    
    // Get sample post if exists
    const samplePost = await pool.query(`
      SELECT p.*, u.username 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      LIMIT 1
    `);

    return NextResponse.json({
      success: true,
      timestamp: testResult.rows[0].now,
      tableExists: tableCheck.rows[0].exists,
      postCount: postCount.rows[0].count,
      samplePost: samplePost.rows[0] || null,
      message: 'Database connection successful'
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Database connection failed'
    }, { status: 500 });
  }
}