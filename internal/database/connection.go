package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// DatabaseManager 数据库管理器
type DatabaseManager struct {
	db        *sql.DB
	path      string
	connected bool
}

// ConversationDAO 对话数据访问对象
type ConversationDAO struct {
	db *sql.DB
}

// MessageDAO 消息数据访问对象
type MessageDAO struct {
	db *sql.DB
}

// NewDatabaseManager 创建新的数据库管理器
func NewDatabaseManager() *DatabaseManager {
	return &DatabaseManager{}
}

// Connect 连接数据库
func (dm *DatabaseManager) Connect(path string) error {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return fmt.Errorf("连接数据库失败: %v", err)
	}
	
	// 测试连接
	if err := db.Ping(); err != nil {
		return fmt.Errorf("数据库连接测试失败: %v", err)
	}
	
	dm.db = db
	dm.path = path
	dm.connected = true
	
	return nil
}

// Close 关闭数据库连接
func (dm *DatabaseManager) Close() error {
	if dm.db != nil {
		err := dm.db.Close()
		dm.db = nil
		dm.connected = false
		return err
	}
	return nil
}

// IsConnected 检查是否已连接
func (dm *DatabaseManager) IsConnected() bool {
	return dm.connected && dm.db != nil
}

// GetConnection 获取数据库连接
func (dm *DatabaseManager) GetConnection() *sql.DB {
	return dm.db
}

// ConversationDAO 方法

