# Kiro Cleaner - Kiro对话数据清理工具

Kiro Cleaner 是一个专门用于清理Kiro AI对话应用冗余数据的工具。它可以帮助用户安全地清理对话历史、缓存文件、日志文件等冗余数据，同时提供完整的备份和恢复功能。

## ✨ 特性

- 🔍 **智能扫描**: 自动发现Kiro数据存储位置并分析存储使用情况
- 🧹 **安全清理**: 基于规则的智能清理，确保数据安全
- 💾 **自动备份**: 清理前自动创建备份，支持压缩和增量备份
- ⚙️ **灵活配置**: 支持自定义清理规则和清理策略
- 📊 **详细报告**: 提供清理前后对比和空间节省统计
- 🔄 **回滚支持**: 支持清理操作回滚
- 🎨 **美观界面**: 彩色输出和进度显示
- 🚀 **跨平台**: 支持macOS、Windows、Linux

## 📋 系统要求

- Go 1.21+
- 支持的操作系统：macOS 10.15+, Windows 10+, Linux (kernel 4.0+)

## 🚀 快速开始

### 安装

#### 从源码构建

```bash
# 克隆仓库
git clone <repository-url>
cd kiro-cleaner

# 构建
make build-local

# 安装到系统（可选）
sudo make install
```

#### 使用预编译版本

从 [Releases](releases) 页面下载适合您操作系统的预编译二进制文件。

### 使用方法

#### 基本使用

```bash
# 扫描Kiro数据存储
./kiro-cleaner scan

# 预览清理操作
./kiro-cleaner preview

# 执行清理（预览模式）
./kiro-cleaner clean --dry-run

# 执行清理（实际执行）
./kiro-cleaner clean --backup

# 列出备份
./kiro-cleaner backup list

# 恢复备份
./kiro-cleaner backup restore <backup-id>
```

#### 命令行选项

```bash
./kiro-cleaner --help

可用命令:
  scan         扫描Kiro数据存储
  preview      预览清理操作
  clean        执行数据清理
  backup       管理备份
  config       管理配置

全局选项:
  --config, -c     配置文件路径
  --verbose, -v    详细输出
  --output, -o     输出格式 (table|json|csv)
  --config-dir     配置目录路径
```

## 📁 项目结构

```
kiro-cleaner/
├── cmd/kiro-cleaner/          # 主程序入口
├── internal/                  # 内部模块
│   ├── config/               # 配置管理
│   ├── scanner/              # 数据扫描
│   ├── cleaner/              # 清理引擎
│   ├── backup/               # 备份管理
│   ├── database/             # 数据库操作
│   ├── storage/              # 存储检测
│   ├── ui/                   # 用户界面
│   └── utils/                # 工具函数
├── pkg/types/                # 公共类型定义
├── assets/                   # 静态资源
├── test/                     # 测试文件
├── Makefile                  # 构建脚本
├── go.mod                    # Go模块文件
└── README.md                 # 项目文档
```

## 🏗️ 架构设计

### 核心模块

#### 1. Scanner (扫描器)
- 自动发现Kiro存储路径
- 扫描和分析文件类型
- 计算存储统计信息
- 生成清理建议

#### 2. Cleaner (清理引擎)
- 规则引擎：基于条件匹配文件
- 安全检查：确保清理操作安全
- 执行清理：实际删除或移动文件
- 进度跟踪：实时显示清理进度

#### 3. Backup (备份管理器)
- 自动备份：清理前创建备份
- 压缩存储：节省存储空间
- 版本管理：支持多版本备份
- 快速恢复：从备份恢复数据

#### 4. Database (数据库操作)
- SQLite连接和管理
- 对话记录查询和清理
- 数据完整性检查
- 数据库优化

### 清理规则

工具支持灵活的清理规则配置：

```json
{
  "name": "temp_file_cleanup",
  "description": "清理临时文件",
  "priority": 1,
  "enabled": true,
  "conditions": [
    {
      "type": "file_type",
      "field": "file_type",
      "operator": "=",
      "value": "temp"
    }
  ],
  "actions": [
    {
      "type": "delete",
      "backup": false
    }
  ]
}
```

## ⚙️ 配置

### 默认配置

工具使用默认配置进行初始化，也可以通过配置文件自定义：

```json
{
  "kiro_paths": {
    "auto_detect": true,
    "custom_paths": []
  },
  "cleanup_rules": [
    // 清理规则配置
  ],
  "backup_config": {
    "enabled": true,
    "path": "~/.kiro-cleaner/backups",
    "max_backups": 5,
    "compressed": true
  },
  "safety_checks": {
    "min_disk_space": "100MB",
    "verify_database": true,
    "require_confirmation": true,
    "backup_before_delete": true
  },
  "ui": {
    "show_progress": true,
    "detailed_output": false,
    "color_output": true
  }
}
```

### 自定义配置

```bash
# 使用自定义配置文件
./kiro-cleaner --config /path/to/config.json scan

# 编辑配置文件
./kiro-cleaner config edit
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
make test

# 运行单元测试
go test ./test/unit/...

# 运行集成测试
go test ./test/integration/...

# 生成测试覆盖率报告
make test-coverage
```

### 测试数据

测试使用模拟数据，包括：
- 模拟Kiro目录结构
- 模拟数据库文件
- 模拟各种文件类型

## 🔧 开发

### 开发环境设置

```bash
# 安装开发依赖
make deps

# 代码格式化
make fmt

# 代码检查
make lint

# 开发模式运行
make dev
```

### 添加新功能

1. 在相应的`internal/`模块中添加代码
2. 添加相应的单元测试
3. 更新文档和配置
4. 运行测试确保功能正常

## 📊 使用示例

### 示例1：基本清理流程

```bash
# 1. 扫描数据存储
$ ./kiro-cleaner scan
🔍 扫描Kiro数据存储...
📊 数据库文件: /Users/user/Library/Application Support/Kiro/conversations.db (125.6 MB)
📁 配置文件: /Users/user/Library/Application Support/Kiro/config.json (2.1 KB)
🗂️ 缓存目录: /Users/user/Library/Application Support/Kiro/cache/ (89.3 MB)
📝 日志目录: /Users/user/Library/Application Support/Kiro/logs/ (15.7 MB)
🗑️ 临时目录: /Users/user/Library/Application Support/Kiro/temp/ (3.2 MB)

总计存储使用: 235.9 MB
扫描完成! 找到 1,247 个可清理项目 (预计节省: 67.8 MB)

# 2. 预览清理操作
$ ./kiro-cleaner preview
🧹 清理预览 (预计节省 67.8 MB):

1. 临时文件 (3.2 MB)
   - temp_session_*.tmp (1.5 MB)
   - download_cache/* (1.7 MB)

2. 旧日志文件 (15.7 MB)
   - app_2024-01-*.log (12.3 MB)
   - error_2024-01-*.log (3.4 MB)

3. 过期货币缓存 (45.2 MB)
   - model_cache_v1/* (28.9 MB)
   - response_cache/expired/* (16.3 MB)

4. 旧对话记录 (3.7 MB)
   - 15个对话记录 (最后活动: 30+天前)

是否继续清理? (y/N): y

# 3. 执行清理
$ ./kiro-cleaner clean --backup
🧹 开始清理...
[████████████████████████████████████████] 100% (1,247/1,247)

✅ 清理完成!
📊 清理结果:
   - 删除了 892 个临时文件 (3.2 MB)
   - 清理了 23 个旧日志文件 (15.7 MB)
   - 删除了 315 个过期缓存文件 (45.2 MB)
   - 移除了 15 个旧对话记录 (3.7 MB)

💾 总计节省: 67.8 MB
💾 备份创建于: /Users/user/kiro-cleaner-backups/backup_20241201_143022.zip
```

### 示例2：备份管理

```bash
# 列出备份
$ ./kiro-cleaner backup list
💾 可用备份:

1. backup_20241201_143022.zip (67.8 MB) - 2024-12-01 14:30:22
2. backup_20241130_093045.zip (125.3 MB) - 2024-11-30 09:30:45
3. backup_20241129_160712.zip (89.1 MB) - 2024-11-29 16:07:12

# 恢复备份
$ ./kiro-cleaner backup restore backup_20241201_143022
🔄 开始恢复备份...
✅ 备份恢复完成: 1,247 个项目已恢复
```

## 🛠️ 故障排除

### 常见问题

#### 1. 找不到Kiro数据

```bash
$ ./kiro-cleaner scan
❌ 错误: 未找到Kiro数据存储路径

解决方案:
- 确认Kiro已正确安装并运行过
- 检查Kiro的数据存储路径是否正确
- 使用 --config 参数指定自定义路径
```

#### 2. 权限不足

```bash
$ ./kiro-cleaner clean
❌ 错误: 权限不足，无法访问文件

解决方案:
- 以管理员权限运行
- 检查文件权限设置
- 确保有足够的磁盘空间
```

#### 3. 备份失败

```bash
$ ./kiro-cleaner clean --backup
⚠️  警告: 创建备份失败: 磁盘空间不足

解决方案:
- 释放更多磁盘空间
- 禁用备份功能: ./kiro-cleaner clean --no-backup
- 指定备份路径: --backup-path /path/to/large/disk
```

### 日志和调试

```bash
# 启用详细输出
./kiro-cleaner --verbose scan

# 查看构建信息
./kiro-cleaner version

# 生成诊断报告
./kiro-cleaner --verbose --output json scan > diagnostic.json
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发指南

- 遵循Go代码规范
- 添加适当的测试
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目采用 Apache 2.0 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [故障排除](#故障排除) 部分
2. 搜索已有的 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)
4. 参与 [Discussions](../../discussions)

---

**免责声明**: 本工具会修改或删除文件。使用前请务必备份重要数据。作者不对任何数据丢失承担责任。