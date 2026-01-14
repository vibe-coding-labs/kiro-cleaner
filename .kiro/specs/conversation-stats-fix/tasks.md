# Implementation Plan: Conversation Stats Fix

## Overview

修复 Kiro 清理工具中对话数据统计功能，将基于 SQLite 数据库的实现改为基于 `.chat` JSON 文件的实现。

## Tasks

- [x] 1. 创建 Chat 数据类型定义
  - 在 `pkg/types/types.go` 中添加 ChatFileInfo、ChatMetadata、WorkspaceStats、ConversationStats 等类型
  - _Requirements: 3.5, 4.1-4.5_

- [x] 2. 实现 ChatParser 解析器
  - [x] 2.1 创建 `internal/scanner/chat_parser.go` 文件
    - 实现 ParseChatFile 方法解析单个 .chat 文件
    - 实现消息计数逻辑（human/bot/tool）
    - 实现元数据提取
    - _Requirements: 3.1, 3.2, 3.3, 3.5_
  - [x] 2.2 编写 ChatParser 属性测试
    - **Property 2: Message Count Accuracy**
    - **Validates: Requirements 3.2, 3.3**

- [x] 3. 实现 ChatScanner 扫描器
  - [x] 3.1 创建 `internal/scanner/chat_scanner.go` 文件
    - 实现 FindKiroAgentPath 方法（支持 macOS/Windows/Linux）
    - 实现 ScanWorkspaces 方法递归扫描工作区
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_
  - [x] 3.2 编写 ChatScanner 属性测试
    - **Property 1: Chat File Identification**
    - **Validates: Requirements 2.2**

- [x] 4. 实现统计聚合功能
  - [x] 4.1 实现 GetConversationStats 方法
    - 聚合所有工作区的统计数据
    - 计算总对话数、总消息数、总大小
    - 计算平均每对话消息数
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 4.2 编写统计聚合属性测试
    - **Property 3: Size Aggregation**
    - **Property 4: Conversation Count Accuracy**
    - **Property 5: Average Calculation**
    - **Validates: Requirements 2.3, 2.4, 4.1, 4.3, 4.5**

- [x] 5. Checkpoint - 确保所有测试通过
  - 运行所有测试，确保核心功能正确
  - 如有问题请询问用户

- [x] 6. 实现可清理对话识别
  - [x] 6.1 实现 FindCleanableConversations 方法
    - 识别超过指定天数的旧对话
    - 识别超过指定大小的大对话
    - 计算潜在节省空间
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 6.2 编写可清理对话属性测试
    - **Property 6: Cleanable Conversation Identification**
    - **Property 7: Space Savings Calculation**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 7. 集成到现有命令
  - [x] 7.1 修改 `cmd/kiro-cleaner/commands.go`
    - 更新 runStatus 函数使用 ChatScanner
    - 更新 displayStatus 函数显示新的统计格式
    - 移除对 SQLite 数据库的依赖
    - _Requirements: 4.6_
  - [x] 7.2 更新 runScan 和 runAnalyze 函数
    - 集成新的扫描逻辑
    - _Requirements: 2.1, 2.2_

- [x] 8. Final Checkpoint - 确保所有测试通过
  - 运行完整测试套件
  - 手动验证 `kiro-cleaner status` 命令输出正确的统计信息
  - 如有问题请询问用户

## Notes

- 所有任务均为必需，包括属性测试
- 使用 Go 的 `testing/quick` 或 `gopter` 进行属性测试
- 每个属性测试应运行至少 100 次迭代
- 保持向后兼容，不删除现有的 SQLite 相关代码（可能其他功能还在使用）
