# Kiro清理工具数据结构和清理策略设计

## 1. 核心数据结构

### 1.1 文件信息结构
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

### 1.2 数据库记录结构
```go
type DBRecord struct {
    ID           int64     `json:"id"`            // 记录ID
    TableName    string    `json:"table_name"`    // 表名
    CreatedAt    time.Time `json:"created_at"`    // 创建时间
    UpdatedAt    time.Time `json:"updated_at"`    // 更新时间
    DataSize     int64     `json:"data_size"`     // 数据大小估算
    IsOrphaned   bool      `json:"is_orphaned"`   // 是否为孤立记录
}
```

### 1.3 对话记录结构
```go
type Conversation struct {
    ID          int64     `json:"id"`
    Title       string    `json:"title"`
    MessageCount int      `json:"message_count"`
    TokenCount   int      `json:"token_count"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
    LastAccess   time.Time `json:"last_access"`
    SizeBytes    int64     `json:"size_bytes"`
    IsImportant  bool      `json:"is_important"` // 用户标记为重要
    CanDelete    bool      `json:"can_delete"`   // 可以删除
}
```

### 1.4 存储统计结构
```go
type StorageStats struct {
    TotalSize     int64            `json:"total_size"`     // 总大小
    DBSize        int64            `json:"db_size"`        // 数据库大小
    CacheSize     int64            `json:"cache_size"`     // 缓存大小
    LogSize       int64            `json:"log_size"`       // 日志大小
    TempSize      int64            `json:"temp_size"`      // 临时文件大小
    FileCounts    map[string]int   `json:"file_counts"`    // 各类文件数量
    LastCleanup   time.Time        `json:"last_cleanup"`   // 上次清理时间
}
```

## 2. 文件类型枚举

```go
type FileType int

const (
    TypeDatabase FileType = iota
    TypeConfig
    TypeCache
    TypeLog
    TypeTemp
    TypeImage
    TypeBackup
    TypeUnknown
)
```

## 3. 清理规则引擎

### 3.1 基础清理规则
```go
type CleanupRule struct {
    Name        string      `json:"name"`         // 规则名称
    Description string      `json:"description"`  // 规则描述
    Priority    int         `json:"priority"`     // 优先级 (1-10)
    Enabled     bool        `json:"enabled"`      // 是否启用
    Conditions  []Condition `json:"conditions"`   // 触发条件
    Actions     []Action    `json:"actions"`      // 执行动作
}
```

### 3.2 条件类型
```go
type Condition struct {
    Type        string      `json:"type"`         // 条件类型
    Field       string      `json:"field"`        // 检查字段
    Operator    string      `json:"operator"`     // 操作符 (=, >, <, contains等)
    Value       interface{} `json:"value"`        // 比较值
    LogicOp     string      `json:"logic_op"`     // 逻辑操作符 (AND, OR)
}
```

### 3.3 预设清理规则

#### 3.3.1 临时文件清理
```json
{
    "name": "temp_file_cleanup",
    "description": "清理临时文件",
    "priority": 1,
    "enabled": true,
    "conditions": [
        {
            "type": "file_age",
            "field": "modified",
            "operator": ">",
            "value": "1h",
            "logic_op": "AND"
        },
        {
            "type": "file_type",
            "field": "file_type",
            "operator": "=",
            "value": "temp",
            "logic_op": "AND"
        }
    ],
    "actions": [
        {
            "type": "delete",
            "backup": false
        }
    ]
}
```

#### 3.3.2 旧日志清理
```json
{
    "name": "old_log_cleanup",
    "description": "清理7天前的日志文件",
    "priority": 2,
    "enabled": true,
    "conditions": [
        {
            "type": "file_age",
            "field": "modified",
            "operator": ">",
            "value": "168h",
            "logic_op": "AND"
        },
        {
            "type": "file_type",
            "field": "file_type",
            "operator": "=",
            "value": "log",
            "logic_op": "AND"
        }
    ],
    "actions": [
        {
            "type": "delete",
            "backup": true
        }
    ]
}
```

#### 3.3.3 对话历史清理
```json
{
    "name": "old_conversation_cleanup",
    "description": "清理30天前的非重要对话",
    "priority": 5,
    "enabled": true,
    "conditions": [
        {
            "type": "conversation_age",
            "field": "updated_at",
            "operator": ">",
            "value": "720h",
            "logic_op": "AND"
        },
        {
            "type": "conversation_importance",
            "field": "is_important",
            "operator": "=",
            "value": false,
            "logic_op": "AND"
        }
    ],
    "actions": [
        {
            "type": "delete_conversation",
            "backup": true
        }
    ]
}
```

## 4. 安全策略

### 4.1 备份策略
```go
type BackupConfig struct {
    Enabled        bool          `json:"enabled"`        // 是否启用备份
    Path           string        `json:"path"`           // 备份目录
    MaxBackups     int           `json:"max_backups"`    // 最大备份数量
    Compressed     bool          `json:"compressed"`     // 是否压缩
    AutoCleanup    bool          `json:"auto_cleanup"`   // 自动清理旧备份
    Schedule       string        `json:"schedule"`       // 备份计划
}
```

### 4.2 安全检查
```go
type SafetyCheck struct {
    Type        string    `json:"type"`         // 检查类型
    Description string    `json:"description"`  // 检查描述
    Critical    bool      `json:"critical"`     // 是否为关键检查
    Checker     string    `json:"checker"`      // 检查函数名
}
```

#### 4.2.1 关键安全检查
- 数据库文件完整性检查
- 可用磁盘空间检查
- 备份目录权限检查
- 重要数据标记检查

### 4.3 回滚机制
```go
type RollbackInfo struct {
    OperationID  string                 `json:"operation_id"`  // 操作ID
    Timestamp    time.Time              `json:"timestamp"`      // 操作时间
    Backups      []BackupInfo           `json:"backups"`        // 备份信息
    Changes      []ChangeRecord         `json:"changes"`        // 变更记录
    Completed    bool                   `json:"completed"`      // 是否完成
}
```

## 5. 用户交互设计

### 5.1 扫描阶段
```
🔍 扫描Kiro数据存储...
📊 数据库文件: /Users/user/Library/Application Support/Kiro/conversations.db (125.6 MB)
📁 配置文件: /Users/user/Library/Application Support/Kiro/config.json (2.1 KB)
🗂️ 缓存目录: /Users/user/Library/Application Support/Kiro/cache/ (89.3 MB)
📝 日志目录: /Users/user/Library/Application Support/Kiro/logs/ (15.7 MB)
🗑️ 临时目录: /Users/user/Library/Application Support/Kiro/temp/ (3.2 MB)

