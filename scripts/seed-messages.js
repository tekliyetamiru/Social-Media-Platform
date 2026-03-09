const { Pool } = require('@neondatabase/serverless');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

async function seedMessages() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🌱 Seeding messaging data...');

    // Get existing users
    const users = await pool.query(
      'SELECT id, username FROM users LIMIT 5'
    );

    if (users.rows.length < 2) {
      console.log('❌ Need at least 2 users to create conversations');
      return;
    }

    const user1 = users.rows[0];
    const user2 = users.rows[1];
    const user3 = users.rows[2];

    // Create a direct conversation between user1 and user2
    const conv1Id = uuidv4();
    await pool.query(
      `INSERT INTO conversations (id, type, created_by, created_at, updated_at)
       VALUES ($1, 'direct', $2, NOW(), NOW())`,
      [conv1Id, user1.id]
    );

    // Add participants
    await pool.query(
      `INSERT INTO conversation_participants (conversation_id, user_id, role, joined_at)
       VALUES ($1, $2, 'admin', NOW()), ($1, $3, 'member', NOW())`,
      [conv1Id, user1.id, user2.id]
    );

    // Add some messages
    const messages = [
      { sender: user1.id, content: 'Hey! How are you?' },
      { sender: user2.id, content: 'I\'m good, thanks! How about you?' },
      { sender: user1.id, content: 'Doing great! Working on this messaging system.' },
      { sender: user2.id, content: 'Awesome! Let me know if you need any help.' },
    ];

    for (const msg of messages) {
      await pool.query(
        `INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, message_type, created_at)
         VALUES ($1, $2, $3, $4, $5, 'text', NOW())`,
        [uuidv4(), conv1Id, msg.sender, msg.sender === user1.id ? user2.id : user1.id, msg.content]
      );
    }

    // Update conversation timestamp
    await pool.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [conv1Id]
    );

    // Create a group conversation
    const groupId = uuidv4();
    await pool.query(
      `INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
       VALUES ($1, 'group', 'Test Group', $2, NOW(), NOW())`,
      [groupId, user1.id]
    );

    // Add participants
    await pool.query(
      `INSERT INTO conversation_participants (conversation_id, user_id, role, joined_at)
       VALUES ($1, $2, 'admin', NOW()), ($1, $3, 'member', NOW()), ($1, $4, 'member', NOW())`,
      [groupId, user1.id, user2.id, user3.id]
    );

    console.log('✅ Messaging data seeded successfully!');
    console.log(`📨 Created conversation between ${user1.username} and ${user2.username}`);
    console.log(`👥 Created group with ${user1.username}, ${user2.username}, ${user3.username}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedMessages();