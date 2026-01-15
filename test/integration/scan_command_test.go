package integration

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ============================================
// Scan 命令集成测试 (Requirement 6)
// ============================================

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
	
	parentDir := filepath.Dir(path)
	if err := os.MkdirAll(parentDir, 0755); err != nil {
		t.Fatalf("创建父目录失败: %v", err)
	}
	
	if err := os.WriteFile(path, content, 0644); err != nil {
		t.Fatalf("创建测试文件失败: %v", err)
	}
	return path
}

// generateTestContent 生成指定大小的测试内容
func generateTestContent(size int) []byte {
	content := make([]byte, size)
	for i := range content {
		content[i] = byte('a' + (i % 26))
	}
	return content
}

// TestScanCommand_FullWorkflow 测试完整扫描流程
func TestScanCommand_FullWorkflow(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-workflow")
	
	// 创建模拟的 Kiro 存储结构
	structure := map[string][]byte{
		"logs/main.log":       generateTestContent(1000),
		"logs/error.log":      generateTestContent(500),
		"Cache/data_0":        generateTestContent(2000),
		"CachedData/file1":    generateTestContent(1500),
		"temp.tmp":            generateTestContent(300),
		"crashpad/crash":      generateTestContent(200),
		"conversations.db":    generateTestContent(5000),
		"index/vectors.lance": generateTestContent(3000),
		"config.json":         []byte(`{"key": "value"}`),
		"history/backup1":     generateTestContent(800),
	}
	
	for path, content := range structure {
		createTestFile(t, tempDir, path, content)
	}
	
	// 使用 StorageDetector 扫描
	detector := storage.NewStorageDetector()
	
	// 获取目录大小
	totalSize, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	
	// 验证总大小
	expectedTotal := int64(1000 + 500 + 2000 + 1500 + 300 + 200 + 5000 + 3000 + 16 + 800)
	if totalSize != expectedTotal {
		t.Errorf("总大小应该是 %d，实际是 %d", expectedTotal, totalSize)
	}
	
	// 获取文件类型
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 按类型统计
	typeCounts := make(map[types.FileType]int)
	typeSizes := make(map[types.FileType]int64)
	
	for path, ft := range fileTypes {
		info, err := os.Stat(path)
		if err != nil {
			continue
		}
		typeCounts[ft]++
		typeSizes[ft] += info.Size()
	}
	
	// 验证日志文件
	if typeCounts[types.TypeLog] != 2 {
		t.Errorf("日志文件数量应该是 2，实际是 %d", typeCounts[types.TypeLog])
	}
	if typeSizes[types.TypeLog] != 1500 {
		t.Errorf("日志文件大小应该是 1500，实际是 %d", typeSizes[types.TypeLog])
	}
	
	// 验证缓存文件
	if typeCounts[types.TypeCache] != 2 {
		t.Errorf("缓存文件数量应该是 2，实际是 %d", typeCounts[types.TypeCache])
	}
	
	// 验证临时文件
	if typeCounts[types.TypeTemp] != 2 {
		t.Errorf("临时文件数量应该是 2，实际是 %d", typeCounts[types.TypeTemp])
	}
	
	// 验证索引文件
	if typeCounts[types.TypeIndex] != 1 {
		t.Errorf("索引文件数量应该是 1，实际是 %d", typeCounts[types.TypeIndex])
	}
	
	// 验证配置文件
	if typeCounts[types.TypeConfig] != 1 {
		t.Errorf("配置文件数量应该是 1，实际是 %d", typeCounts[types.TypeConfig])
	}
	
	// 验证历史文件
	if typeCounts[types.TypeBackup] != 1 {
		t.Errorf("历史文件数量应该是 1，实际是 %d", typeCounts[types.TypeBackup])
	}
}

