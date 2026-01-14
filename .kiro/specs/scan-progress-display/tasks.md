# Implementation Plan: Scan Progress Display

## Overview

实现扫描进度实时展示功能，包括数据结构定义、Scanner 回调机制、UI 进度展示组件。

## Tasks

- [x] 1. 定义 ScanProgress 数据结构
  - 在 `pkg/types/types.go` 中添加 ScanProgress 结构体
  - 添加 ProgressCallback 类型定义
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. 实现 FileScanner 回调机制
  - [x] 2.1 添加 ScanWithProgress 方法到 FileScanner
    - 修改 `internal/scanner/file_scanner.go`
    - 在遍历文件时调用回调函数
    - 保持原有 Scan() 方法不变（向后兼容）
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 2.2 编写 FileScanner 回调测试
    - 测试回调被正确调用
    - 测试无回调时正常工作
    - _Requirements: 3.2, 3.3_

- [x] 3. 实现 ChatScanner 回调机制
  - [x] 3.1 添加 ScanWorkspacesWithProgress 方法到 ChatScanner
    - 修改 `internal/scanner/chat_scanner.go`
    - 在扫描对话时调用回调函数
    - _Requirements: 3.1, 3.2_

- [x] 4. 实现 ProgressDisplay UI 组件
  - [x] 4.1 创建 ProgressDisplay 结构体
    - 在 `internal/ui/progress.go` 中实现
    - 使用 pterm AreaPrinter 实现多行刷新
    - 实现 Start/Update/Stop 方法
    - _Requirements: 2.1, 2.2, 5.1_
  
  - [x] 4.2 实现更新频率限制
    - 添加 lastUpdate 时间戳
    - 限制最小更新间隔为 100ms
    - _Requirements: 4.1_
  
  - [x] 4.3 实现路径截断显示
    - 长路径截断为 50 字符
    - 保留路径末尾部分
    - _Requirements: 1.1_

- [x] 5. 集成到 scan 命令
  - [x] 5.1 修改 runScan 函数使用新的进度展示
    - 修改 `cmd/kiro-cleaner/commands.go`
    - 创建 ProgressDisplay 并传递回调
    - 扫描完成后平滑过渡到结果展示
    - _Requirements: 2.3_

- [x] 6. Checkpoint - 验证功能
  - 运行 `go build ./cmd/kiro-cleaner/`
  - 运行 `./kiro-cleaner scan` 验证进度展示
  - 确保向后兼容性

- [x] 7. 编写属性测试
  - [x] 7.1 Property 1: 进度单调递增测试
    - **Property 1: Progress Monotonically Increases**
    - **Validates: Requirements 1.2, 1.3**
  
  - [x] 7.2 Property 4: 更新频率限制测试
    - **Property 4: Throttle Rate Limiting**
    - **Validates: Requirements 4.1**

## Notes

- 所有任务都是必需的
- 使用 Go 语言实现
- 依赖 pterm 库进行终端 UI 渲染
- 保持向后兼容，原有 Scan() 方法不变
