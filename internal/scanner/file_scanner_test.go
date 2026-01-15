package scanner

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ============================================
// 路径检测测试 (Requirement 1)
// ============================================

func TestPathDetection_NoPathExists(t *testing.T) {
	// 当 Kiro 路径不存在时，应返回空列表而不是错误
	detector := storage.NewStorageDetector()
	
	// 使用一个不存在的临时目录作为 HOME
	oldHome := os.Getenv("HOME")
	tempDir := createTempDir(t, "empty-home")
	os.Setenv("HOME", tempDir)
	defer os.Setenv("HOME", oldHome)
	
	paths, err := detector.FindKiroPaths()
	if err != nil {
		t.Errorf("不应返回错误: %v", err)
	}
	
	// 应该返回空列表
	if len(paths) != 0 {
		t.Errorf("应返回空路径列表，实际返回 %d 个路径", len(paths))
	}
}

func TestPathDetection_PathExists(t *testing.T) {
	detector := storage.NewStorageDetector()
	
	// 创建临时 HOME 目录
	tempDir := createTempDir(t, "test-home")
	oldHome := os.Getenv("HOME")
	os.Setenv("HOME", tempDir)
	defer os.Setenv("HOME", oldHome)
	
	// 创建模拟的 Kiro 目录（macOS 路径）
	kiroPath := filepath.Join(tempDir, "Library", "Application Support", "kiro")
	if err := os.MkdirAll(kiroPath, 0755); err != nil {
		t.Fatalf("创建 Kiro 目录失败: %v", err)
	}
	
	paths, err := detector.FindKiroPaths()
	if err != nil {
		t.Errorf("不应返回错误: %v", err)
	}
	
	// 应该找到路径
	if len(paths) == 0 {
		t.Error("应该找到 Kiro 路径")
	}
	
	// 验证路径是绝对路径
	for _, p := range paths {
		if !filepath.IsAbs(p) {
			t.Errorf("路径应该是绝对路径: %s", p)
		}
	}
}

// ============================================
// 文件类型检测测试 (Requirement 2)
// ============================================

func TestFileTypeDetection_Database(t *testing.T) {
	tempDir := createTempDir(t, "test-db")
	
	// 创建各种数据库文件
	dbFiles := []string{
		"test.db",
		"data.sqlite",
		"state.sqlite3",
		"cache.vscdb",
	}
	
	for _, name := range dbFiles {
		createTestFile(t, tempDir, name, []byte("db content"))
	}
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	for _, name := range dbFiles {
		path := filepath.Join(tempDir, name)
		ft, ok := fileTypes[path]
		if !ok {
			t.Errorf("未检测到文件: %s", name)
			continue
		}
		if ft != types.TypeDatabase {
			t.Errorf("文件 %s 应该是 TypeDatabase，实际是 %v", name, ft)
		}
	}
}

func TestFileTypeDetection_Chat(t *testing.T) {
	tempDir := createTempDir(t, "test-chat")
	
	// 创建 .chat 文件
	createTestFile(t, tempDir, "conversation.chat", []byte(`{"chat":[]}`))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	path := filepath.Join(tempDir, "conversation.chat")
	ft, ok := fileTypes[path]
	if !ok {
		t.Fatal("未检测到 .chat 文件")
	}
	if ft != types.TypeDatabase {
		t.Errorf(".chat 文件应该是 TypeDatabase，实际是 %v", ft)
	}
}

func TestFileTypeDetection_Log(t *testing.T) {
	tempDir := createTempDir(t, "test-log")
	
	// 创建日志文件
	createTestFile(t, tempDir, "app.log", []byte("log content"))
	createTestFile(t, tempDir, "logs/main.log", []byte("log content"))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 检查 .log 扩展名
	logPath := filepath.Join(tempDir, "app.log")
	if ft, ok := fileTypes[logPath]; !ok || ft != types.TypeLog {
		t.Errorf("app.log 应该是 TypeLog，实际是 %v", ft)
	}
	
	// 检查 /logs/ 目录下的文件
	logsPath := filepath.Join(tempDir, "logs", "main.log")
	if ft, ok := fileTypes[logsPath]; !ok || ft != types.TypeLog {
		t.Errorf("logs/main.log 应该是 TypeLog，实际是 %v", ft)
	}
}

