const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function cleanupConversations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Scanning for conversation issues...');

    // Find conversations where users are participants but shouldn't be
    const result = await pool.query(`
      SELECT 
        cp.conversation_id,
        cp.user_id,
        c.type,
        c.created_by,
        COUNT(m.id) as message_count,
        BOOL_OR(m.sender_id = cp.user_id) as has_sent_messages,
        BOOL_OR(m.receiver_id = cp.user_id) as has_received_messages
      FROM conversation_participants cp
      JOIN conversations c ON cp.conversation_id = c.id
      LEFT JOIN messages m ON m.conversation_id = c.id 
        AND (m.sender_id = cp.user_id OR m.receiver_id = cp.user_id)
      GROUP BY cp.conversation_id, cp.user_id, c.type, c.created_by
    `);

    let removed = 0;
    let issues = [];

    for (const row of result.rows) {
      // Check if user should be in this conversation
      const shouldBeInConversation = 
        row.user_id === row.created_by || // User created it
        row.has_sent_messages || // User sent messages
        row.has_received_messages; // User received messages

      if (!shouldBeInConversation && row.message_count === 0) {
        // Remove user if they have no activity in the conversation
        await pool.query(
          `DELETE FROM conversation_participants 
           WHERE conversation_id = $1 AND user_id = $2`,
          [row.conversation_id, row.user_id]
        );
        removed++;
        issues.push({
          conversation_id: row.conversation_id,
          user_id: row.user_id,
          reason: 'No activity'
        });
      }
    }

    console.log('\n📊 Cleanup Results:');
    console.log(`   Removed ${removed} invalid participant entries`);
    
    if (issues.length > 0) {
      console.log('\n📝 Issues fixed:');
      issues.forEach(issue => {
        console.log(`   - Removed user ${issue.user_id} from conversation ${issue.conversation_id} (${issue.reason})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

cleanupConversations();