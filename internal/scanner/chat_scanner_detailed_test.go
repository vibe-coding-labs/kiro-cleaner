package scanner

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ============================================
// 对话扫描测试 (Requirement 4)
// ============================================

func TestChatScanning_FindChatFiles(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-scan")
	
	// 创建模拟的 chat 文件结构
	createChatTestStructure(t, tempDir)
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描工作区失败: %v", err)
	}
	
	// 应该找到 2 个工作区
	if len(workspaces) != 2 {
		t.Errorf("应该找到 2 个工作区，实际找到 %d 个", len(workspaces))
	}
	
	// 每个工作区应该有 1 个对话
	for _, ws := range workspaces {
		if ws.ConversationCount != 1 {
			t.Errorf("工作区 %s 应该有 1 个对话，实际有 %d 个", ws.WorkspaceID, ws.ConversationCount)
		}
	}
}

func TestChatScanning_EmptyDirectory(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-empty")
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描空目录不应该返回错误: %v", err)
	}
	
	// 空目录应该返回空列表
	if len(workspaces) != 0 {
		t.Errorf("空目录应该返回 0 个工作区，实际返回 %d 个", len(workspaces))
	}
}

func TestChatScanning_InvalidJSON(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-invalid")
	
	// 创建工作区目录
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	
	// 创建无效的 JSON 文件
	invalidChat := filepath.Join(wsPath, "invalid.chat")
	if err := os.WriteFile(invalidChat, []byte("not valid json"), 0644); err != nil {
		t.Fatalf("创建无效 chat 文件失败: %v", err)
	}
	
	// 创建有效的 chat 文件
	validContent := []byte(`{
		"executionId": "test",
		"chat": [{"role": "human", "content": "test"}],
		"metadata": {}
	}`)
	validChat := filepath.Join(wsPath, "valid.chat")
	if err := os.WriteFile(validChat, validContent, 0644); err != nil {
		t.Fatalf("创建有效 chat 文件失败: %v", err)
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描不应该因为无效 JSON 而失败: %v", err)
	}
	
	// 应该只统计有效的 chat 文件
	if len(workspaces) != 1 {
		t.Errorf("应该找到 1 个工作区，实际找到 %d 个", len(workspaces))
	}
	
	if workspaces[0].ConversationCount != 1 {
		t.Errorf("应该只统计 1 个有效对话，实际统计 %d 个", workspaces[0].ConversationCount)
	}
}

