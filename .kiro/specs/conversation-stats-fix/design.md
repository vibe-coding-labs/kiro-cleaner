# Design Document: Conversation Stats Fix

## Overview

本设计修复 Kiro 清理工具中对话数据统计功能的 bug。核心问题是当前代码假设 Kiro 使用 SQLite 数据库存储对话，但实际上 Kiro 使用 JSON 格式的 `.chat` 文件存储对话数据。

### Kiro 数据存储结构

```
~/Library/Application Support/Kiro/User/globalStorage/kiro.kiroagent/
├── <workspace-hash-1>/
│   ├── <conversation-id-1>.chat
│   ├── <conversation-id-2>.chat
│   └── ...
├── <workspace-hash-2>/
│   └── ...
└── ...
```

### Chat 文件结构

```json
{
  "executionId": "string",
  "actionId": "string", 
  "context": {...},
  "validations": [...],
  "chat": [
    {"role": "human", "content": "..."},
    {"role": "bot", "content": "..."},
    {"role": "tool", "content": "..."}
  ],
  "metadata": {
    "modelId": "claude-opus-4.5",
    "modelProvider": "qdev",
    "workflow": "act",
    "workflowId": "...",
    "startTime": 1767443638856,
    "endTime": 1767443643497
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Commands                            │
│                  (status, scan, analyze)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChatScanner                               │
│  - FindKiroAgentPath()                                       │
│  - ScanWorkspaces()                                          │
│  - GetConversationStats()                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChatParser                                │
│  - ParseChatFile()                                           │
│  - ExtractMetadata()                                         │
│  - CountMessages()                                           │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### ChatScanner

```go
package scanner

// ChatScanner 扫描 Kiro 对话文件
type ChatScanner struct {
    basePath string
}

// NewChatScanner 创建新的对话扫描器
func NewChatScanner() *ChatScanner

// FindKiroAgentPath 查找 Kiro 代理存储路径
func (cs *ChatScanner) FindKiroAgentPath() (string, error)

// ScanWorkspaces 扫描所有工作区
func (cs *ChatScanner) ScanWorkspaces() ([]WorkspaceStats, error)

// GetConversationStats 获取对话统计
func (cs *ChatScanner) GetConversationStats() (*ConversationStats, error)

// FindCleanableConversations 查找可清理的对话
func (cs *ChatScanner) FindCleanableConversations(ageDays int, sizeBytes int64) ([]CleanableConversation, error)
```

### ChatParser

```go
package scanner

// ChatParser 解析 .chat 文件
type ChatParser struct{}

// NewChatParser 创建新的解析器
func NewChatParser() *ChatParser

// ParseChatFile 解析单个 chat 文件
func (cp *ChatParser) ParseChatFile(path string) (*ChatFileInfo, error)

// ChatFileInfo chat 文件信息
type ChatFileInfo struct {
    Path           string
    Size           int64
    ModTime        time.Time
    MessageCount   int
    HumanMessages  int
    BotMessages    int
    ToolMessages   int
    Metadata       ChatMetadata
}

// ChatMetadata chat 元数据
type ChatMetadata struct {
    ModelID       string
    ModelProvider string
    Workflow      string
    StartTime     time.Time
    EndTime       time.Time
}
```

### Data Types

```go
package types

// WorkspaceStats 工作区统计
type WorkspaceStats struct {
    WorkspaceID      string
    Path             string
    ConversationCount int
    TotalMessages    int
    TotalSize        int64
    LastActivity     time.Time
}

// ConversationStats 对话统计汇总
type ConversationStats struct {
    TotalConversations int
    TotalMessages      int
    TotalSize          int64
    HumanMessages      int
    BotMessages        int
    ToolMessages       int
    AvgMessagesPerConv float64
    WorkspaceBreakdown []WorkspaceStats
    LastActivity       time.Time
}

// CleanableConversation 可清理的对话
type CleanableConversation struct {
    Path      string
    Size      int64
    ModTime   time.Time
    Reason    string  // "old" or "large"
}
```

## Data Models

### Chat File JSON Schema

```json
{
  "type": "object",
  "properties": {
    "executionId": {"type": "string"},
    "actionId": {"type": "string"},
    "chat": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {"type": "string", "enum": ["human", "bot", "tool"]},
          "content": {"type": "string"}
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "modelId": {"type": "string"},
        "modelProvider": {"type": "string"},
        "workflow": {"type": "string"},
        "startTime": {"type": "integer"},
        "endTime": {"type": "integer"}
      }
    }
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Chat File Identification

*For any* directory containing files, the Scanner SHALL identify exactly those files with `.chat` extension as conversation files, and no others.

**Validates: Requirements 2.2**

### Property 2: Message Count Accuracy

*For any* valid chat file with a chat array of length N, the parsed MessageCount SHALL equal N, and the sum of HumanMessages, BotMessages, and ToolMessages SHALL equal N.

**Validates: Requirements 3.2, 3.3**

### Property 3: Size Aggregation

*For any* set of chat files with individual sizes S1, S2, ..., Sn, the TotalSize in ConversationStats SHALL equal S1 + S2 + ... + Sn.

**Validates: Requirements 2.4, 4.3**

### Property 4: Conversation Count Accuracy

*For any* set of workspace folders containing chat files, the TotalConversations SHALL equal the total number of `.chat` files across all workspaces.

**Validates: Requirements 2.3, 4.1**

### Property 5: Average Calculation

*For any* ConversationStats with TotalConversations > 0, AvgMessagesPerConv SHALL equal TotalMessages / TotalConversations.

**Validates: Requirements 4.5**

### Property 6: Cleanable Conversation Identification

*For any* set of conversations, those identified as cleanable due to age SHALL have ModTime older than the threshold, and those identified as cleanable due to size SHALL have Size greater than the threshold.

**Validates: Requirements 5.1, 5.2**

### Property 7: Space Savings Calculation

*For any* set of cleanable conversations with sizes S1, S2, ..., Sn, the potential space savings SHALL equal S1 + S2 + ... + Sn.

**Validates: Requirements 5.3**

## Error Handling

1. **路径不存在**: 当 Kiro 代理存储路径不存在时，返回明确的错误信息
2. **无效 JSON**: 当 chat 文件包含无效 JSON 时，跳过该文件并记录警告
3. **权限问题**: 当无法读取文件时，跳过并记录警告
4. **空目录**: 当没有找到任何 chat 文件时，返回零值统计而非错误

## Testing Strategy

### Unit Tests

- 测试路径检测在不同操作系统上的行为
- 测试 JSON 解析的边界情况（空文件、无效 JSON、缺少字段）
- 测试文件大小格式化函数

### Property-Based Tests

使用 Go 的 `testing/quick` 包或 `gopter` 库进行属性测试：

- **Property 1**: 生成随机文件名列表，验证只有 `.chat` 文件被识别
- **Property 2**: 生成随机 chat 数组，验证消息计数正确
- **Property 3-4**: 生成随机文件大小列表，验证聚合计算正确
- **Property 5**: 生成随机统计数据，验证平均值计算正确
- **Property 6-7**: 生成随机对话列表，验证清理识别和空间计算正确

每个属性测试应运行至少 100 次迭代。