func TestFileTypeDetection_Temp(t *testing.T) {
	tempDir := createTempDir(t, "test-temp")
	
	// 创建临时文件
	createTestFile(t, tempDir, "file.tmp", []byte("temp"))
	createTestFile(t, tempDir, "file.temp", []byte("temp"))
	createTestFile(t, tempDir, "crashpad/crash", []byte("crash"))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 检查 .tmp 扩展名
	tmpPath := filepath.Join(tempDir, "file.tmp")
	if ft, ok := fileTypes[tmpPath]; !ok || ft != types.TypeTemp {
		t.Errorf("file.tmp 应该是 TypeTemp，实际是 %v", ft)
	}
	
	// 检查 .temp 扩展名
	tempPath := filepath.Join(tempDir, "file.temp")
	if ft, ok := fileTypes[tempPath]; !ok || ft != types.TypeTemp {
		t.Errorf("file.temp 应该是 TypeTemp，实际是 %v", ft)
	}
	
	// 检查 crashpad 目录
	crashPath := filepath.Join(tempDir, "crashpad", "crash")
	if ft, ok := fileTypes[crashPath]; !ok || ft != types.TypeTemp {
		t.Errorf("crashpad/crash 应该是 TypeTemp，实际是 %v", ft)
	}
}

func TestFileTypeDetection_Cache(t *testing.T) {
	tempDir := createTempDir(t, "test-cache")
	
	// 创建缓存文件
	createTestFile(t, tempDir, "cache/data", []byte("cache"))
	createTestFile(t, tempDir, "cacheddata/file", []byte("cached"))
	createTestFile(t, tempDir, "gpucache/gpu", []byte("gpu"))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	cacheFiles := []string{
		filepath.Join(tempDir, "cache", "data"),
		filepath.Join(tempDir, "cacheddata", "file"),
		filepath.Join(tempDir, "gpucache", "gpu"),
	}
	
	for _, path := range cacheFiles {
		if ft, ok := fileTypes[path]; !ok || ft != types.TypeCache {
			t.Errorf("%s 应该是 TypeCache，实际是 %v", path, ft)
		}
	}
}

func TestFileTypeDetection_Index(t *testing.T) {
	tempDir := createTempDir(t, "test-index")
	
	// 创建索引文件
	createTestFile(t, tempDir, "index/vectors.db", []byte("index"))
	createTestFile(t, tempDir, "lancedb/data.lance", []byte("lance"))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 检查 /index/ 目录
	indexPath := filepath.Join(tempDir, "index", "vectors.db")
	if ft, ok := fileTypes[indexPath]; !ok || ft != types.TypeIndex {
		t.Errorf("index/vectors.db 应该是 TypeIndex，实际是 %v", ft)
	}
	
	// 检查 lancedb 目录
	lancePath := filepath.Join(tempDir, "lancedb", "data.lance")
	if ft, ok := fileTypes[lancePath]; !ok || ft != types.TypeIndex {
		t.Errorf("lancedb/data.lance 应该是 TypeIndex，实际是 %v", ft)
	}
}

func TestFileTypeDetection_Config(t *testing.T) {
	tempDir := createTempDir(t, "test-config")
	
	// 创建配置文件
	configFiles := []string{
		"config.json",
		"settings.json",
		"mcp.json",
	}
	
	for _, name := range configFiles {
		createTestFile(t, tempDir, name, []byte(`{}`))
	}
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	for _, name := range configFiles {
		path := filepath.Join(tempDir, name)
		if ft, ok := fileTypes[path]; !ok || ft != types.TypeConfig {
			t.Errorf("%s 应该是 TypeConfig，实际是 %v", name, ft)
		}
	}
}

