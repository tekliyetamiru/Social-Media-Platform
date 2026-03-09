import { pool } from './index';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'file' | 'audio';
  media_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  metadata?: any;
  is_read: boolean;
  read_at?: string;
  is_deleted: boolean;
  edited_at?: string;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  reactions?: any[];
  read_receipts?: any[];
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants: any[];
  unread_count?: number;
}

export const messageQueries = {
  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const result = await pool.query(
        `SELECT 
          c.*,
          (
            SELECT row_to_json(m)
            FROM (
              SELECT m.*, 
                    row_to_json(u) as sender
              FROM messages m
              JOIN users u ON m.sender_id = u.id
              WHERE m.conversation_id = c.id AND m.is_deleted = false
              ORDER BY m.created_at DESC
              LIMIT 1
            ) m
          ) as last_message,
          get_unread_count(c.id, $1) as unread_count
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = $1 AND cp.is_archived = false
        ORDER BY c.updated_at DESC`,
        [userId]
      );

      const conversations = [];

      for (const row of result.rows) {
        // Get participants for each conversation with proper structure
        const participantsResult = await pool.query(
          `SELECT 
            cp.*,
            u.id as user_id,
            u.username,
            u.full_name,
            u.avatar_url,
            u.last_login
          FROM conversation_participants cp
          JOIN users u ON cp.user_id = u.id
          WHERE cp.conversation_id = $1`,
          [row.id]
        );

        conversations.push({
          ...row,
          participants: participantsResult.rows.map(p => ({
            user_id: p.user_id,
            role: p.role,
            is_muted: p.is_muted || false,
            is_archived: p.is_archived || false,
            joined_at: p.joined_at,
            last_read_at: p.last_read_at,
            user: {
              id: p.user_id,
              username: p.username || 'unknown',
              full_name: p.full_name || p.username || 'User',
              avatar_url: p.avatar_url || '',
              is_online: this.isUserOnline(p.last_login),
              last_seen: p.last_login,
            },
          })),
          last_message: row.last_message,
          unread_count: parseInt(row.unread_count) || 0,
        });
      }

      return conversations;
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      return [];
    }
  },
  // Get conversation with details
  async getConversationWithDetails(conversationId: string): Promise<Conversation | null> {
    try {
      const conversationResult = await pool.query(
        `SELECT * FROM conversations WHERE id = $1`,
        [conversationId]
      );

      if (conversationResult.rows.length === 0) {
        return null;
      }

      const conversation = conversationResult.rows[0];

      // Get participants with complete user details
      const participantsResult = await pool.query(
        `SELECT 
          cp.*,
          u.id as user_id,
          u.username,
          u.full_name,
          u.avatar_url,
          u.last_login
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = $1`,
        [conversationId]
      );

      // Get last message with sender details
      const lastMessageResult = await pool.query(
        `SELECT 
          m.*,
          u.id as sender_id,
          u.username as sender_username,
          u.full_name as sender_full_name,
          u.avatar_url as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1 AND m.is_deleted = false
        ORDER BY m.created_at DESC
        LIMIT 1`,
        [conversationId]
      );

      return {
        ...conversation,
        participants: participantsResult.rows.map(p => ({
          user_id: p.user_id,
          role: p.role,
          is_muted: p.is_muted || false,
          is_archived: p.is_archived || false,
          joined_at: p.joined_at,
          last_read_at: p.last_read_at,
          user: {
            id: p.user_id,
            username: p.username || 'unknown',
            full_name: p.full_name || p.username || 'User',
            avatar_url: p.avatar_url || '',
            is_online: this.isUserOnline(p.last_login),
            last_seen: p.last_login,
          },
        })),
        last_message: lastMessageResult.rows[0] || null,
        unread_count: 0,
      };
    } catch (error) {
      console.error('Error in getConversationWithDetails:', error);
      return null;
    }
  },

  // Get messages for a conversation
  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    before?: string
  ): Promise<Message[]> {
    try {
      let query = `
        SELECT m.*,
              u.username as sender_username,
              u.full_name as sender_full_name,
              u.avatar_url as sender_avatar,
              COALESCE(
                (SELECT json_agg(
                  json_build_object(
                    'user_id', mr.user_id,
                    'reaction', mr.reaction,
                    'created_at', mr.created_at,
                    'user', json_build_object(
                      'username', ru.username,
                      'avatar_url', ru.avatar_url
                    )
                  )
                )
                FROM message_reactions mr
                JOIN users ru ON mr.user_id = ru.id
                WHERE mr.message_id = m.id
                ), '[]'::json) as reactions,
              COALESCE(
                (SELECT json_agg(
                  json_build_object(
                    'user_id', mrr.user_id,
                    'read_at', mrr.read_at
                  )
                )
                FROM message_read_receipts mrr
                WHERE mrr.message_id = m.id
                ), '[]'::json) as read_receipts
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1 AND m.is_deleted = false
      `;

      const params: any[] = [conversationId];

      if (before) {
        query += ` AND m.created_at < $2`;
        params.push(before);
      }

      query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await pool.query(query, params);

      // Mark messages as read
      await this.markMessagesAsRead(conversationId, userId);

      // Map the results with safe defaults
      return result.rows.reverse().map(row => ({
        id: row.id,
        conversation_id: row.conversation_id,
        sender_id: row.sender_id,
        content: row.content || '',
        message_type: row.message_type || 'text',
        media_url: row.media_url,
        file_name: row.file_name,
        file_size: row.file_size,
        mime_type: row.mime_type,
        is_read: row.is_read || false,
        created_at: row.created_at,
        sender: {
          id: row.sender_id,
          username: row.sender_username || 'unknown',
          full_name: row.sender_full_name || row.sender_username || 'Unknown User',
          avatar_url: row.sender_avatar || '',
        },
        reactions: row.reactions || [],
        read_receipts: row.read_receipts || [],
      }));
    } catch (error) {
      console.error('Error in getMessages:', error);
      return [];
    }
  },
  // Send a message
 // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'image' | 'video' | 'file' | 'audio' = 'text',
    mediaUrl?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
    metadata?: any
  ): Promise<Message | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const messageId = uuidv4();
      
      // Get conversation type and participants
      const convType = await client.query(
        `SELECT type FROM conversations WHERE id = $1`,
        [conversationId]
      );

      let receiverId = null;
      
      // For direct messages, set receiver_id
      if (convType.rows[0]?.type === 'direct') {
        const participants = await client.query(
          `SELECT user_id FROM conversation_participants 
          WHERE conversation_id = $1 AND user_id != $2`,
          [conversationId, senderId]
        );
        receiverId = participants.rows[0]?.user_id || null;
      }
      // For group chats, receiver_id remains null

      // Insert message - removed receiver_id from query if it's null for group chats
      let result;
      if (receiverId) {
        // Direct message with receiver
        result = await client.query(
          `INSERT INTO messages (
            id, conversation_id, sender_id, receiver_id, content, message_type,
            media_url, file_name, file_size, mime_type, metadata, is_read, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, NOW())
          RETURNING *`,
          [
            messageId, conversationId, senderId, receiverId, content, messageType,
            mediaUrl, fileName, fileSize, mimeType, metadata,
          ]
        );
      } else {
        // Group message (no receiver)
        result = await client.query(
          `INSERT INTO messages (
            id, conversation_id, sender_id, content, message_type,
            media_url, file_name, file_size, mime_type, metadata, is_read, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, NOW())
          RETURNING *`,
          [
            messageId, conversationId, senderId, content, messageType,
            mediaUrl, fileName, fileSize, mimeType, metadata,
          ]
        );
      }

      // Update conversation's updated_at
      await client.query(
        `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
        [conversationId]
      );

      await client.query('COMMIT');

      // Get sender details
      const senderResult = await client.query(
        `SELECT id, username, full_name, avatar_url FROM users WHERE id = $1`,
        [senderId]
      );

      const message = {
        ...result.rows[0],
        sender: senderResult.rows[0],
      };

      return message;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in sendMessage:', error);
      return null;
    } finally {
      client.release();
    }
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update last_read_at for participant
      await client.query(
        `UPDATE conversation_participants
         SET last_read_at = CURRENT_TIMESTAMP
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, userId]
      );

      // Add read receipts for unread messages
      await client.query(
        `INSERT INTO message_read_receipts (message_id, user_id)
         SELECT m.id, $2
         FROM messages m
         WHERE m.conversation_id = $1
           AND m.sender_id != $2
           AND m.is_read = false
           AND NOT EXISTS (
             SELECT 1 FROM message_read_receipts
             WHERE message_id = m.id AND user_id = $2
           )`,
        [conversationId, userId]
      );

      // Update messages is_read flag
      await client.query(
        `UPDATE messages
         SET is_read = true,
             read_at = CURRENT_TIMESTAMP
         WHERE conversation_id = $1
           AND sender_id != $2
           AND is_read = false`,
        [conversationId, userId]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in markMessagesAsRead:', error);
    } finally {
      client.release();
    }
  },

  // Search users for new chat
  async searchUsers(query: string, currentUserId: string, limit: number = 10): Promise<any[]> {
    try {
      const result = await pool.query(
        `SELECT id, username, full_name, avatar_url, last_login,
                EXISTS(SELECT 1 FROM followers 
                       WHERE follower_id = $2 AND following_id = users.id) as is_following
         FROM users
         WHERE (username ILIKE $1 OR full_name ILIKE $1)
           AND id != $2
           AND NOT EXISTS(SELECT 1 FROM blocks 
                         WHERE user_id = $2 AND blocked_user_id = users.id)
         LIMIT $3`,
        [`%${query}%`, currentUserId, limit]
      );

      return result.rows.map(user => ({
        ...user,
        is_online: this.isUserOnline(user.last_login),
      }));
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    }
  },
  
  // Delete a message (soft delete)
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const result = await pool.query(
        `UPDATE messages
        SET is_deleted = true
        WHERE id = $1 AND sender_id = $2`,
        [messageId, userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  },

  // Edit a message
  async editMessage(messageId: string, userId: string, content: string): Promise<Message | null> {
    try {
      const result = await pool.query(
        `UPDATE messages
        SET content = $1, edited_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND sender_id = $3 AND is_deleted = false
        RETURNING *`,
        [content, messageId, userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      // Get sender details
      const senderResult = await pool.query(
        `SELECT id, username, full_name, avatar_url FROM users WHERE id = $1`,
        [userId]
      );

      return {
        ...result.rows[0],
        sender: senderResult.rows[0],
      };
    } catch (error) {
      console.error('Error in editMessage:', error);
      return null;
    }
  },
  // Create a new conversation
  async createConversation(
    type: 'direct' | 'group',
    participantIds: string[],
    createdBy: string,
    name?: string,
    avatarUrl?: string
  ): Promise<Conversation | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const conversationId = uuidv4();
      
      await client.query(
        `INSERT INTO conversations (id, type, name, avatar_url, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [conversationId, type, name, avatarUrl, createdBy]
      );

      for (const userId of participantIds) {
        const role = userId === createdBy ? 'admin' : 'member';
        await client.query(
          `INSERT INTO conversation_participants (conversation_id, user_id, role)
           VALUES ($1, $2, $3)`,
          [conversationId, userId, role]
        );
      }

      await client.query('COMMIT');

      return this.getConversationWithDetails(conversationId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createConversation:', error);
      return null;
    } finally {
      client.release();
    }
  },

  // Helper function to check if user is online
  isUserOnline(lastLogin: string): boolean {
    if (!lastLogin) return false;
    const lastLoginTime = new Date(lastLogin).getTime();
    const now = Date.now();
    return now - lastLoginTime < 5 * 60 * 1000;
  },
};