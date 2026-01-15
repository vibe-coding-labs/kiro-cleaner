# Requirements Document

## Introduction

为 kiro-cleaner 的 scan 命令创建全面的测试覆盖，确保扫描功能在各种场景下都能正确工作。scan 命令负责扫描 Kiro IDE 的存储目录，统计各类文件的大小和数量，并展示可清理的内容。

## Glossary

- **Scan_Command**: kiro-cleaner 的 scan 子命令，用于扫描存储使用情况
- **FileScanner**: 负责扫描文件系统中 Kiro 存储目录的组件
- **ChatScanner**: 负责扫描 .chat 对话文件的组件
- **ProgressDisplay**: 负责展示扫描进度的 UI 组件
- **StorageStats**: 存储统计信息，包括各类文件的大小和数量
- **ConversationStats**: 对话统计信息，包括对话数量、消息数量等

## Requirements

### Requirement 1: 路径检测

**User Story:** As a user, I want the scan command to correctly detect Kiro storage paths on different operating systems, so that I can see accurate storage statistics.

#### Acceptance Criteria

1. THE FileScanner SHALL detect Kiro storage paths on macOS at `~/Library/Application Support/Kiro/` and `~/Library/Application Support/kiro/`
2. THE FileScanner SHALL detect Kiro storage paths on Windows at `%APPDATA%/Kiro/` and `%APPDATA%/kiro/`
3. THE FileScanner SHALL detect Kiro storage paths on Linux at `~/.config/Kiro/` and `~/.config/kiro/`
4. WHEN no Kiro storage path exists, THE FileScanner SHALL return an empty file list without error
5. WHEN multiple Kiro storage paths exist, THE FileScanner SHALL scan all of them

### Requirement 2: 文件类型识别

**User Story:** As a user, I want the scan command to correctly identify different file types, so that I can understand what types of data are using storage.

#### Acceptance Criteria

1. THE FileScanner SHALL identify files with `.db`, `.sqlite`, `.sqlite3`, `.vscdb` extensions as database files
2. THE FileScanner SHALL identify files with `.chat` extension as conversation files
3. THE FileScanner SHALL identify files with `.log` extension or in `/logs/` directory as log files
4. THE FileScanner SHALL identify files with `.tmp`, `.temp` extensions or in `crashpad` directory as temp files
5. THE FileScanner SHALL identify files in `cache`, `cacheddata`, `gpucache` directories as cache files
6. THE FileScanner SHALL identify files in `/index/` or `lancedb` directories as index files
7. THE FileScanner SHALL identify files in `history` directories as backup/history files
8. THE FileScanner SHALL identify `config.json`, `settings.json`, `mcp.json` as config files

### Requirement 3: 大小统计

**User Story:** As a user, I want the scan command to accurately calculate storage sizes, so that I can make informed decisions about cleanup.

#### Acceptance Criteria

1. THE FileScanner SHALL calculate the total size of all scanned files
2. THE FileScanner SHALL calculate the size breakdown by file type (log, cache, temp, index, etc.)
3. THE FileScanner SHALL format file sizes in human-readable format (B, KB, MB, GB)
4. WHEN a file cannot be accessed, THE FileScanner SHALL skip it and continue scanning
5. THE StorageStats SHALL include accurate counts of files by type

### Requirement 4: 对话扫描

**User Story:** As a user, I want the scan command to scan and count my chat conversations, so that I can see how much space conversations are using.

#### Acceptance Criteria

1. THE ChatScanner SHALL find the Kiro agent storage path at `~/Library/Application Support/Kiro/User/globalStorage/kiro.kiroagent/`
2. THE ChatScanner SHALL recursively scan all workspace folders for `.chat` files
3. THE ChatScanner SHALL count the total number of conversations
4. THE ChatScanner SHALL calculate the total size of all conversation files
5. WHEN parsing a chat file fails, THE ChatScanner SHALL skip it and continue

### Requirement 5: 进度展示

**User Story:** As a user, I want to see real-time progress while scanning, so that I know the scan is working.

#### Acceptance Criteria

1. THE ProgressDisplay SHALL show the current path being scanned
2. THE ProgressDisplay SHALL show the number of files scanned
3. THE ProgressDisplay SHALL show the total size scanned so far
4. THE ProgressDisplay SHALL update at most every 100ms to avoid flickering
5. WHEN scanning is complete, THE ProgressDisplay SHALL stop and show final results

### Requirement 6: 结果展示

**User Story:** As a user, I want to see a clear summary of storage usage after scanning, so that I can understand what can be cleaned.

#### Acceptance Criteria

1. THE Scan_Command SHALL display a "Storage Overview" section with all file types
2. THE Scan_Command SHALL display a "Cleanable Items" section with items that can be deleted
3. THE Scan_Command SHALL display the total cleanable size
4. THE Scan_Command SHALL display helpful tips for cleaning
5. WHEN nothing is cleanable, THE Scan_Command SHALL display "Nothing to clean" message

### Requirement 7: 错误处理

**User Story:** As a user, I want the scan command to handle errors gracefully, so that it doesn't crash on unexpected situations.

#### Acceptance Criteria

1. WHEN a directory cannot be accessed due to permissions, THE FileScanner SHALL skip it and continue
2. WHEN a file is locked by another process, THE FileScanner SHALL skip it and continue
3. WHEN the Kiro storage path does not exist, THE Scan_Command SHALL complete without error
4. WHEN an invalid JSON file is encountered, THE ChatScanner SHALL skip it and continue
5. THE Scan_Command SHALL always display results even if some files could not be scanned

### Requirement 8: 边界情况

**User Story:** As a user, I want the scan command to handle edge cases correctly, so that it works reliably in all situations.

#### Acceptance Criteria

1. WHEN scanning an empty directory, THE FileScanner SHALL return zero counts and sizes
2. WHEN scanning a directory with only subdirectories, THE FileScanner SHALL report zero file size
3. WHEN a file has zero size, THE FileScanner SHALL count it but report 0 bytes
4. WHEN a file path contains special characters, THE FileScanner SHALL handle it correctly
5. WHEN a symbolic link is encountered, THE FileScanner SHALL follow it or skip it gracefully
