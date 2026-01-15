# Implementation Plan: Scan Command Tests

## Overview

为 kiro-cleaner 的 scan 命令实现全面的测试覆盖，包括单元测试和属性测试。

## Tasks

- [x] 1. 创建测试基础设施
  - [x] 1.1 创建测试辅助函数文件 `internal/scanner/test_helpers_test.go`
    - 实现 createTempDir 创建临时测试目录
    - 实现 createTestFile 创建测试文件
    - 实现 createTestDirectory 创建测试目录结构
    - _Requirements: 所有测试的基础_

- [x] 2. 实现路径检测测试
  - [x] 2.1 编写路径检测单元测试
    - 测试 macOS 路径检测
    - 测试 Windows 路径检测
    - 测试 Linux 路径检测
    - 测试路径不存在的情况
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x]* 2.2 编写路径检测属性测试
    - **Property 1: Path Detection Correctness**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 3. 实现文件类型检测测试
  - [x] 3.1 编写文件类型检测单元测试
    - 测试数据库文件检测 (.db, .sqlite, .vscdb)
    - 测试对话文件检测 (.chat)
    - 测试日志文件检测 (.log, /logs/)
    - 测试临时文件检测 (.tmp, .temp, crashpad)
    - 测试缓存文件检测 (cache, cacheddata)
    - 测试索引文件检测 (/index/, lancedb)
    - 测试配置文件检测 (config.json, settings.json)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  - [x]* 3.2 编写文件类型检测属性测试
    - **Property 2: File Type Detection Accuracy**
    - **Validates: Requirements 2.1-2.8**

- [x] 4. 实现大小统计测试
  - [x] 4.1 编写大小统计单元测试
    - 测试总大小计算
    - 测试分类大小计算
    - 测试文件计数
    - _Requirements: 3.1, 3.2, 3.5_
  - [x]* 4.2 编写大小聚合属性测试
    - **Property 3: Size Aggregation Accuracy**
    - **Validates: Requirements 3.1, 3.2, 3.5**
  - [x]* 4.3 编写大小格式化属性测试
    - **Property 4: Size Formatting Correctness**
    - **Validates: Requirements 3.3**

- [x] 5. Checkpoint - 确保基础测试通过
  - 运行所有测试，确保基础功能正确
  - 如有问题请询问用户

- [x] 6. 实现对话扫描测试
  - [x] 6.1 编写对话扫描单元测试
    - 测试 .chat 文件发现
    - 测试对话计数
    - 测试对话大小统计
    - 测试无效 JSON 处理
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x]* 6.2 编写对话扫描属性测试
    - **Property 5: Chat File Scanning Completeness**
    - **Validates: Requirements 4.2, 4.3, 4.4**

- [x] 7. 实现进度展示测试
  - [x] 7.1 编写进度展示单元测试
    - 测试进度更新
    - 测试进度完成
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  - [x]* 7.2 编写进度单调性属性测试
    - **Property 6: Progress Monotonicity**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [x]* 7.3 编写进度节流属性测试
    - **Property 7: Progress Throttle Rate**
    - **Validates: Requirements 5.4**

- [x] 8. 实现边界情况测试
  - [x] 8.1 编写空目录测试
    - **Property 8: Empty Directory Handling**
    - **Validates: Requirements 8.1, 8.2**
  - [x] 8.2 编写零大小文件测试
    - **Property 9: Zero-Size File Handling**
    - **Validates: Requirements 8.3**
  - [x] 8.3 编写特殊字符路径测试
    - **Property 10: Special Character Path Handling**
    - **Validates: Requirements 8.4**

- [x] 9. 实现错误处理测试
  - [x] 9.1 编写错误处理单元测试
    - 测试权限错误处理
    - 测试无效 JSON 处理
    - 测试路径不存在处理
    - **Property 11: Graceful Error Handling**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 10. 实现集成测试
  - [x] 10.1 编写 scan 命令集成测试
    - 测试完整扫描流程
    - 测试输出格式
    - 测试结果汇总
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 11. Final Checkpoint - 确保所有测试通过
  - 运行完整测试套件
  - 验证测试覆盖率
  - 如有问题请询问用户

## Notes

- 使用 Go 的 `testing/quick` 包进行属性测试
- 每个属性测试应运行至少 100 次迭代
- 测试文件放在对应包的 `*_test.go` 文件中
- 使用临时目录进行文件系统测试，测试后清理
- 使用 `-short` 标志跳过扫描真实 Kiro 目录的慢速测试

## Completed

所有任务已完成！创建了以下测试文件：

1. `internal/scanner/test_helpers_test.go` - 测试辅助函数
2. `internal/scanner/file_scanner_test.go` - 文件扫描器测试
3. `internal/scanner/chat_scanner_detailed_test.go` - 对话扫描器详细测试
4. `test/integration/scan_command_test.go` - scan 命令集成测试

测试覆盖：
- 路径检测（macOS/Windows/Linux）
- 文件类型检测（数据库、日志、缓存、临时、索引、配置、历史）
- 大小统计和格式化
- 对话扫描和统计
- 进度展示和单调性
- 边界情况（空目录、零大小文件、特殊字符路径）
- 错误处理（权限错误、无效 JSON、路径不存在）