// TestScanCommand_ChatScanning 测试对话扫描
func TestScanCommand_ChatScanning(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-chat")
	
	// 创建工作区目录
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
					{"role": "bot", "content": "Hi!"},
					{"role": "human", "content": "How are you?"}
				],
				"metadata": {}
			}`)
			chatFile := filepath.Join(wsPath, "conv"+string(rune('0'+j))+".chat")
			if err := os.WriteFile(chatFile, chatContent, 0644); err != nil {
				t.Fatalf("创建 chat 文件失败: %v", err)
			}
		}
	}
	
	// 创建特殊目录（应该被跳过）
	specialDirs := []string{"index", "dev_data", "workspace-sessions"}
	for _, dir := range specialDirs {
		dirPath := filepath.Join(tempDir, dir)
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			t.Fatalf("创建特殊目录失败: %v", err)
		}
		// 在特殊目录中创建 .chat 文件（应该被跳过）
		chatFile := filepath.Join(dirPath, "should_skip.chat")
		if err := os.WriteFile(chatFile, []byte(`{"chat":[]}`), 0644); err != nil {
			t.Fatalf("创建 chat 文件失败: %v", err)
		}
	}
	
	// 使用 ChatScanner 扫描
	chatScanner := scanner.NewChatScanner()
	chatScanner.SetBasePath(tempDir)
	
	stats, err := chatScanner.GetConversationStats()
	if err != nil {
		t.Fatalf("获取对话统计失败: %v", err)
	}
	
	// 验证总对话数 (3 工作区 * 2 对话)
	if stats.TotalConversations != 6 {
		t.Errorf("总对话数应该是 6，实际是 %d", stats.TotalConversations)
	}
	
	// 验证总消息数 (6 对话 * 3 消息)
	if stats.TotalMessages != 18 {
		t.Errorf("总消息数应该是 18，实际是 %d", stats.TotalMessages)
	}
	
	// 验证工作区数量
	if len(stats.WorkspaceBreakdown) != 3 {
		t.Errorf("工作区数量应该是 3，实际是 %d", len(stats.WorkspaceBreakdown))
	}
}

// TestScanCommand_ProgressTracking 测试进度跟踪
func TestScanCommand_ProgressTracking(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-progress")
	
	// 创建一些文件
	for i := 0; i < 10; i++ {
		createTestFile(t, tempDir, filepath.Join("files", string(rune('a'+i))+".txt"), generateTestContent(100))
	}
	
	// 创建工作区和 chat 文件
	wsPath := filepath.Join(tempDir, "workspace1")
	if err := os.MkdirAll(wsPath, 0755); err != nil {
		t.Fatalf("创建工作区目录失败: %v", err)
	}
	for i := 0; i < 5; i++ {
		chatFile := filepath.Join(wsPath, "conv"+string(rune('0'+i))+".chat")
		if err := os.WriteFile(chatFile, []byte(`{"executionId":"test","chat":[{"role":"human","content":"test"}],"metadata":{}}`), 0644); err != nil {
			t.Fatalf("创建 chat 文件失败: %v", err)
		}
	}
	
	// 跟踪进度更新
	var progressUpdates []types.ScanProgress
	callback := func(progress types.ScanProgress) {
		progressUpdates = append(progressUpdates, progress)
	}
	
	// 扫描对话
	chatScanner := scanner.NewChatScanner()
	chatScanner.SetBasePath(tempDir)
	_, err := chatScanner.ScanWorkspacesWithProgress(callback)
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	// 验证有进度更新
	if len(progressUpdates) == 0 {
		t.Error("应该有进度更新")
	}
	
	// 验证最后一个更新标记为完成
	if len(progressUpdates) > 0 {
		lastUpdate := progressUpdates[len(progressUpdates)-1]
		if !lastUpdate.IsComplete {
			t.Error("最后一个进度更新应该标记为完成")
		}
	}
	
	// 验证进度单调递增
	var prevFiles int
	var prevSize int64
	for i, update := range progressUpdates {
		if update.ScannedFiles < prevFiles {
			t.Errorf("进度更新 %d: ScannedFiles 不应该减少 (%d -> %d)", i, prevFiles, update.ScannedFiles)
		}
		if update.TotalSize < prevSize {
			t.Errorf("进度更新 %d: TotalSize 不应该减少 (%d -> %d)", i, prevSize, update.TotalSize)
		}
		prevFiles = update.ScannedFiles
		prevSize = update.TotalSize
	}
}

// TestScanCommand_EmptyStorage 测试空存储
func TestScanCommand_EmptyStorage(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-empty")
	
	// 使用 StorageDetector 扫描空目录
	detector := storage.NewStorageDetector()
	
	totalSize, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	
	if totalSize != 0 {
		t.Errorf("空目录大小应该是 0，实际是 %d", totalSize)
	}
	
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	if len(fileTypes) != 0 {
		t.Errorf("空目录应该没有文件，实际有 %d 个", len(fileTypes))
	}
	
	// 使用 ChatScanner 扫描空目录
	chatScanner := scanner.NewChatScanner()
	chatScanner.SetBasePath(tempDir)
	
	stats, err := chatScanner.GetConversationStats()
	if err != nil {
		t.Fatalf("获取对话统计失败: %v", err)
	}
	
	if stats.TotalConversations != 0 {
		t.Errorf("空目录对话数应该是 0，实际是 %d", stats.TotalConversations)
	}
}

// TestScanCommand_MixedContent 测试混合内容
func TestScanCommand_MixedContent(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-mixed")
	
	// 创建各种类型的文件
	files := map[string]struct {
		content  []byte
		expected types.FileType
	}{
		"app.log":             {generateTestContent(100), types.TypeLog},
		"logs/main.log":       {generateTestContent(200), types.TypeLog},
		"cache/data":          {generateTestContent(300), types.TypeCache},
		"file.tmp":            {generateTestContent(50), types.TypeTemp},
		"crashpad/crash":      {generateTestContent(75), types.TypeTemp},
		"index/vectors.lance": {generateTestContent(400), types.TypeIndex},
		"config.json":         {[]byte(`{}`), types.TypeConfig},
		"history/backup":      {generateTestContent(150), types.TypeBackup},
		"data.db":             {generateTestContent(500), types.TypeDatabase},
	}
	
	for path, info := range files {
		createTestFile(t, tempDir, path, info.content)
	}
	
	// 扫描并验证
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 验证每个文件的类型
	for path, info := range files {
		fullPath := filepath.Join(tempDir, path)
		ft, ok := fileTypes[fullPath]
		if !ok {
			t.Errorf("未检测到文件: %s", path)
			continue
		}
		if ft != info.expected {
			t.Errorf("文件 %s 类型应该是 %v，实际是 %v", path, info.expected, ft)
		}
	}
}

// TestScanCommand_SizeFormatting 测试大小格式化
func TestScanCommand_SizeFormatting(t *testing.T) {
	tests := []struct {
		bytes    int64
		expected string
	}{
		{0, "0 B"},
		{512, "512 B"},
		{1024, "1.00 KB"},
		{1536, "1.50 KB"},
		{1048576, "1.00 MB"},
		{1572864, "1.50 MB"},
		{1073741824, "1.00 GB"},
	}
	
	for _, tt := range tests {
		result := storage.FormatSize(tt.bytes)
		if result != tt.expected {
			t.Errorf("FormatSize(%d) = %s, want %s", tt.bytes, result, tt.expected)
		}
	}
}

// TestScanCommand_CleanableCalculation 测试可清理项计算
func TestScanCommand_CleanableCalculation(t *testing.T) {
	tempDir := createTempDir(t, "test-scan-cleanable")
	
	// 创建可清理的文件
	cleanableFiles := map[string]int64{
		"logs/main.log":  1000,
		"cache/data":     2000,
		"file.tmp":       500,
		"history/backup": 800,
	}
	
	// 创建不可清理的文件
	nonCleanableFiles := map[string]int64{
		"config.json":       100,
		"conversations.db":  5000,
	}
	
	var expectedCleanable int64
	for path, size := range cleanableFiles {
		createTestFile(t, tempDir, path, generateTestContent(int(size)))
		expectedCleanable += size
	}
	
	for path, size := range nonCleanableFiles {
		createTestFile(t, tempDir, path, generateTestContent(int(size)))
	}
	
	// 扫描并计算可清理大小
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	var actualCleanable int64
	for path, ft := range fileTypes {
		info, err := os.Stat(path)
		if err != nil {
			continue
		}
		
		// 可清理类型：日志、缓存、临时、历史
		switch ft {
		case types.TypeLog, types.TypeCache, types.TypeTemp, types.TypeBackup:
			actualCleanable += info.Size()
		}
	}
	
	if actualCleanable != expectedCleanable {
		t.Errorf("可清理大小应该是 %d，实际是 %d", expectedCleanable, actualCleanable)
	}
}
