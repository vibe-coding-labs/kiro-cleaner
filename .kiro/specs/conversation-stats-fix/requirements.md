# Requirements Document

## Introduction

修复 Kiro 清理工具中对话数据统计功能的 bug。当前工具假设对话数据存储在 SQLite 数据库中，但实际上 Kiro 使用 JSON 格式的 `.chat` 文件存储对话数据。需要重新实现对话数据的扫描和统计功能。

## Glossary

- **Chat_File**: Kiro 存储对话数据的 JSON 文件，扩展名为 `.chat`
- **Workspace_Folder**: Kiro 为每个工作区创建的文件夹，使用哈希值命名
- **Kiro_Agent_Storage**: Kiro 代理存储目录，位于 `~/Library/Application Support/Kiro/User/globalStorage/kiro.kiroagent/`
- **Scanner**: 负责扫描和统计 Kiro 数据的组件
- **Conversation_Stats**: 对话统计信息，包括对话数量、消息数量等

## Requirements

### Requirement 1: 正确识别 Kiro 对话存储路径

**User Story:** As a user, I want the tool to correctly locate Kiro conversation data, so that I can see accurate statistics about my conversations.

#### Acceptance Criteria

1. THE Scanner SHALL detect the Kiro agent storage path at `~/Library/Application Support/Kiro/User/globalStorage/kiro.kiroagent/` on macOS
2. THE Scanner SHALL detect the Kiro agent storage path at `%APPDATA%/Kiro/User/globalStorage/kiro.kiroagent/` on Windows
3. THE Scanner SHALL detect the Kiro agent storage path at `~/.config/Kiro/User/globalStorage/kiro.kiroagent/` on Linux
4. WHEN the Kiro agent storage path does not exist, THE Scanner SHALL report that no Kiro data was found

### Requirement 2: 扫描 Chat 文件

**User Story:** As a user, I want the tool to scan all .chat files, so that I can understand my conversation data usage.

#### Acceptance Criteria

1. THE Scanner SHALL recursively scan all workspace folders within the Kiro agent storage directory
2. THE Scanner SHALL identify all files with `.chat` extension as conversation files
3. WHEN scanning a workspace folder, THE Scanner SHALL count the number of chat files
4. THE Scanner SHALL calculate the total size of all chat files

### Requirement 3: 解析 Chat 文件内容

**User Story:** As a user, I want the tool to parse chat file contents, so that I can see detailed statistics about messages.

#### Acceptance Criteria

1. WHEN parsing a chat file, THE Chat_Parser SHALL read the JSON content
2. WHEN parsing a chat file, THE Chat_Parser SHALL extract the message array
3. WHEN parsing a chat file, THE Chat_Parser SHALL count user messages and assistant messages separately
4. IF a chat file contains invalid JSON, THEN THE Chat_Parser SHALL skip the file and log a warning
5. THE Chat_Parser SHALL extract conversation metadata including model information and timestamps

### Requirement 4: 生成对话统计报告

**User Story:** As a user, I want to see comprehensive conversation statistics, so that I can make informed decisions about cleanup.

#### Acceptance Criteria

1. THE Conversation_Stats SHALL include total number of conversations (chat files)
2. THE Conversation_Stats SHALL include total number of messages across all conversations
3. THE Conversation_Stats SHALL include total storage size of all chat files
4. THE Conversation_Stats SHALL include breakdown by workspace folder
5. THE Conversation_Stats SHALL include average messages per conversation
6. WHEN displaying statistics, THE Scanner SHALL format file sizes in human-readable format (KB, MB, GB)

### Requirement 5: 识别可清理的对话

**User Story:** As a user, I want to identify old or large conversations, so that I can free up storage space.

#### Acceptance Criteria

1. THE Scanner SHALL identify conversations older than a configurable threshold (default 30 days)
2. THE Scanner SHALL identify conversations larger than a configurable threshold (default 1MB)
3. THE Scanner SHALL calculate potential space savings from cleaning old conversations
4. WHEN reporting cleanable conversations, THE Scanner SHALL show the file path and size
