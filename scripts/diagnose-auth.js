// scripts/diagnose-auth.js
const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
  console.log('🔍 Authentication Diagnosis');
  console.log('==========================\n');

  // Check environment variables
  console.log('1️⃣  Checking Environment Variables:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing'}\n`);

  // Test database connection
  console.log('2️⃣  Testing Database Connection:');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const testResult = await pool.query('SELECT NOW()');
    console.log(`   ✅ Connected successfully at ${testResult.rows[0].now}\n`);
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}\n`);
    process.exit(1);
  }

  // Check if users table exists
  console.log('3️⃣  Checking Users Table:');
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('   ✅ Users table exists\n');
    } else {
      console.log('   ❌ Users table does not exist\n');
      console.log('   📝 Creating users table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
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
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      `);
      
      console.log('   ✅ Users table created\n');
    }
  } catch (error) {
    console.log(`   ❌ Error checking table: ${error.message}\n`);
  }

  // Check existing users
  console.log('4️⃣  Checking Existing Users:');
  try {
    const users = await pool.query(
      'SELECT id, username, email, full_name, created_at FROM users ORDER BY created_at DESC'
    );

    if (users.rows.length === 0) {
      console.log('   📝 No users found. Creating a test user...\n');
      
      // Create a test user
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        fullName: 'Test User'
      };

      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      
      const newUser = await pool.query(
        `INSERT INTO users (username, email, password_hash, full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, full_name, created_at`,
        [testUser.username, testUser.email, hashedPassword, testUser.fullName]
      );

      console.log('   ✅ Test user created:');
      console.log(`      Username: ${testUser.username}`);
      console.log(`      Email: ${testUser.email}`);
      console.log(`      Password: ${testUser.password}`);
    } else {
      console.log(`   📊 Found ${users.rows.length} user(s):\n`);
      users.rows.forEach((user, index) => {
        console.log(`   👤 User ${index + 1}:`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Username: ${user.username}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Full Name: ${user.full_name || 'N/A'}`);
        console.log(`      Created: ${new Date(user.created_at).toLocaleString()}\n`);
      });
    }
  } catch (error) {
    console.log(`   ❌ Error checking users: ${error.message}\n`);
  }

  // Test password hashing
  console.log('5️⃣  Testing Password Hashing:');
  try {
    const testPassword = 'Test123!';
    const hash = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, hash);
    
    console.log(`   ✅ Password hashing working: ${isValid ? '✓' : '✗'}\n`);
  } catch (error) {
    console.log(`   ❌ Password hashing error: ${error.message}\n`);
  }

  await pool.end();
  console.log('\n✨ Diagnosis complete!');
}

diagnose().catch(console.error);