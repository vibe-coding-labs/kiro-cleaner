# 安装和编译指南

本指南详细说明了如何在各种操作系统上安装和编译Kiro Cleaner工具。

## 📋 目录

- [系统要求](#系统要求)
- [快速安装](#快速安装)
- [从源码编译](#从源码编译)
- [平台特定说明](#平台特定说明)
- [构建选项](#构建选项)
- [安装后配置](#安装后配置)
- [故障排除](#故障排除)

## 系统要求

### 基础要求
- **Go**: 1.21 或更高版本
- **Git**: 用于克隆源码
- **Make**: 用于运行构建脚本（可选）

### 磁盘空间
- **编译**: 约 50MB
- **运行时**: 约 10MB
- **备份存储**: 根据清理数据量变化

### 权限要求
- **读取**: Kiro数据存储目录
- **写入**: 备份目录（如果启用）
- **删除**: 清理目标文件

## 快速安装

### macOS

#### 使用Homebrew（推荐）
```bash
# 如果有Homebrew formulae（待发布）
brew install kiro-cleaner

# 或者下载预编译版本
curl -L -o kiro-cleaner https://github.com/your-repo/kiro-cleaner/releases/latest/download/kiro-cleaner-darwin-amd64
chmod +x kiro-cleaner
sudo mv kiro-cleaner /usr/local/bin/
```

#### 从源码编译
```bash
# 安装Go（如果未安装）
brew install go

# 克隆和编译
git clone <repository-url>
cd kiro-cleaner
make build-local
sudo make install
```

### Windows

#### 下载预编译版本
1. 访问 [Releases](https://github.com/your-repo/kiro-cleaner/releases) 页面
2. 下载 `kiro-cleaner-windows-amd64.exe`
3. 重命名为 `kiro-cleaner.exe`
4. 移动到系统PATH目录（如 `C:\Windows\System32\`）

#### 从源码编译
```cmd
REM 安装Go（如果未安装）
REM 从 https://golang.org/dl/ 下载安装包

REM 克隆和编译
git clone <repository-url>
cd kiro-cleaner
go build -o kiro-cleaner.exe .

REM 添加到PATH（可选）
setx PATH "%PATH%;C:\path\to\kiro-cleaner"
```

### Linux

#### 使用包管理器（Ubuntu/Debian）
```bash
# 下载deb包（待发布）
wget https://github.com/your-repo/kiro-cleaner/releases/latest/download/kiro-cleaner_amd64.deb
sudo dpkg -i kiro-cleaner_amd64.deb

# 或者下载预编译二进制文件
wget https://github.com/your-repo/kiro-cleaner/releases/latest/download/kiro-cleaner-linux-amd64
chmod +x kiro-cleaner-linux-amd64
sudo mv kiro-cleaner-linux-amd64 /usr/local/bin/kiro-cleaner
```

#### 从源码编译
```bash
# 安装Go（如果未安装）
sudo apt update
sudo apt install golang-go git make

# 克隆和编译
git clone <repository-url>
cd kiro-cleaner
make build
sudo make install
```

## 从源码编译

### 1. 环境准备

#### 安装Go
```bash
# macOS
brew install go

# Ubuntu/Debian
sudo apt install golang-go

# Windows
# 从 https://golang.org/dl/ 下载并安装
```

验证安装：
```bash
go version
# 应该显示 go1.21.x 或更高版本
```

#### 安装Git
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# 从 https://git-scm.com/ 下载安装
```

验证安装：
```bash
git --version
```

### 2. 克隆项目

```bash
git clone <repository-url>
cd kiro-cleaner
```

### 3. 下载依赖

```bash
go mod download
go mod tidy
```

### 4. 编译

#### 使用Make（推荐）
```bash
# 构建当前平台版本
make build-local

# 构建所有平台版本
make build

# 或者分别构建
make build-darwin-amd64
make build-darwin-arm64
make build-linux-amd64
make build-windows-amd64
```

#### 直接使用Go命令
```bash
# 当前平台
go build -o kiro-cleaner .

# 指定平台
GOOS=darwin GOARCH=amd64 go build -o kiro-cleaner-darwin-amd64 .
GOOS=linux GOARCH=amd64 go build -o kiro-cleaner-linux-amd64 .
GOOS=windows GOARCH=amd64 go build -o kiro-cleaner-windows-amd64.exe .
```

### 5. 安装

```bash
# 使用Make安装
sudo make install

# 手动安装
sudo cp kiro-cleaner /usr/local/bin/
sudo chmod +x /usr/local/bin/kiro-cleaner

# 验证安装
kiro-cleaner --version
kiro-cleaner --help
```

## 平台特定说明

### macOS

#### 权限处理
```bash
# 如果遇到权限问题
sudo xattr -dr com.apple.quarantine /usr/local/bin/kiro-cleaner

# 或者在系统偏好设置 > 安全性与隐私 中允许运行
```

#### 路径检测
工具会自动检测以下路径：
- `~/Library/Application Support/Kiro/`
- `~/Library/Application Support/kiro/`

### Windows

#### UAC处理
```cmd
# 以管理员身份运行命令提示符
# 或者在文件资源管理器中右键"以管理员身份运行"
```

#### 路径检测
工具会自动检测以下路径：
- `%APPDATA%\Kiro\`
- `%APPDATA%\kiro\`

### Linux

#### 权限处理
```bash
# 如果遇到权限问题
sudo chown $USER:$USER /usr/local/bin/kiro-cleaner
chmod +x /usr/local/bin/kiro-cleaner
```

#### 路径检测
工具会自动检测以下路径：
- `~/.config/kiro/`
- `$XDG_CONFIG_HOME/kiro/`

## 构建选项

### 构建标签

```bash
# 启用详细日志
go build -tags debug -o kiro-cleaner .

# 启用性能分析
go build -tags profile -o kiro-cleaner .

# 禁用UI功能
go build -tags no-ui -o kiro-cleaner-cli .
```

### 交叉编译

```bash
# macOS -> Linux
GOOS=linux GOARCH=amd64 go build -o kiro-cleaner-linux .

# macOS -> Windows
GOOS=windows GOARCH=amd64 go build -o kiro-cleaner.exe .

# Linux -> macOS (需要macOS SDK)
GOOS=darwin GOARCH=amd64 go build -o kiro-cleaner-macos .
```

### 自定义构建

```bash
# 设置版本信息
LD_FLAGS="-X main.version=custom-version -X main.commit=$(git rev-parse --short HEAD)"
go build -ldflags "$LD_FLAGS" -o kiro-cleaner .

# 优化构建
go build -ldflags "-s -w" -o kiro-cleaner-small .

# 调试构建
go build -gcflags "-N -l" -o kiro-cleaner-debug .
```

## 安装后配置

### 1. 首次运行

```bash
# 测试安装
kiro-cleaner --version

# 创建默认配置
kiro-cleaner config init

# 扫描Kiro数据
kiro-cleaner scan
```

### 2. 配置检查

```bash
# 检查配置
kiro-cleaner config check

# 查看配置
kiro-cleaner config show

# 编辑配置
kiro-cleaner config edit
```

### 3. 权限设置

#### macOS
```bash
# 确保有权限访问Kiro数据
chmod -R u+rwx ~/Library/Application\ Support/Kiro/
```

#### Windows
```cmd
# 确保有权限访问AppData
icacls "%APPDATA%\Kiro" /grant %USERNAME%:F /T
```

#### Linux
```bash
# 确保有权限访问配置目录
chmod -R u+rwx ~/.config/kiro/
```

## 故障排除

### 常见编译错误

#### 1. Go版本过低
```bash
# 错误信息
go: cannot find main module, but found go.mod in /path/to/project

# 解决方案
go version  # 检查版本
# 升级到Go 1.21+
```

#### 2. 依赖下载失败
```bash
# 错误信息
go: github.com/example/package@v1.2.3: Get "https://proxy.golang.org/...": dial tcp 142.251.42.241:443: i/o timeout

# 解决方案
go env -w GOPROXY=direct
go env -w GOSUMDB=off
```

#### 3. 权限错误
```bash
# 错误信息
permission denied: /usr/local/bin/kiro-cleaner

# 解决方案
sudo make install
# 或者
sudo cp kiro-cleaner /usr/local/bin/
```

### 运行时错误

#### 1. 找不到可执行文件
```bash
# 错误信息
-bash: kiro-cleaner: command not found

# 解决方案
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. 权限不足
```bash
# 错误信息
permission denied: cannot access /path/to/kiro/data

# 解决方案
# macOS: 在系统偏好设置中授予完全磁盘访问权限
# Windows: 以管理员身份运行
# Linux: 检查文件权限
```

### 构建性能优化

#### 1. 并行编译
```bash
# 使用所有CPU核心
go build -p $(nproc) -o kiro-cleaner .
```

#### 2. 缓存利用
```bash
# 启用Go模块缓存
go env GOMODCACHE
# 确保有足够的磁盘空间
```

#### 3. 增量构建
```bash
# 只重新构建修改的文件
go build -o kiro-cleaner .
```

## 验证安装

### 基础验证
```bash
# 检查版本
kiro-cleaner --version

# 检查帮助
kiro-cleaner --help

# 检查配置
kiro-cleaner config check
```

### 功能验证
```bash
# 扫描测试
kiro-cleaner scan --verbose

# 备份测试
kiro-cleaner backup list

# 清理预览
kiro-cleaner preview --dry-run
```

### 性能验证
```bash
# 内存使用
kiro-cleaner scan --verbose

# 响应时间
time kiro-cleaner scan
```

## 下一步

安装完成后，建议：
1. 阅读 [使用指南](../README.md#使用方法)
2. 配置 [清理规则](../README.md#配置)
3. 运行首次 [扫描](../README.md#使用示例)
4. 创建测试 [备份](../README.md#示例2备份管理)

如有问题，请参考 [故障排除指南](../README.md#故障排除) 或创建 [Issue](../../issues/new)。