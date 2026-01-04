# Kiro对话数据存储结构分析

## 概述
基于AI聊天应用的通用存储模式，本文档分析kiro可能使用的数据存储方式和需要清理的冗余数据类型。

## 1. 常见AI聊天应用存储模式

### 1.1 数据库存储
- **SQLite数据库**: 存储对话记录、用户配置、会话信息
- **表结构**: conversations, messages, users, settings等
- **文件扩展名**: .db, .sqlite, .sqlite3

### 1.2 配置文件
- **JSON格式**: 用户设置、API配置、界面偏好
- **XML格式**: 某些应用可能使用
- **文件位置**: 用户配置目录

### 1.3 缓存数据
- **模型缓存**: AI模型相关文件
- **响应缓存**: 预生成的回复缓存
- **图像缓存**: 聊天下载的图片和文件
- **位置**: 缓存目录、临时目录

### 1.4 日志文件
- **应用日志**: 运行时日志
- **错误日志**: 异常和错误记录
- **访问日志**: API调用记录

## 2. Kiro可能的存储位置

### 2.1 macOS
```
~/Library/Application Support/Kiro/
├── conversations.db          # 对话数据库
├── config.json              # 配置文件  
├── cache/                   # 缓存目录
│   ├── models/             # 模型缓存
│   ├── responses/          # 响应缓存
│   └── images/             # 图片缓存
├── logs/                   # 日志目录
└── temp/                   # 临时文件
```

### 2.2 Windows
```
%APPDATA%\Kiro\
├── conversations.db
├── config.json
├── cache\
├── logs\
└── temp\
```

### 2.3 Linux
```
~/.config/kiro/
├── conversations.db
├── config.json
├── cache/
├── logs/
└── temp/
```

## 3. 数据库结构推测

### 3.1 对话表 (conversations)
```sql
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    title TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    user_id INTEGER,
    metadata TEXT
);
```

### 3.2 消息表 (messages)
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER,
    role TEXT,           -- 'user' or 'assistant'
    content TEXT,
    timestamp DATETIME,
    tokens INTEGER,
    FOREIGN KEY (conversation_id) REFERENCES conversations (id)
);
```

### 3.3 用户设置表 (settings)
```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME
);
```

## 4. 冗余数据类型

### 4.1 对话相关
- 过期对话记录
- 测试对话
- 重复对话
- 异常对话（包含错误）

### 4.2 缓存数据
- 过期的模型缓存
- 失效的响应缓存
- 损坏的图片缓存
- 临时下载文件

### 4.3 日志和临时文件
- 旧日志文件
- 崩溃转储文件
- 临时会话文件
- 备份文件

### 4.4 配置数据
- 过时的配置项
- 无效的API密钥记录
- 测试配置

## 5. 清理策略

### 5.1 安全清理
- 备份重要数据
- 分阶段清理
- 提供回滚功能
- 用户确认机制

### 5.2 清理规则
- 对话保留最近N条或最近M天
- 缓存定期清理
- 日志文件保留最近K天
- 临时文件立即清理

### 5.3 清理优先级
1. **安全**: 临时文件和日志
2. **重要**: 当前对话和设置
3. **可选**: 历史对话和缓存

## 6. 技术实现考虑

### 6.1 文件扫描
- 递归扫描存储目录
- 文件类型识别
- 大小和修改时间检查

### 6.2 数据库操作
- SQLite连接和查询
- 数据完整性检查
- 事务处理

### 6.3 备份机制
- 自动备份重要数据
- 增量备份
- 压缩存储

### 6.4 进度跟踪
- 清理进度显示
- 详细日志记录
- 错误处理

## 7. 工具功能设计

### 7.1 扫描功能
- 识别kiro数据文件
- 分析存储空间使用
- 统计各类数据量

### 7.2 清理功能
- 智能清理策略
- 用户自定义规则
- 批量操作支持

### 7.3 备份功能
- 自动备份
- 手动备份
- 恢复功能

### 7.4 报告功能
- 清理前后对比
- 空间节省统计
- 详细操作日志

## 结论

基于AI聊天应用的通用模式，kiro很可能使用类似的存储结构。本工具将设计为通用的kiro数据清理解决方案，支持多种操作系统和存储格式，确保数据安全和清理效果。