func TestChatScanning_MessageCount(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-messages")
	
	// 创建工作区目录
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	
	// 创建包含多条消息的 chat 文件
	chatContent := []byte(`{
		"executionId": "test",
		"chat": [
			{"role": "human", "content": "Hello"},
			{"role": "bot", "content": "Hi!"},
			{"role": "human", "content": "How are you?"},
			{"role": "bot", "content": "I'm fine!"},
			{"role": "tool", "content": "tool result"}
		],
		"metadata": {}
	}`)
	chatFile := filepath.Join(wsPath, "conversation.chat")
	if err := os.WriteFile(chatFile, chatContent, 0644); err != nil {
		t.Fatalf("创建 chat 文件失败: %v", err)
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	if len(workspaces) != 1 {
		t.Fatalf("应该找到 1 个工作区")
	}
	
	// 应该统计 5 条消息
	if workspaces[0].TotalMessages != 5 {
		t.Errorf("应该统计 5 条消息，实际统计 %d 条", workspaces[0].TotalMessages)
	}
}

func TestChatScanning_TotalSize(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-size")
	
	// 创建工作区目录
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	
	// 创建已知大小的 chat 文件
	chatContent := generateTestContent(500)
	// 确保是有效的 JSON
	chatContent = []byte(`{"executionId":"test","chat":[{"role":"human","content":"` + string(generateTestContent(400)) + `"}],"metadata":{}}`)
	
	chatFile := filepath.Join(wsPath, "conversation.chat")
	if err := os.WriteFile(chatFile, chatContent, 0644); err != nil {
		t.Fatalf("创建 chat 文件失败: %v", err)
	}
	
	// 获取实际文件大小
	fileInfo, err := os.Stat(chatFile)
	if err != nil {
		t.Fatalf("获取文件信息失败: %v", err)
	}
	expectedSize := fileInfo.Size()
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	if len(workspaces) != 1 {
		t.Fatalf("应该找到 1 个工作区")
	}
	
	// 验证大小
	if workspaces[0].TotalSize != expectedSize {
		t.Errorf("总大小应该是 %d，实际是 %d", expectedSize, workspaces[0].TotalSize)
	}
}

func TestChatScanning_SkipSpecialDirs(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-special")
	
	// 创建特殊目录（应该被跳过）
	specialDirs := []string{"index", "dev_data", "workspace-sessions", ".migrations"}
	for _, dir := range specialDirs {
		dirPath := filepath.Join(tempDir, dir)
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			t.Fatalf("创建特殊目录失败: %v", err)
		}
		// 在特殊目录中创建 .chat 文件
		chatFile := filepath.Join(dirPath, "should_skip.chat")
		if err := os.WriteFile(chatFile, []byte(`{"chat":[]}`), 0644); err != nil {
			t.Fatalf("创建 chat 文件失败: %v", err)
		}
	}
	
	// 创建正常工作区
	wsPath := filepath.Join(tempDir, "normal_workspace")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	chatFile := filepath.Join(wsPath, "valid.chat")
	if err := os.WriteFile(chatFile, []byte(`{"executionId":"test","chat":[{"role":"human","content":"test"}],"metadata":{}}`), 0644); err != nil {
		t.Fatalf("创建 chat 文件失败: %v", err)
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	workspaces, err := scanner.ScanWorkspaces()
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	// 应该只找到 1 个工作区（特殊目录应该被跳过）
	if len(workspaces) != 1 {
		t.Errorf("应该只找到 1 个工作区，实际找到 %d 个", len(workspaces))
	}
}

func TestChatScanning_ConversationStats(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-stats")
	
	// 创建多个工作区
	for i := 1; i <= 3; i++ {
		wsPath := filepath.Join(tempDir, "workspace"+string(rune('0'+i)))
		if err := os.MkdirAll(wsPath, 0755); err != nil {
			t.Fatalf("创建工作区目录失败: %v", err)
		}
		
		// 每个工作区创建 2 个 chat 文件
		for j := 1; j <= 2; j++ {
			chatContent := []byte(`{
				"executionId": "test",
				"chat": [
					{"role": "human", "content": "Hello"},
					{"role": "bot", "content": "Hi!"}
				],
				"metadata": {}
			}`)
			chatFile := filepath.Join(wsPath, "conv"+string(rune('0'+j))+".chat")
			if err := os.WriteFile(chatFile, chatContent, 0644); err != nil {
				t.Fatalf("创建 chat 文件失败: %v", err)
			}
		}
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	stats, err := scanner.GetConversationStats()
	if err != nil {
		t.Fatalf("获取对话统计失败: %v", err)
	}
	
	// 验证总对话数
	if stats.TotalConversations != 6 {
		t.Errorf("总对话数应该是 6，实际是 %d", stats.TotalConversations)
	}
	
	// 验证总消息数 (6 对话 * 2 消息)
	if stats.TotalMessages != 12 {
		t.Errorf("总消息数应该是 12，实际是 %d", stats.TotalMessages)
	}
	
	// 验证工作区数量
	if len(stats.WorkspaceBreakdown) != 3 {
		t.Errorf("工作区数量应该是 3，实际是 %d", len(stats.WorkspaceBreakdown))
	}
}

func TestChatScanning_FindCleanableConversations(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-cleanable")
	
	// 创建工作区目录
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	
	// 创建一个旧的 chat 文件
	oldChat := filepath.Join(wsPath, "old.chat")
	if err := os.WriteFile(oldChat, []byte(`{"chat":[]}`), 0644); err != nil {
		t.Fatalf("创建 chat 文件失败: %v", err)
	}
	// 修改文件时间为 30 天前
	oldTime := time.Now().AddDate(0, 0, -30)
	if err := os.Chtimes(oldChat, oldTime, oldTime); err != nil {
		t.Fatalf("修改文件时间失败: %v", err)
	}
	
	// 创建一个新的 chat 文件
	newChat := filepath.Join(wsPath, "new.chat")
	if err := os.WriteFile(newChat, []byte(`{"chat":[]}`), 0644); err != nil {
		t.Fatalf("创建 chat 文件失败: %v", err)
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	// 查找 7 天前的对话
	cleanable, err := scanner.FindCleanableConversations(7, 0)
	if err != nil {
		t.Fatalf("查找可清理对话失败: %v", err)
	}
	
	// 应该只找到 1 个旧对话
	if len(cleanable) != 1 {
		t.Errorf("应该找到 1 个可清理对话，实际找到 %d 个", len(cleanable))
	}
	
	if len(cleanable) > 0 && cleanable[0].Reason != "old" {
		t.Errorf("清理原因应该是 'old'，实际是 '%s'", cleanable[0].Reason)
	}
}

func TestChatScanning_FindAllConversations(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-all")
	
	// 创建工作区目录
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	
	// 创建多个 chat 文件
	for i := 1; i <= 5; i++ {
		chatFile := filepath.Join(wsPath, "conv"+string(rune('0'+i))+".chat")
		if err := os.WriteFile(chatFile, []byte(`{"chat":[]}`), 0644); err != nil {
			t.Fatalf("创建 chat 文件失败: %v", err)
		}
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	// ageDays=0 应该返回所有对话
	cleanable, err := scanner.FindCleanableConversations(0, 0)
	if err != nil {
		t.Fatalf("查找所有对话失败: %v", err)
	}
	
	// 应该找到所有 5 个对话
	if len(cleanable) != 5 {
		t.Errorf("应该找到 5 个对话，实际找到 %d 个", len(cleanable))
	}
}

// ============================================
// 进度展示测试 (Requirement 5)
// ============================================

func TestChatScanning_ProgressCallback(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-progress")
	
	// 创建测试结构
	createChatTestStructure(t, tempDir)
	
	var progressUpdates []types.ScanProgress
	callback := func(progress types.ScanProgress) {
		progressUpdates = append(progressUpdates, progress)
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	_, err := scanner.ScanWorkspacesWithProgress(callback)
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	// 应该有进度更新
	if len(progressUpdates) == 0 {
		t.Error("应该有进度更新")
	}
	
	// 最后一个更新应该标记为完成
	lastUpdate := progressUpdates[len(progressUpdates)-1]
	if !lastUpdate.IsComplete {
		t.Error("最后一个进度更新应该标记为完成")
	}
}

func TestChatScanning_ProgressMonotonicity(t *testing.T) {
	tempDir := createTempDir(t, "test-chat-mono")
	
	// 创建测试结构
	createChatTestStructure(t, tempDir)
	
	var prevFiles int
	var prevSize int64
	
	callback := func(progress types.ScanProgress) {
		if progress.ScannedFiles < prevFiles {
			t.Errorf("ScannedFiles 不应该减少: %d -> %d", prevFiles, progress.ScannedFiles)
		}
		if progress.TotalSize < prevSize {
			t.Errorf("TotalSize 不应该减少: %d -> %d", prevSize, progress.TotalSize)
		}
		prevFiles = progress.ScannedFiles
		prevSize = progress.TotalSize
	}
	
	scanner := NewChatScanner()
	scanner.SetBasePath(tempDir)
	
	_, err := scanner.ScanWorkspacesWithProgress(callback)
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
}

// IsChatFile 测试已在 chat_scanner_test.go 中定义