func TestFileTypeDetection_History(t *testing.T) {
	tempDir := createTempDir(t, "test-history")
	
	// 创建历史文件
	createTestFile(t, tempDir, "history/file1", []byte("history"))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	historyPath := filepath.Join(tempDir, "history", "file1")
	if ft, ok := fileTypes[historyPath]; !ok || ft != types.TypeBackup {
		t.Errorf("history/file1 应该是 TypeBackup，实际是 %v", ft)
	}
}

// ============================================
// 大小统计测试 (Requirement 3)
// ============================================

func TestSizeAggregation_TotalSize(t *testing.T) {
	tempDir := createTempDir(t, "test-size")
	
	// 创建已知大小的文件
	sizes := []int{100, 200, 300, 400}
	totalExpected := int64(0)
	
	for i, size := range sizes {
		content := generateTestContent(size)
		createTestFile(t, tempDir, filepath.Join("files", string(rune('a'+i))+".txt"), content)
		totalExpected += int64(size)
	}
	
	detector := storage.NewStorageDetector()
	totalSize, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	
	if totalSize != totalExpected {
		t.Errorf("总大小应该是 %d，实际是 %d", totalExpected, totalSize)
	}
}

func TestSizeAggregation_ByType(t *testing.T) {
	tempDir := createTempDir(t, "test-size-type")
	
	// 创建不同类型的文件
	createTestFile(t, tempDir, "app.log", generateTestContent(100))
	createTestFile(t, tempDir, "cache/data", generateTestContent(200))
	createTestFile(t, tempDir, "file.tmp", generateTestContent(50))
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 按类型统计大小
	typeSizes := make(map[types.FileType]int64)
	for path, ft := range fileTypes {
		info, err := os.Stat(path)
		if err != nil {
			continue
		}
		typeSizes[ft] += info.Size()
	}
	
	// 验证日志文件大小
	if typeSizes[types.TypeLog] != 100 {
		t.Errorf("日志文件大小应该是 100，实际是 %d", typeSizes[types.TypeLog])
	}
	
	// 验证缓存文件大小
	if typeSizes[types.TypeCache] != 200 {
		t.Errorf("缓存文件大小应该是 200，实际是 %d", typeSizes[types.TypeCache])
	}
	
	// 验证临时文件大小
	if typeSizes[types.TypeTemp] != 50 {
		t.Errorf("临时文件大小应该是 50，实际是 %d", typeSizes[types.TypeTemp])
	}
}

func TestFormatSize(t *testing.T) {
	tests := []struct {
		bytes    int64
		expected string
	}{
		{0, "0 B"},
		{100, "100 B"},
		{1023, "1023 B"},
		{1024, "1.00 KB"},
		{1536, "1.50 KB"},
		{1048576, "1.00 MB"},
		{1572864, "1.50 MB"},
		{1073741824, "1.00 GB"},
		{1610612736, "1.50 GB"},
	}
	
	for _, tt := range tests {
		result := storage.FormatSize(tt.bytes)
		if result != tt.expected {
			t.Errorf("FormatSize(%d) = %s, want %s", tt.bytes, result, tt.expected)
		}
	}
}

// ============================================
// 边界情况测试 (Requirement 8)
// ============================================

func TestEmptyDirectory(t *testing.T) {
	tempDir := createTempDir(t, "test-empty")
	
	detector := storage.NewStorageDetector()
	
	// 空目录大小应该是 0
	size, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	if size != 0 {
		t.Errorf("空目录大小应该是 0，实际是 %d", size)
	}
	
	// 空目录文件类型应该是空 map
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	if len(fileTypes) != 0 {
		t.Errorf("空目录应该没有文件类型，实际有 %d 个", len(fileTypes))
	}
}