// GetAll 获取所有对话
func (cdao *ConversationDAO) GetAll() ([]types.Conversation, error) {
	rows, err := cdao.db.Query(`
		SELECT 
			id, title, created_at, updated_at, 
			(SELECT COUNT(*) FROM messages WHERE conversation_id = conversations.id) as message_count,
			(SELECT COUNT(*) FROM messages WHERE conversation_id = conversations.id AND role = 'user') as user_message_count
		FROM conversations 
		ORDER BY updated_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var conversations []types.Conversation
	
	for rows.Next() {
		var conv types.Conversation
		var createdAt, updatedAt sql.NullTime
		
		err := rows.Scan(
			&conv.ID,
			&conv.Title,
			&createdAt,
			&updatedAt,
			&conv.MessageCount,
			&conv.TokenCount, // 暂时设为0，后续可以计算
		)
		if err != nil {
			return nil, err
		}
		
		if createdAt.Valid {
			conv.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			conv.UpdatedAt = updatedAt.Time
		}
		
		// 设置默认值
		conv.LastAccess = conv.UpdatedAt
		conv.SizeBytes = 0 // 暂时设为0
		conv.IsImportant = false
		conv.CanDelete = true
		
		conversations = append(conversations, conv)
	}
	
	return conversations, nil
}

// GetByID 根据ID获取对话
func (cdao *ConversationDAO) GetByID(id int64) (*types.Conversation, error) {
	row := cdao.db.QueryRow(`
		SELECT 
			id, title, created_at, updated_at,
			(SELECT COUNT(*) FROM messages WHERE conversation_id = ?) as message_count
		FROM conversations 
		WHERE id = ?
	`, id, id)
	
	var conv types.Conversation
	var createdAt, updatedAt sql.NullTime
	
	err := row.Scan(
		&conv.ID,
		&conv.Title,
		&createdAt,
		&updatedAt,
		&conv.MessageCount,
	)
	if err != nil {
		return nil, err
	}
	
	if createdAt.Valid {
		conv.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		conv.UpdatedAt = updatedAt.Time
	}
	
	conv.LastAccess = conv.UpdatedAt
	conv.SizeBytes = 0
	conv.IsImportant = false
	conv.CanDelete = true
	
	return &conv, nil
}

// Delete 删除对话
func (cdao *ConversationDAO) Delete(id int64) error {
	// 开始事务
	tx, err := cdao.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	
	// 删除相关消息
	_, err = tx.Exec("DELETE FROM messages WHERE conversation_id = ?", id)
	if err != nil {
		return err
	}
	
	// 删除对话
	_, err = tx.Exec("DELETE FROM conversations WHERE id = ?", id)
	if err != nil {
		return err
	}
	
	// 提交事务
	return tx.Commit()
}

// DeleteOld 删除旧的对话
func (cdao *ConversationDAO) DeleteOld(days int) error {
	cutoff := time.Now().AddDate(0, 0, -days)
	
	// 获取要删除的对话ID
	rows, err := cdao.db.Query("SELECT id FROM conversations WHERE updated_at < ? AND is_important = 0", cutoff)
	if err != nil {
		return err
	}
	defer rows.Close()
	
	var ids []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return err
		}
		ids = append(ids, id)
	}
	
	// 批量删除
	for _, id := range ids {
		if err := cdao.Delete(id); err != nil {
			return err
		}
	}
	
	return nil
}

// MarkImportant 标记为重要
func (cdao *ConversationDAO) MarkImportant(id int64, important bool) error {
	_, err := cdao.db.Exec("UPDATE conversations SET is_important = ? WHERE id = ?", important, id)
	return err
}

// MessageDAO 方法

// GetByConversationID 获取对话的所有消息
func (mdao *MessageDAO) GetByConversationID(conversationID int64) ([]types.Message, error) {
	rows, err := mdao.db.Query(`
		SELECT id, conversation_id, role, content, timestamp, tokens
		FROM messages 
		WHERE conversation_id = ?
		ORDER BY timestamp ASC
	`, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var messages []types.Message
	
	for rows.Next() {
		var msg types.Message
		var timestamp sql.NullTime
		
		err := rows.Scan(
			&msg.ID,
			&msg.ConversationID,
			&msg.Role,
			&msg.Content,
			&timestamp,
			&msg.Tokens,
		)
		if err != nil {
			return nil, err
		}
		
		if timestamp.Valid {
			msg.Timestamp = timestamp.Time
		}
		
		messages = append(messages, msg)
	}
	
	return messages, nil
}

// DeleteOldMessages 删除旧消息
func (mdao *MessageDAO) DeleteOldMessages(days int) error {
	cutoff := time.Now().AddDate(0, 0, -days)
	
	_, err := mdao.db.Exec(`
		DELETE FROM messages 
		WHERE timestamp < ? 
		AND conversation_id NOT IN (
			SELECT id FROM conversations WHERE is_important = 1
		)
	`, cutoff)
	
	return err
}

// GetStorageInfo 获取存储信息
func (dm *DatabaseManager) GetStorageInfo() (*types.DBInfo, error) {
	if !dm.IsConnected() {
		return nil, fmt.Errorf("数据库未连接")
	}
	
	// 获取数据库文件大小
	var fileSize int64
	err := dm.db.QueryRow("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").Scan(&fileSize)
	if err != nil {
		return nil, err
	}
	
	// 获取记录数
	var conversationCount, messageCount int
	dm.db.QueryRow("SELECT COUNT(*) FROM conversations").Scan(&conversationCount)
	dm.db.QueryRow("SELECT COUNT(*) FROM messages").Scan(&messageCount)
	
	// 获取最后活动时间
	var lastActivity sql.NullTime
	dm.db.QueryRow("SELECT MAX(updated_at) FROM conversations").Scan(&lastActivity)
	
	info := &types.DBInfo{
		FileSize:         fileSize,
		ConversationCount: conversationCount,
		MessageCount:     messageCount,
		TableCount:       3, // conversations, messages, settings
		LastActivity:     time.Time{},
	}
	
	if lastActivity.Valid {
		info.LastActivity = lastActivity.Time
	}
	
	return info, nil
}

// Optimize 优化数据库
func (dm *DatabaseManager) Optimize() error {
	if !dm.IsConnected() {
		return fmt.Errorf("数据库未连接")
	}
	
	// 执行VACUUM操作
	_, err := dm.db.Exec("VACUUM")
	return err
}

// CreateTables 创建数据表
func (dm *DatabaseManager) CreateTables() error {
	if !dm.IsConnected() {
		return fmt.Errorf("数据库未连接")
	}
	
	queries := []string{
		`CREATE TABLE IF NOT EXISTS conversations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			is_important BOOLEAN DEFAULT 0,
			metadata TEXT
		)`,
		`CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			conversation_id INTEGER NOT NULL,
			role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
			content TEXT NOT NULL,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
			tokens INTEGER DEFAULT 0,
			FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
		)`,
		`CREATE TABLE IF NOT EXISTS settings (
			key TEXT PRIMARY KEY,
			value TEXT,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages (timestamp)`,
		`CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations (updated_at)`,
	}
	
	for _, query := range queries {
		_, err := dm.db.Exec(query)
		if err != nil {
			return err
		}
	}
	
	return nil
}

// GetAllConversations 获取所有对话
func (dm *DatabaseManager) GetAllConversations() ([]types.Conversation, error) {
	if !dm.IsConnected() {
		return nil, fmt.Errorf("数据库未连接")
	}
	
	dao := &ConversationDAO{db: dm.db}
	return dao.GetAll()
}

// DBInfo 数据库信息结构
type DBInfo struct {
	FileSize          int64     `json:"file_size"`
	ConversationCount int       `json:"conversation_count"`
	MessageCount      int       `json:"message_count"`
	TableCount        int       `json:"table_count"`
	LastActivity      time.Time `json:"last_activity"`
}