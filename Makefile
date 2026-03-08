# Kiro Cleaner Makefile

# 变量定义
BINARY_NAME=kiro-cleaner
BUILD_DIR=build
# 使用显式的相对路径，确保在 Go module 模式下可以正常构建
CMD_DIR=./cmd/kiro-cleaner
VERSION=$(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT=$(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_TIME=$(shell date +%Y-%m-%dT%H:%M:%SZ)
LDFLAGS=-ldflags "-X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.buildTime=$(BUILD_TIME)"

# 默认目标
.PHONY: all
all: clean build

# 清理
.PHONY: clean
clean:
	@echo "🧹 清理构建文件..."
	@rm -rf $(BUILD_DIR)
	@go clean

# 下载依赖
.PHONY: deps
deps:
	@echo "📦 下载依赖..."
	@go mod download
	@go mod tidy

# 构建
.PHONY: build
build: deps
	@echo "🔨 构建 $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux-amd64 $(CMD_DIR)
	@GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-amd64 $(CMD_DIR)
	@GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-arm64 $(CMD_DIR)
	@GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-windows-amd64.exe $(CMD_DIR)
	@echo "✅ 构建完成"

# 构建当前平台
.PHONY: build-local
build-local: deps
	@echo "🔨 构建当前平台版本..."
	@mkdir -p $(BUILD_DIR)
	@go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)
	@echo "✅ 构建完成: $(BUILD_DIR)/$(BINARY_NAME)"

# 运行测试
.PHONY: test
test:
	@echo "🧪 运行测试..."
	@go test -v ./...
	@echo "✅ 测试完成"

# 运行测试并生成覆盖率报告
.PHONY: test-coverage
test-coverage:
	@echo "📊 运行测试并生成覆盖率报告..."
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "✅ 覆盖率报告生成: coverage.html"

# 代码格式化
.PHONY: fmt
fmt:
	@echo "✨ 格式化代码..."
	@go fmt ./...
	@gofmt -s -w .
	@echo "✅ 代码格式化完成"

# 代码检查
.PHONY: lint
lint:
	@echo "🔍 代码检查..."
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "⚠️  golangci-lint 未安装，跳过代码检查"; \
		echo "安装命令: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"; \
	fi

# 安装
.PHONY: install
install: build-local
	@echo "📦 安装 $(BINARY_NAME)..."
	@sudo cp $(BUILD_DIR)/$(BINARY_NAME) /usr/local/bin/
	@echo "✅ 安装完成"

# 卸载
.PHONY: uninstall
uninstall:
	@echo "🗑️  卸载 $(BINARY_NAME)..."
	@sudo rm -f /usr/local/bin/$(BINARY_NAME)
	@echo "✅ 卸载完成"

# 开发模式运行
.PHONY: dev
dev:
	@echo "🚀 开发模式运行..."
	@go run $(CMD_DIR) $(filter-out $@,$(MAKECMDGOALS))

# 创建发布包
.PHONY: package
package: build
	@echo "📦 创建发布包..."
	@mkdir -p release
	@cd $(BUILD_DIR) && tar -czf ../release/$(BINARY_NAME)-$(VERSION)-linux-amd64.tar.gz $(BINARY_NAME)-linux-amd64
	@cd $(BUILD_DIR) && tar -czf ../release/$(BINARY_NAME)-$(VERSION)-darwin-amd64.tar.gz $(BINARY_NAME)-darwin-amd64
	@cd $(BUILD_DIR) && tar -czf ../release/$(BINARY_NAME)-$(VERSION)-darwin-arm64.tar.gz $(BINARY_NAME)-darwin-arm64
	@cd $(BUILD_DIR) && zip -q ../release/$(BINARY_NAME)-$(VERSION)-windows-amd64.zip $(BINARY_NAME)-windows-amd64.exe
	@echo "✅ 发布包创建完成: release/"

# 生成文档
.PHONY: docs
docs:
	@echo "📚 生成文档..."
	@go doc -all > docs/api.md 2>/dev/null || echo "⚠️  无法生成API文档"
	@echo "✅ 文档生成完成"

# 完整检查
.PHONY: check
check: fmt lint test
	@echo "✅ 完整检查完成"

# 帮助
.PHONY: help
help:
	@echo "Kiro Cleaner 构建工具"
	@echo ""
	@echo "可用命令:"
	@echo "  make all          - 完整构建"
	@echo "  make clean        - 清理构建文件"
	@echo "  make deps         - 下载依赖"
	@echo "  make build        - 构建所有平台版本"
	@echo "  make build-local  - 构建当前平台版本"
	@echo "  make test         - 运行测试"
	@echo "  make test-coverage- 运行测试并生成覆盖率报告"
	@echo "  make fmt          - 格式化代码"
	@echo "  make lint         - 代码检查"
	@echo "  make install      - 安装到系统"
	@echo "  make uninstall    - 从系统卸载"
	@echo "  make dev          - 开发模式运行"
	@echo "  make package      - 创建发布包"
	@echo "  make docs         - 生成文档"
	@echo "  make check        - 完整检查"
	@echo "  make help         - 显示此帮助"
	@echo ""
	@echo "版本信息:"
	@echo "  Version: $(VERSION)"
	@echo "  Commit:  $(COMMIT)"
	@echo "  Build:   $(BUILD_TIME)"

# .PHONY 声明（防止文件名冲突）
.PHONY: all clean deps build build-local test test-coverage fmt lint install uninstall dev package docs check help

# 设置默认目标
.DEFAULT_GOAL := help