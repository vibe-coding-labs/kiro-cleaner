# Design Document: Scan Progress Display

## Overview

为 kiro-cleaner 添加扫描进度实时展示功能。通过回调机制将扫描进度传递给 UI 层，UI 层使用 pterm 的多行更新能力实现实时刷新的进度展示。

## Architecture

```
┌─────────────────┐     callback      ┌──────────────────┐
│   FileScanner   │ ───────────────▶  │  ProgressDisplay │
│   ChatScanner   │                   │    (Terminal)    │
└─────────────────┘                   └──────────────────┘
        │                                      │
        │ ScanProgress                         │ pterm Area
        ▼                                      ▼
┌─────────────────┐                   ┌──────────────────┐
│  ScanProgress   │                   │  Real-time UI    │
│  (统计数据)      │                   │  (多行刷新)       │
└─────────────────┘                   └──────────────────┘
```

## Components and Interfaces

### 1. ScanProgress 数据结构

```go
// ScanProgress 扫描进度信息
type ScanProgress struct {
    CurrentPath     string            // 当前扫描路径
    ScannedFiles    int               // 已扫描文件数
    ScannedDirs     int               // 已扫描目录数
    TotalSize       int64             // 已发现总大小
    TypeCounts      map[string]int    // 各类型文件数量
    TypeSizes       map[string]int64  // 各类型文件大小
    Phase           string            // 扫描阶段: "files", "chats"
    IsComplete      bool              // 是否完成
}

// ProgressCallback 进度回调函数类型
type ProgressCallback func(progress ScanProgress)
```

### 2. Scanner 接口扩展

```go
// FileScanner 扩展方法
func (fs *FileScanner) ScanWithProgress(callback ProgressCallback) ([]types.FileInfo, error)

// ChatScanner 扩展方法  
func (cs *ChatScanner) ScanWorkspacesWithProgress(callback ProgressCallback) ([]types.WorkspaceStats, error)
```

### 3. ProgressDisplay UI 组件

```go
// ProgressDisplay 进度展示组件
type ProgressDisplay struct {
    area        *pterm.AreaPrinter  // pterm 区域打印器
    lastUpdate  time.Time           // 上次更新时间
    minInterval time.Duration       // 最小更新间隔
}

// NewProgressDisplay 创建进度展示
func NewProgressDisplay() *ProgressDisplay

// Start 开始展示
func (pd *ProgressDisplay) Start()

// Update 更新进度
func (pd *ProgressDisplay) Update(progress ScanProgress)

// Stop 停止展示
func (pd *ProgressDisplay) Stop()
```

## Data Models

### ScanProgress

| Field | Type | Description |
|-------|------|-------------|
| CurrentPath | string | 当前正在扫描的路径（截断显示） |
| ScannedFiles | int | 已扫描的文件总数 |
| ScannedDirs | int | 已扫描的目录总数 |
| TotalSize | int64 | 已发现的总字节数 |
| TypeCounts | map[string]int | 按类型统计的文件数量 |
| TypeSizes | map[string]int64 | 按类型统计的文件大小 |
| Phase | string | 当前扫描阶段 |
| IsComplete | bool | 扫描是否完成 |

### 进度展示格式

```
Scanning Kiro storage...

  📁 Scanning: ~/.../kiro/User/globalStorage/...
  
  Files: 1,234    Size: 156.7 MB
  
  ● Logs      45 files    12.3 MB
  ● Cache    892 files   102.4 MB
  ● Temp      12 files     1.2 MB
  ● Index     85 files    28.5 MB
  ● Chats    200 convs    12.3 MB
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Progress Monotonically Increases

*For any* sequence of ScanProgress updates during a scan, the ScannedFiles count and TotalSize SHALL be monotonically non-decreasing (each update >= previous update).

**Validates: Requirements 1.2, 1.3**

### Property 2: Type Counts Consistency

*For any* ScanProgress update, the sum of all values in TypeCounts SHALL equal ScannedFiles (excluding directories).

**Validates: Requirements 1.4, 2.1**

### Property 3: Callback Invocation

*For any* file scanned when a callback is provided, the Scanner SHALL invoke the callback with a ScanProgress containing that file's contribution to the statistics.

**Validates: Requirements 3.2**

### Property 4: Throttle Rate Limiting

*For any* sequence of Update calls to ProgressDisplay within the minInterval period, only the first call SHALL trigger a terminal write.

**Validates: Requirements 4.1**

### Property 5: Backward Compatibility

*For any* Scanner invocation without a callback, the Scanner SHALL return the same results as the original Scan() method.

**Validates: Requirements 3.3**

## Error Handling

1. **回调异常**: 回调函数中的 panic 不应影响扫描继续
2. **终端不支持**: 检测终端能力，降级到简单输出
3. **路径过长**: 截断显示当前扫描路径

## Testing Strategy

### Unit Tests
- 测试 ScanProgress 数据结构的正确性
- 测试路径截断逻辑
- 测试更新频率限制

### Integration Tests
- 测试 Scanner 与 ProgressDisplay 的集成
- 测试向后兼容性（无回调时正常工作）
