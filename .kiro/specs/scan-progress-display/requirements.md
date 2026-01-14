# Requirements Document

## Introduction

为 kiro-cleaner 的 scan 命令添加实时进度展示功能，让用户在扫描过程中能够看到扫描进度和实时发现的文件统计信息，提升用户体验。

## Glossary

- **Scanner**: 文件扫描器，负责遍历 Kiro 存储目录并收集文件信息
- **Progress_Display**: 进度展示组件，负责在终端实时更新扫描状态
- **File_Stats**: 文件统计信息，包括各类型文件的数量和大小
- **Scan_Callback**: 扫描回调函数，用于在扫描过程中报告进度

## Requirements

### Requirement 1: 实时进度更新

**User Story:** As a user, I want to see real-time scanning progress, so that I know the scan is working and how much has been scanned.

#### Acceptance Criteria

1. WHEN the scan starts, THE Progress_Display SHALL show the current directory being scanned
2. WHILE scanning is in progress, THE Progress_Display SHALL update the scanned file count in real-time
3. WHILE scanning is in progress, THE Progress_Display SHALL update the total size discovered in real-time
4. WHEN a new file type is discovered, THE Progress_Display SHALL update the type breakdown immediately

### Requirement 2: 分类统计实时展示

**User Story:** As a user, I want to see file type breakdown during scanning, so that I can understand what types of files are being found.

#### Acceptance Criteria

1. WHILE scanning is in progress, THE Progress_Display SHALL show counts for each file type (logs, cache, temp, index, chats)
2. WHILE scanning is in progress, THE Progress_Display SHALL show sizes for each file type
3. WHEN the scan completes, THE Progress_Display SHALL transition smoothly to the final results display

### Requirement 3: 扫描回调机制

**User Story:** As a developer, I want a callback mechanism in the scanner, so that progress can be reported without tight coupling.

#### Acceptance Criteria

1. THE Scanner SHALL accept an optional progress callback function
2. WHEN a file is scanned, THE Scanner SHALL invoke the callback with updated statistics
3. IF no callback is provided, THEN THE Scanner SHALL operate silently as before (backward compatible)

### Requirement 4: 性能考虑

**User Story:** As a user, I want the progress display to not significantly slow down scanning, so that the tool remains fast.

#### Acceptance Criteria

1. THE Progress_Display SHALL throttle updates to avoid excessive terminal writes (max 10 updates per second)
2. THE Scanner SHALL not block on callback execution
3. WHEN scanning large directories, THE Scanner SHALL maintain reasonable performance

### Requirement 5: 终端兼容性

**User Story:** As a user, I want the progress display to work correctly in my terminal, so that I can see the updates properly.

#### Acceptance Criteria

1. THE Progress_Display SHALL use terminal-safe update mechanisms (carriage return or ANSI codes)
2. WHEN the terminal does not support ANSI codes, THE Progress_Display SHALL fall back to simple line output
3. THE Progress_Display SHALL clear progress lines before printing final results
