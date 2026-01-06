package types

import "time"

// FileType 文件类型枚举
type FileType int

const (
	TypeDatabase FileType = iota
	TypeConfig
	TypeCache
	TypeLog
	TypeTemp
	TypeImage
	TypeBackup
	TypeIndex    // 代码索引文件
	TypeUnknown
)

// FileInfo 文件信息结构
type FileInfo struct {
	Path        string    `json:"path"`        // 文件路径
	Name        string    `json:"name"`        // 文件名
	Size        int64     `json:"size"`        // 文件大小
	Modified    time.Time `json:"modified"`    // 修改时间
	FileType    FileType  `json:"file_type"`   // 文件类型
	IsEmpty     bool      `json:"is_empty"`    // 是否为空文件
	IsCorrupted bool      `json:"is_corrupted"`// 是否损坏
}

// DBRecord 数据库记录结构
type DBRecord struct {
	ID           int64     `json:"id"`            // 记录ID
	TableName    string    `json:"table_name"`    // 表名
	CreatedAt    time.Time `json:"created_at"`    // 创建时间
	UpdatedAt    time.Time `json:"updated_at"`    // 更新时间
	DataSize     int64     `json:"data_size"`     // 数据大小估算
	IsOrphaned   bool      `json:"is_orphaned"`   // 是否为孤立记录
}

