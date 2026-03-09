// scripts/check-users.js
const { pool } = require('../lib/db/index.cjs');

async function checkUsers() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', testResult.rows[0].now);
    
    // Check users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist!');
      console.log('\nPlease create the users table first:');
      console.log('------------------------------------');
      console.log(`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
      return;
    }
    
    // Get users
    const result = await pool.query('SELECT id, username, email, full_name, created_at FROM users ORDER BY created_at DESC');
    
    console.log('\n📊 Users in database:');
    console.log('=====================');
    
    if (result.rows.length === 0) {
      console.log('No users found in database.');
      console.log('\n💡 Create a test user:');
      console.log('   node scripts/create-test-user.js');
    } else {
      result.rows.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Full Name: ${user.full_name || 'Not set'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      });
      
      console.log('\n✅ Total users:', result.rows.length);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n💡 The users table does not exist. Please create it first.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Cannot connect to database. Check your DATABASE_URL in .env.local');
    }
  } finally {
    await pool.end();
  }
}

checkUsers();