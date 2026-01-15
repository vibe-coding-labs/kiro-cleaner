# Design Document: Scan Command Tests

## Overview

本设计文档定义了 kiro-cleaner scan 命令的全面测试策略，包括单元测试和属性测试，确保扫描功能在各种场景下都能正确工作。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Scan Command                            │
│                    (commands.go)                             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   FileScanner   │ │   ChatScanner   │ │ ProgressDisplay │
│ (file_scanner)  │ │ (chat_scanner)  │ │   (progress)    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
              │               │
              ▼               ▼
┌─────────────────┐ ┌─────────────────┐
│ StorageDetector │ │   ChatParser    │
│   (detector)    │ │ (chat_parser)   │
└─────────────────┘ └─────────────────┘
```

## Components and Interfaces

### FileScanner Tests

```go
// 测试路径检测
func TestPathDetection(t *testing.T)
func TestPathDetection_NoPathExists(t *testing.T)
func TestPathDetection_MultiplePaths(t *testing.T)

// 测试文件类型识别
func TestFileTypeDetection(t *testing.T)
func TestFileTypeDetection_Database(t *testing.T)
func TestFileTypeDetection_Log(t *testing.T)
func TestFileTypeDetection_Cache(t *testing.T)
func TestFileTypeDetection_Temp(t *testing.T)
func TestFileTypeDetection_Index(t *testing.T)
func TestFileTypeDetection_Config(t *testing.T)

// 测试大小统计
func TestSizeAggregation(t *testing.T)
func TestSizeBreakdown(t *testing.T)
func TestFormatSize(t *testing.T)
```

### ChatScanner Tests

```go
// 测试对话扫描
func TestChatScanning(t *testing.T)
func TestChatScanning_EmptyDirectory(t *testing.T)
func TestChatScanning_InvalidJSON(t *testing.T)
func TestChatScanning_MessageCount(t *testing.T)
```

### ProgressDisplay Tests

```go
// 测试进度展示
func TestProgressDisplay_Update(t *testing.T)
func TestProgressDisplay_Throttle(t *testing.T)
func TestProgressDisplay_Complete(t *testing.T)
```

## Data Models

### Test Fixtures

```go
// TestFile 测试文件结构
type TestFile struct {
    Path     string
    Content  []byte
    Size     int64
    Type     types.FileType
}

// TestDirectory 测试目录结构
type TestDirectory struct {
    Path  string
    Files []TestFile
    Dirs  []TestDirectory
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Path Detection Correctness

*For any* operating system type (macOS, Windows, Linux), the PathFinder SHALL return paths that match the expected pattern for that OS, and all returned paths SHALL be absolute paths.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: File Type Detection Accuracy

*For any* file with a known extension or path pattern, the StorageDetector SHALL correctly identify its type:
- Files with `.db`, `.sqlite`, `.sqlite3`, `.vscdb` → TypeDatabase
- Files with `.chat` → TypeDatabase (conversation)
- Files with `.log` or in `/logs/` → TypeLog
- Files with `.tmp`, `.temp` or in `crashpad` → TypeTemp
- Files in `cache`, `cacheddata`, `gpucache` → TypeCache
- Files in `/index/` or `lancedb` → TypeIndex
- Files in `history` → TypeBackup
- Files named `config.json`, `settings.json`, `mcp.json` → TypeConfig

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

### Property 3: Size Aggregation Accuracy

*For any* set of files with individual sizes S1, S2, ..., Sn:
- The TotalSize SHALL equal S1 + S2 + ... + Sn
- The sum of all type-specific sizes SHALL equal TotalSize
- The file count by type SHALL match the actual number of files of each type

**Validates: Requirements 3.1, 3.2, 3.5**

### Property 4: Size Formatting Correctness

*For any* byte value B:
- B < 1024 → formatted as "X B"
- 1024 ≤ B < 1024² → formatted as "X.XX KB"
- 1024² ≤ B < 1024³ → formatted as "X.XX MB"
- B ≥ 1024³ → formatted as "X.XX GB"

**Validates: Requirements 3.3**

### Property 5: Chat File Scanning Completeness

*For any* directory structure containing .chat files, the ChatScanner SHALL:
- Find exactly all files with `.chat` extension
- Count them correctly (TotalConversations = number of .chat files)
- Calculate correct total size (sum of all .chat file sizes)

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 6: Progress Monotonicity

*For any* sequence of progress updates during a scan:
- ScannedFiles SHALL monotonically increase
- TotalSize SHALL monotonically increase
- ScannedDirs SHALL monotonically increase

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 7: Progress Throttle Rate

*For any* two consecutive progress updates, the time between them SHALL be at least 100ms (unless IsComplete is true).

**Validates: Requirements 5.4**

### Property 8: Empty Directory Handling

*For any* empty directory or directory with only subdirectories:
- ScannedFiles SHALL be 0
- TotalSize SHALL be 0
- No error SHALL be returned

**Validates: Requirements 8.1, 8.2**

### Property 9: Zero-Size File Handling

*For any* file with size 0:
- It SHALL be counted in ScannedFiles
- It SHALL contribute 0 to TotalSize
- It SHALL be correctly typed

**Validates: Requirements 8.3**

### Property 10: Special Character Path Handling

*For any* file path containing special characters (spaces, unicode, etc.):
- The file SHALL be scanned without error
- The path SHALL be correctly reported in results

**Validates: Requirements 8.4**

### Property 11: Graceful Error Handling

*For any* scan operation:
- Permission errors SHALL be skipped without crashing
- Invalid JSON files SHALL be skipped without crashing
- Missing paths SHALL result in empty results, not errors
- Partial results SHALL always be returned

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

## Error Handling

1. **权限错误**: 跳过无法访问的文件/目录，继续扫描
2. **文件锁定**: 跳过被锁定的文件，继续扫描
3. **无效 JSON**: 跳过无法解析的 .chat 文件，继续扫描
4. **路径不存在**: 返回空结果，不报错
5. **符号链接**: 尝试跟随，失败则跳过

## Testing Strategy

### Unit Tests

单元测试覆盖具体的边界情况和错误场景：

- 测试空目录扫描
- 测试权限错误处理
- 测试无效 JSON 处理
- 测试符号链接处理
- 测试特殊字符路径
- 测试零大小文件

### Property-Based Tests

使用 Go 的 `testing/quick` 包进行属性测试：

- **Property 1-2**: 生成随机文件名和路径，验证类型检测正确
- **Property 3-4**: 生成随机大小值，验证聚合和格式化正确
- **Property 5**: 生成随机目录结构，验证扫描完整性
- **Property 6-7**: 生成随机进度序列，验证单调性和节流
- **Property 8-10**: 生成边界情况，验证正确处理

每个属性测试应运行至少 100 次迭代。

### Integration Tests

集成测试验证完整的 scan 命令流程：

- 测试完整扫描流程
- 测试输出格式正确性
- 测试进度展示
- 测试结果汇总