func TestZeroSizeFile(t *testing.T) {
	tempDir := createTempDir(t, "test-zero")
	
	// 创建零大小文件
	createTestFile(t, tempDir, "empty.log", []byte{})
	
	detector := storage.NewStorageDetector()
	
	// 应该能检测到文件类型
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	path := filepath.Join(tempDir, "empty.log")
	if _, ok := fileTypes[path]; !ok {
		t.Error("应该能检测到零大小文件")
	}
	
	// 大小应该是 0
	size, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	if size != 0 {
		t.Errorf("零大小文件的目录大小应该是 0，实际是 %d", size)
	}
}

func TestSpecialCharacterPath(t *testing.T) {
	tempDir := createTempDir(t, "test-special")
	
	// 创建包含特殊字符的文件
	specialNames := []string{
		"file with spaces.log",
		"文件.log",
		"file-with-dash.log",
		"file_with_underscore.log",
	}
	
	for _, name := range specialNames {
		createTestFile(t, tempDir, name, []byte("content"))
	}
	
	detector := storage.NewStorageDetector()
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("检测文件类型失败: %v", err)
	}
	
	// 应该能检测到所有文件
	if len(fileTypes) != len(specialNames) {
		t.Errorf("应该检测到 %d 个文件，实际检测到 %d 个", len(specialNames), len(fileTypes))
	}
}

func TestDirectoryWithOnlySubdirs(t *testing.T) {
	tempDir := createTempDir(t, "test-subdirs")
	
	// 只创建子目录，不创建文件
	subdirs := []string{"dir1", "dir2", "dir3"}
	for _, dir := range subdirs {
		if err := os.MkdirAll(filepath.Join(tempDir, dir), 0755); err != nil {
			t.Fatalf("创建子目录失败: %v", err)
		}
	}
	
	detector := storage.NewStorageDetector()
	
	// 大小应该是 0
	size, err := detector.GetDirectorySize(tempDir)
	if err != nil {
		t.Fatalf("获取目录大小失败: %v", err)
	}
	if size != 0 {
		t.Errorf("只有子目录的目录大小应该是 0，实际是 %d", size)
	}
}

// ============================================
// 错误处理测试 (Requirement 7)
// ============================================

func TestPermissionError(t *testing.T) {
	// 跳过 root 用户（root 可以访问任何文件）
	if os.Getuid() == 0 {
		t.Skip("跳过 root 用户的权限测试")
	}
	
	tempDir := createTempDir(t, "test-perm")
	
	// 创建一个无法访问的目录
	restrictedDir := filepath.Join(tempDir, "restricted")
	if err := os.MkdirAll(restrictedDir, 0000); err != nil {
		t.Fatalf("创建受限目录失败: %v", err)
	}
	defer os.Chmod(restrictedDir, 0755) // 清理时恢复权限
	
	// 创建一个可访问的文件
	createTestFile(t, tempDir, "accessible.log", []byte("content"))
	
	detector := storage.NewStorageDetector()
	
	// 应该能继续扫描，不应该崩溃
	fileTypes, err := detector.DetectFileTypes(tempDir)
	if err != nil {
		t.Fatalf("不应该返回错误: %v", err)
	}
	
	// 应该能检测到可访问的文件
	accessiblePath := filepath.Join(tempDir, "accessible.log")
	if _, ok := fileTypes[accessiblePath]; !ok {
		t.Error("应该能检测到可访问的文件")
	}
}

func TestNonExistentPath(t *testing.T) {
	detector := storage.NewStorageDetector()
	
	// 扫描不存在的路径
	nonExistent := "/path/that/does/not/exist/at/all"
	
	// 应该返回空结果，不应该崩溃
	fileTypes, err := detector.DetectFileTypes(nonExistent)
	if err == nil {
		// 如果没有错误，应该返回空 map
		if len(fileTypes) != 0 {
			t.Errorf("不存在的路径应该返回空结果，实际返回 %d 个", len(fileTypes))
		}
	}
	// 如果有错误也是可以接受的
}
