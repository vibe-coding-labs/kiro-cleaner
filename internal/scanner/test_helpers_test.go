package scanner

import (
	"os"
	"path/filepath"
	"testing"
)

// createTempDir 创建临时测试目录
func createTempDir(t *testing.T, prefix string) string {
	t.Helper()
	dir, err := os.MkdirTemp("", prefix)
	if err != nil {
		t.Fatalf("创建临时目录失败: %v", err)
	}
	t.Cleanup(func() {
		os.RemoveAll(dir)
	})
	return dir
}

// createTestFile 创建测试文件
func createTestFile(t *testing.T, dir, name string, content []byte) string {
	t.Helper()
	path := filepath.Join(dir, name)
	
	// 确保父目录存在
	parentDir := filepath.Dir(path)
	if err := os.MkdirAll(parentDir, 0755); err != nil {
		t.Fatalf("创建父目录失败: %v", err)
	}
	
	if err := os.WriteFile(path, content, 0644); err != nil {
		t.Fatalf("创建测试文件失败: %v", err)
	}
	return path
}

// createTestDirectory 创建测试目录结构
// structure 是一个 map，key 是相对路径，value 是文件内容（nil 表示目录）
func createTestDirectory(t *testing.T, baseDir string, structure map[string][]byte) {
	t.Helper()
	for path, content := range structure {
		fullPath := filepath.Join(baseDir, path)
		if content == nil {
			// 创建目录
			if err := os.MkdirAll(fullPath, 0755); err != nil {
				t.Fatalf("创建目录失败 %s: %v", fullPath, err)
			}
		} else {
			// 创建文件
			parentDir := filepath.Dir(fullPath)
			if err := os.MkdirAll(parentDir, 0755); err != nil {
				t.Fatalf("创建父目录失败 %s: %v", parentDir, err)
			}
			if err := os.WriteFile(fullPath, content, 0644); err != nil {
				t.Fatalf("创建文件失败 %s: %v", fullPath, err)
			}
		}
	}
}

// createKiroTestStructure 创建模拟的 Kiro 存储结构
func createKiroTestStructure(t *testing.T, baseDir string) {
	t.Helper()
	structure := map[string][]byte{
		// 日志文件
		"logs/main.log":     []byte("log content"),
		"logs/error.log":    []byte("error log"),
		
		// 缓存文件
		"Cache/data_0":      []byte("cache data"),
		"CachedData/file1":  []byte("cached"),
		"GPUCache/gpu_data": []byte("gpu cache"),
		
		// 临时文件
		"temp.tmp":          []byte("temp"),
		"Crashpad/crash":    []byte("crash data"),
		
		// 数据库文件
		"conversations.db":  []byte("sqlite db"),
		"state.vscdb":       []byte("vscdb"),
		
		// 索引文件
		"index/vectors.lance": []byte("lance data"),
		"lancedb/data.db":     []byte("lancedb"),
		
		// 配置文件
		"config.json":       []byte(`{"key": "value"}`),
		"settings.json":     []byte(`{}`),
		
		// 历史文件
		"User/History/file1": []byte("history"),
	}
	createTestDirectory(t, baseDir, structure)
}

// createChatTestStructure 创建模拟的 chat 文件结构
func createChatTestStructure(t *testing.T, baseDir string) {
	t.Helper()
	
	// 创建工作区目录结构
	workspaces := []string{
		"workspace1",
		"workspace2",
	}
	
	chatContent := []byte(`{
		"executionId": "test-exec-1",
		"actionId": "test-action-1",
		"chat": [
			{"role": "human", "content": "Hello"},
			{"role": "bot", "content": "Hi there!"}
		],
		"metadata": {
			"modelId": "claude-3",
			"modelProvider": "anthropic",
			"workflow": "chat",
			"workflowId": "wf-1",
			"startTime": 1700000000000,
			"endTime": 1700000001000
		}
	}`)
	
	for _, ws := range workspaces {
		wsPath := filepath.Join(baseDir, ws)
		if err := os.MkdirAll(wsPath, 0755); err != nil {
			t.Fatalf("创建工作区目录失败: %v", err)
		}
		
		// 创建 .chat 文件
		chatFile := filepath.Join(wsPath, "conversation1.chat")
		if err := os.WriteFile(chatFile, chatContent, 0644); err != nil {
			t.Fatalf("创建 chat 文件失败: %v", err)
		}
	}
	
	// 创建特殊目录（应该被跳过）
	specialDirs := []string{"index", "dev_data", "workspace-sessions"}
	for _, dir := range specialDirs {
		dirPath := filepath.Join(baseDir, dir)
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			t.Fatalf("创建特殊目录失败: %v", err)
		}
	}
}

// generateTestContent 生成指定大小的测试内容
func generateTestContent(size int) []byte {
	content := make([]byte, size)
	for i := range content {
		content[i] = byte('a' + (i % 26))
	}
	return content
}

// assertFileExists 断言文件存在
func assertFileExists(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Errorf("文件应该存在: %s", path)
	}
}

// assertFileNotExists 断言文件不存在
func assertFileNotExists(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); err == nil {
		t.Errorf("文件不应该存在: %s", path)
	}
}
