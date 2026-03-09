import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const testResult = await pool.query('SELECT NOW()');
    
    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return NextResponse.json({
      success: true,
      timestamp: testResult.rows[0].now,
      tables: tables.rows.map(r => r.table_name),
      message: 'Database connected successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Database connection failed'
    }, { status: 500 });
  }
}