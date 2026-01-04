# API文档

本文档描述了Kiro Cleaner工具的内部API结构和使用方法。

## 📋 目录

- [核心接口](#核心接口)
- [数据结构](#数据结构)
- [清理规则](#清理规则)
- [错误处理](#错误处理)
- [使用示例](#使用示例)

## 核心接口

### Scanner接口

扫描器负责发现和分析Kiro数据存储。

```go
type Scanner interface {
    // Scan 扫描Kiro数据文件
    Scan() ([]FileInfo, error)
    
    // GetStorageStats 获取存储统计信息
    GetStorageStats() (*StorageStats, error)
    
    // Analyze 分析扫描结果
    Analyze() (*AnalysisResult, error)
}
```

**实现者**:
- `FileScanner`: 文件系统扫描器
- `DBSanner`: 数据库扫描器

### Cleaner接口

清理引擎负责执行数据清理操作。

```go
type Cleaner interface {
    // SetRules 设置清理规则
    SetRules(rules []CleanupRule) error
    
    // Preview 预览清理操作
    Preview(targets []FileInfo) (*CleanupPreview, error)
    
    // Execute 执行清理
    Execute(targets []FileInfo, dryRun bool) (*CleanupResult, error)
    
    // Rollback 回滚操作
    Rollback(operationID string) error
}
```

**实现者**:
- `CleanupEngine`: 核心清理引擎

### BackupManager接口

备份管理器负责创建和管理备份。

```go
type BackupManager interface {
    // CreateBackup 创建备份
    CreateBackup(items []FileInfo) (string, error)
    
    // Restore 恢复备份
    Restore(backupID string) error
    
    // ListBackups 列出备份
    ListBackups() ([]BackupInfo, error)
    
    // CleanupOldBackups 清理旧备份
    CleanupOldBackups() error
}
```

**实现者**:
- `BackupManager`: ZIP备份管理器

### Database接口

数据库操作接口。

```go
type Database interface {
    // Connect 连接数据库
    Connect(path string) error
    
    // Close 关闭连接
    Close() error
    
    // GetConversations 获取对话列表
    GetConversations() ([]Conversation, error)
    
    // DeleteConversation 删除对话
    DeleteConversation(id int64) error
    
    // GetMessages 获取消息列表
    GetMessages(conversationID int64) ([]Message, error)
    
    // Optimize 优化数据库
    Optimize() error
}
```

**实现者**:
- `DatabaseManager`: SQLite数据库管理器

## 数据结构

### FileInfo

文件信息结构。

```go
type FileInfo struct {
    Path        string    `json:"path"`        // 文件路径
    Name        string    `json:"name"`        // 文件名
    Size        int64     `json:"size"`        // 文件大小
    Modified    time.Time `json:"modified"`    // 修改时间
    FileType    FileType  `json:"file_type"`   // 文件类型
    IsEmpty     bool      `json:"is_empty"`    // 是否为空文件
    IsCorrupted bool      `json:"is_corrupted"`// 是否损坏
}
```

### FileType

文件类型枚举。

```go
type FileType int

const (
    TypeDatabase FileType = iota  // 数据库文件
    TypeConfig                   // 配置文件
    TypeCache                    // 缓存文件
    TypeLog                      // 日志文件
    TypeTemp                     // 临时文件
    TypeImage                    // 图片文件
    TypeBackup                   // 备份文件
    TypeUnknown                  // 未知类型
)
```

### Conversation

对话记录结构。

```go
type Conversation struct {
    ID           int64     `json:"id"`            // 对话ID
    Title        string    `json:"title"`         // 对话标题
    MessageCount int       `json:"message_count"` // 消息数量
    TokenCount   int       `json:"token_count"`   // Token数量
    CreatedAt    time.Time `json:"created_at"`    // 创建时间
    UpdatedAt    time.Time `json:"updated_at"`    // 更新时间
    LastAccess   time.Time `json:"last_access"`   // 最后访问时间
    SizeBytes    int64     `json:"size_bytes"`    // 占用空间
    IsImportant  bool      `json:"is_important"`  // 是否重要
    CanDelete    bool      `json:"can_delete"`    // 是否可删除
}
```

### StorageStats

存储统计信息。

```go
type StorageStats struct {
    TotalSize     int64            `json:"total_size"`     // 总大小
    DBSize        int64            `json:"db_size"`        // 数据库大小
    CacheSize     int64            `json:"cache_size"`     // 缓存大小
    LogSize       int64            `json:"log_size"`       // 日志大小
    TempSize      int64            `json:"temp_size"`      // 临时文件大小
    FileCounts    map[string]int   `json:"file_counts"`    // 文件类型统计
    LastCleanup   time.Time        `json:"last_cleanup"`   // 上次清理时间
}
```

## 清理规则

### CleanupRule

清理规则结构。

```go
type CleanupRule struct {
    Name        string      `json:"name"`         // 规则名称
    Description string      `json:"description"`  // 规则描述
    Priority    int         `json:"priority"`     // 优先级 (1-10)
    Enabled     bool        `json:"enabled"`      // 是否启用
    Conditions  []Condition `json:"conditions"`   // 匹配条件
    Actions     []Action    `json:"actions"`      // 执行动作
}
```

### Condition

条件结构。

```go
type Condition struct {
    Type        string      `json:"type"`         // 条件类型
    Field       string      `json:"field"`        // 检查字段
    Operator    string      `json:"operator"`     // 操作符
    Value       interface{} `json:"value"`        // 比较值
    LogicOp     string      `json:"logic_op"`     // 逻辑操作符
```

**支持的类型**:
- `file_age`: 文件年龄
- `file_type`: 文件类型
- `file_size`: 文件大小
- `file_name`: 文件名
- `conversation_age`: 对话年龄
- `conversation_importance`: 对话重要性

**支持的运算符**:
- `=`: 等于
- `>`: 大于
- `<`: 小于
- `contains`: 包含
- `regex`: 正则匹配

### Action

动作结构。

```go
type Action struct {
    Type    string                 `json:"type"`    // 动作类型
    Backup  bool                   `json:"backup"`  // 是否备份
    Params  map[string]interface{} `json:"params"`  // 动作参数
}
```

**支持的动作类型**:
- `delete`: 删除文件
- `archive`: 压缩文件
- `move`: 移动文件
- `delete_conversation`: 删除对话
- `compress_cache`: 压缩缓存

## 错误处理

### CleanupError

清理错误结构。

```go
type CleanupError struct {
    Code        string    `json:"code"`         // 错误代码
    Message     string    `json:"message"`      // 错误信息
    FilePath    string    `json:"file_path"`    // 相关文件路径
    Timestamp   time.Time `json:"timestamp"`    // 错误时间
    Recoverable bool      `json:"recoverable"`  // 是否可恢复
}
```

**错误代码**:
- `preview_failed`: 预览失败
- `action_failed`: 操作执行失败
- `backup_failed`: 备份失败
- `permission_denied`: 权限不足
- `file_not_found`: 文件不存在
- `disk_space_insufficient`: 磁盘空间不足

## 使用示例

### 基本使用

```go
package main

import (
    "fmt"
    "github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
    "github.com/vibe-coding-labs/kiro-cleaner/internal/cleaner"
    "github.com/vibe-coding-labs/kiro-cleaner/internal/backup"
    "github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
    "github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

func main() {
    // 创建组件
    fileScanner := scanner.NewFileScanner()
    backupMgr := backup.NewBackupManager(&types.BackupConfig{
        Enabled: true,
        Path: "./backups",
    })
    prompter := ui.NewPrompter(os.Stdin, os.Stdout, false)
    
    // 创建清理引擎
    engine := cleaner.NewCleanupEngine(fileScanner, nil, backupMgr, prompter)
    
    // 扫描文件
    files, err := fileScanner.Scan()
    if err != nil {
        fmt.Printf("扫描失败: %v\n", err)
        return
    }
    
    // 预览清理
    preview, err := engine.Preview(files)
    if err != nil {
        fmt.Printf("预览失败: %v\n", err)
        return
    }
    
    fmt.Printf("找到 %d 个可清理项目，预计节省 %d bytes\n", 
        len(preview.Actions), preview.TotalSize)
    
    // 执行清理（预览模式）
    result, err := engine.Execute(files, true)
    if err != nil {
        fmt.Printf("清理失败: %v\n", err)
        return
    }
    
    fmt.Printf("清理完成: %v\n", result.Success)
}
```

### 自定义清理规则

```go
// 创建自定义规则
rules := []types.CleanupRule{
    {
        Name:        "old_logs",
        Description: "清理7天前的日志文件",
        Priority:    2,
        Enabled:     true,
        Conditions: []types.Condition{
            {
                Type:     "file_age",
                Field:    "modified",
                Operator: ">",
                Value:    "168h", // 7天
            },
            {
                Type:     "file_type",
                Field:    "file_type",
                Operator: "=",
                Value:    "log",
            },
        },
        Actions: []types.Action{
            {
                Type:   "delete",
                Backup: true,
            },
        },
    },
}

// 设置规则
engine.SetRules(rules)
```

### 数据库操作

```go
// 连接数据库
dbManager := database.NewDatabaseManager()
err := dbManager.Connect("path/to/conversations.db")
if err != nil {
    log.Fatal(err)
}
defer dbManager.Close()

// 创建表
err = dbManager.CreateTables()
if err != nil {
    log.Fatal(err)
}

// 查询对话
convDAO := &database.ConversationDAO{db: dbManager.GetConnection()}
conversations, err := convDAO.GetAll()
if err != nil {
    log.Fatal(err)
}

for _, conv := range conversations {
    fmt.Printf("对话: %s (%d 消息)\n", conv.Title, conv.MessageCount)
}
```

### 备份操作

```go
// 创建备份
backupMgr := backup.NewBackupManager(&types.BackupConfig{
    Enabled:     true,
    Path:        "./backups",
    Compressed:  true,
})

backupID, err := backupMgr.CreateBackup(files)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("备份创建成功: %s\n", backupID)

// 列出备份
backups, err := backupMgr.ListBackups()
if err != nil {
    log.Fatal(err)
}

for _, backup := range backups {
    fmt.Printf("备份: %s (%d bytes)\n", backup.ID, backup.Size)
}
```

## 扩展开发

### 创建自定义Scanner

```go
type CustomScanner struct {
    // 自定义字段
    customPath string
}

func (cs *CustomScanner) Scan() ([]types.FileInfo, error) {
    // 实现扫描逻辑
    return nil, nil
}

func (cs *CustomScanner) GetStorageStats() (*types.StorageStats, error) {
    // 实现统计逻辑
    return nil, nil
}

func (cs *CustomScanner) Analyze() (*types.AnalysisResult, error) {
    // 实现分析逻辑
    return nil, nil
}
```

### 创建自定义Action

```go
type CustomAction struct {
    // 自定义字段
}

func (ca *CustomAction) Execute(file types.FileInfo) error {
    // 实现自定义动作逻辑
    return nil
}

func (ca *CustomAction) Rollback(file types.FileInfo) error {
    // 实现回滚逻辑
    return nil
}
```

## 最佳实践

### 1. 错误处理
- 总是检查错误返回值
- 使用有意义的错误信息
- 区分可恢复和不可恢复错误

### 2. 资源管理
- 及时释放数据库连接
- 关闭文件句柄
- 清理临时资源

### 3. 并发安全
- 使用互斥锁保护共享数据
- 避免数据竞争
- 合理使用channel

### 4. 性能优化
- 批量操作优于单个操作
- 合理使用缓存
- 避免不必要的计算

### 5. 测试
- 编写单元测试
- 创建集成测试
- 使用模拟数据

更多API使用示例请参考 [test/](../test/) 目录中的测试代码。