总计存储使用: 235.9 MB
扫描完成! 找到 1,247 个可清理项目 (预计节省: 67.8 MB)
```

### 5.2 清理预览
```
🧹 清理预览 (预计节省 67.8 MB):

1. 临时文件 (3.2 MB)
   - temp_session_*.tmp (1.5 MB)
   - download_cache/* (1.7 MB)

2. 旧日志文件 (15.7 MB)
   - app_2024-01-*.log (12.3 MB)
   - error_2024-01-*.log (3.4 MB)

3. 过期货币缓存 (45.2 MB)
   - model_cache_v1/* (28.9 MB)
   - response_cache/expired/* (16.3 MB)

4. 旧对话记录 (3.7 MB)
   - 15个对话记录 (最后活动: 30+天前)

是否继续清理? (y/N/q=quit):
```

### 5.3 清理进度
```
🧹 开始清理...
[████████████████████████████████████████] 100% (1,247/1,247)

✅ 清理完成!
📊 清理结果:
   - 删除了 892 个临时文件 (3.2 MB)
   - 清理了 23 个旧日志文件 (15.7 MB)
   - 删除了 315 个过期缓存文件 (45.2 MB)
   - 移除了 15 个旧对话记录 (3.7 MB)

💾 总计节省: 67.8 MB
💾 备份创建于: /Users/user/kiro-cleaner-backups/backup_20241201_143022.zip
```

## 6. 配置管理

### 6.1 配置文件结构
```json
{
    "version": "1.0.0",
    "kiro_paths": {
        "auto_detect": true,
        "custom_paths": []
    },
    "cleanup_rules": [
        // 清理规则配置
    ],
    "backup_config": {
        "enabled": true,
        "path": "~/.kiro-cleaner/backups",
        "max_backups": 5,
        "compressed": true
    },
    "safety_checks": {
        "min_disk_space": "100MB",
        "verify_database": true,
        "require_confirmation": true
    },
    "ui": {
        "show_progress": true,
        "detailed_output": false,
        "color_output": true
    }
}
```

## 7. 错误处理

### 7.1 错误类型
```go
type CleanupError struct {
    Code        string    `json:"code"`         // 错误代码
    Message     string    `json:"message"`      // 错误信息
    FilePath    string    `json:"file_path"`    // 相关文件路径
    Timestamp   time.Time `json:"timestamp"`    // 错误时间
    Recoverable bool      `json:"recoverable"`  // 是否可恢复
}
```

### 7.2 错误处理策略
- 跳过损坏文件但记录日志
- 权限不足时请求用户授权
- 磁盘空间不足时暂停清理
- 数据库锁定时等待或跳过

这个设计为后续的golang实现提供了详细的技术规格和用户交互指导。