// Conversation 对话记录结构
type Conversation struct {
	ID           int64     `json:"id"`
	Title        string    `json:"title"`
	MessageCount int       `json:"message_count"`
	TokenCount   int       `json:"token_count"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	LastAccess   time.Time `json:"last_access"`
	SizeBytes    int64     `json:"size_bytes"`
	IsImportant  bool      `json:"is_important"` // 用户标记为重要
	CanDelete    bool      `json:"can_delete"`   // 可以删除
}

// Message 消息记录结构
type Message struct {
	ID             int64     `json:"id"`
	ConversationID int64     `json:"conversation_id"`
	Role           string    `json:"role"`           // 'user' or 'assistant'
	Content        string    `json:"content"`
	Timestamp      time.Time `json:"timestamp"`
	Tokens         int       `json:"tokens"`
}

// StorageStats 存储统计结构
type StorageStats struct {
	TotalSize     int64            `json:"total_size"`     // 总大小
	DBSize        int64            `json:"db_size"`        // 数据库大小
	CacheSize     int64            `json:"cache_size"`     // 缓存大小
	LogSize       int64            `json:"log_size"`       // 日志大小
	TempSize      int64            `json:"temp_size"`      // 临时文件大小
	FileCounts    map[string]int   `json:"file_counts"`    // 各类文件数量
	LastCleanup   time.Time        `json:"last_cleanup"`   // 上次清理时间
}

// CleanupRule 清理规则结构
type CleanupRule struct {
	Name        string      `json:"name"`         // 规则名称
	Description string      `json:"description"`  // 规则描述
	Priority    int         `json:"priority"`     // 优先级 (1-10)
	Enabled     bool        `json:"enabled"`      // 是否启用
	Conditions  []Condition `json:"conditions"`   // 触发条件
	Actions     []Action    `json:"actions"`      // 执行动作
}

// Condition 条件结构
type Condition struct {
	Type        string      `json:"type"`         // 条件类型
	Field       string      `json:"field"`        // 检查字段
	Operator    string      `json:"operator"`     // 操作符 (=, >, <, contains等)
	Value       interface{} `json:"value"`        // 比较值
	LogicOp     string      `json:"logic_op"`     // 逻辑操作符 (AND, OR)
}

// Action 动作结构
type Action struct {
	Type    string `json:"type"`    // 动作类型 (delete, archive, compress等)
	Backup  bool   `json:"backup"`  // 是否备份
	Params  map[string]interface{} `json:"params"` // 动作参数
}

// CleanupPreview 清理预览结构
type CleanupPreview struct {
	Actions      []CleanupAction `json:"actions"`       // 将执行的操作
	TotalSize    int64           `json:"total_size"`    // 总大小
	SafeToDelete bool            `json:"safe_to_delete"`// 是否安全可删除
	Warnings     []string        `json:"warnings"`      // 警告信息
	Recommendations []string     `json:"recommendations"` // 建议
}

// CleanupAction 清理操作结构
type CleanupAction struct {
	ID          int64     `json:"id"`
	Type        string    `json:"type"`
	Target      FileInfo  `json:"target"`
	Rule        string    `json:"rule"`
	Reason      string    `json:"reason"`
	Size        int64     `json:"size"`
	BackupPath  string    `json:"backup_path,omitempty"`
}

// CleanupResult 清理结果结构
type CleanupResult struct {
	Success      bool              `json:"success"`        // 是否成功
	ActionsTaken []CleanupAction   `json:"actions_taken"`  // 执行的操作
	BytesFreed   int64             `json:"bytes_freed"`    // 释放的字节数
	Errors       []CleanupError    `json:"errors"`         // 错误信息
	Duration     time.Duration     `json:"duration"`       // 执行时间
	BackupID     string            `json:"backup_id"`      // 备份ID
}

// CleanupError 清理错误结构
type CleanupError struct {
	Code        string    `json:"code"`         // 错误代码
	Message     string    `json:"message"`      // 错误信息
	FilePath    string    `json:"file_path"`    // 相关文件路径
	Timestamp   time.Time `json:"timestamp"`    // 错误时间
	Recoverable bool      `json:"recoverable"`  // 是否可恢复
}

// BackupConfig 备份配置结构
type BackupConfig struct {
	Enabled        bool          `json:"enabled"`        // 是否启用备份
	Path           string        `json:"path"`           // 备份目录
	MaxBackups     int           `json:"max_backups"`    // 最大备份数量
	Compressed     bool          `json:"compressed"`     // 是否压缩
	AutoCleanup    bool          `json:"auto_cleanup"`   // 自动清理旧备份
	Schedule       string        `json:"schedule"`       // 备份计划
}

// BackupInfo 备份信息结构
type BackupInfo struct {
	ID          string    `json:"id"`           // 备份ID
	Path        string    `json:"path"`         // 备份路径
	Size        int64     `json:"size"`         // 备份大小
	CreatedAt   time.Time `json:"created_at"`   // 创建时间
	ItemCount   int       `json:"item_count"`   // 包含的项目数
	Description string    `json:"description"`  // 备份描述
}

// SafetyConfig 安全配置结构
type SafetyConfig struct {
	MinDiskSpace     string `json:"min_disk_space"`     // 最小磁盘空间要求
	VerifyDatabase   bool   `json:"verify_database"`    // 验证数据库完整性
	RequireConfirmation bool `json:"require_confirmation"` // 需要用户确认
	BackupBeforeDelete bool `json:"backup_before_delete"` // 删除前备份
	MaxConcurrentOps int    `json:"max_concurrent_ops"` // 最大并发操作数
}

// UIConfig UI配置结构
type UIConfig struct {
	ShowProgress     bool `json:"show_progress"`     // 显示进度
	DetailedOutput   bool `json:"detailed_output"`   // 详细输出
	ColorOutput      bool `json:"color_output"`      // 彩色输出
	PauseBetweenSteps bool `json:"pause_between_steps"` // 步骤间暂停
}

// AnalysisResult 分析结果结构
type AnalysisResult struct {
	StorageStats   *StorageStats     `json:"storage_stats"`
	FileAnalysis   map[FileType][]FileInfo `json:"file_analysis"`
	RuleMatches    []RuleMatch       `json:"rule_matches"`
	SpaceSavings   int64             `json:"space_savings"`
	Recommendations []string         `json:"recommendations"`
}

// RuleMatch 规则匹配结构
type RuleMatch struct {
	Rule       CleanupRule `json:"rule"`
	FileInfo   FileInfo    `json:"file_info"`
	Matched    bool        `json:"matched"`
	Confidence float64     `json:"confidence"` // 匹配置信度 (0-1)
}

// EvaluationResult 评估结果结构
type EvaluationResult struct {
	ShouldDelete bool          `json:"should_delete"`
	Reason       string        `json:"reason"`
	Confidence   float64       `json:"confidence"` // 0-1
	RiskLevel    string        `json:"risk_level"` // low, medium, high
	Suggestions  []string      `json:"suggestions"`
}

// DBInfo 数据库信息结构
type DBInfo struct {
	FileSize          int64     `json:"file_size"`
	ConversationCount int       `json:"conversation_count"`
	MessageCount      int       `json:"message_count"`
	TableCount        int       `json:"table_count"`
	LastActivity      time.Time `json:"last_activity"`
}


// ============================================
// Chat 文件相关类型 (用于 Kiro 对话数据统计)
// ============================================

// ChatMessage chat 文件中的消息结构
type ChatMessage struct {
	Role    string `json:"role"`    // "human", "bot", "tool"
	Content string `json:"content"` // 消息内容
}

// ChatMetadata chat 文件元数据
type ChatMetadata struct {
	ModelID       string    `json:"modelId"`       // 模型ID
	ModelProvider string    `json:"modelProvider"` // 模型提供者
	Workflow      string    `json:"workflow"`      // 工作流类型
	WorkflowID    string    `json:"workflowId"`    // 工作流ID
	StartTime     int64     `json:"startTime"`     // 开始时间戳(毫秒)
	EndTime       int64     `json:"endTime"`       // 结束时间戳(毫秒)
}

// ChatFile chat 文件的完整结构
type ChatFile struct {
	ExecutionID string        `json:"executionId"` // 执行ID
	ActionID    string        `json:"actionId"`    // 动作ID
	Chat        []ChatMessage `json:"chat"`        // 消息列表
	Metadata    ChatMetadata  `json:"metadata"`    // 元数据
}

// ChatFileInfo 解析后的 chat 文件信息
type ChatFileInfo struct {
	Path          string       `json:"path"`           // 文件路径
	Size          int64        `json:"size"`           // 文件大小(字节)
	ModTime       time.Time    `json:"mod_time"`       // 修改时间
	MessageCount  int          `json:"message_count"`  // 总消息数
	HumanMessages int          `json:"human_messages"` // 用户消息数
	BotMessages   int          `json:"bot_messages"`   // 助手消息数
	ToolMessages  int          `json:"tool_messages"`  // 工具消息数
	Metadata      ChatMetadata `json:"metadata"`       // 元数据
}

// WorkspaceStats 工作区统计
type WorkspaceStats struct {
	WorkspaceID       string    `json:"workspace_id"`       // 工作区ID(哈希)
	Path              string    `json:"path"`               // 工作区路径
	ConversationCount int       `json:"conversation_count"` // 对话数量
	TotalMessages     int       `json:"total_messages"`     // 总消息数
	TotalSize         int64     `json:"total_size"`         // 总大小(字节)
	LastActivity      time.Time `json:"last_activity"`      // 最后活动时间
}

// ConversationStats 对话统计汇总
type ConversationStats struct {
	TotalConversations int              `json:"total_conversations"` // 总对话数
	TotalMessages      int              `json:"total_messages"`      // 总消息数
	TotalSize          int64            `json:"total_size"`          // 总大小(字节)
	HumanMessages      int              `json:"human_messages"`      // 用户消息数
	BotMessages        int              `json:"bot_messages"`        // 助手消息数
	ToolMessages       int              `json:"tool_messages"`       // 工具消息数
	AvgMessagesPerConv float64          `json:"avg_messages_per_conv"` // 平均每对话消息数
	WorkspaceBreakdown []WorkspaceStats `json:"workspace_breakdown"` // 按工作区分类
	LastActivity       time.Time        `json:"last_activity"`       // 最后活动时间
}

// CleanableConversation 可清理的对话
type CleanableConversation struct {
	Path    string    `json:"path"`     // 文件路径
	Size    int64     `json:"size"`     // 文件大小(字节)
	ModTime time.Time `json:"mod_time"` // 修改时间
	Reason  string    `json:"reason"`   // 清理原因: "old" 或 "large"
}
