package integration

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/backup"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/cleaner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/database"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// TestFileScanning 集成测试：文件扫描
func TestFileScanning(t *testing.T) {
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-integration-scan-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件结构
	createTestFileStructure(t, tempDir)
	
	// 创建扫描器
	_ = storage.NewStorageDetector()
	fileScanner := scanner.NewFileScanner()
	
	// 执行扫描
	files, err := fileScanner.Scan()
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	// 验证扫描结果
	if len(files) == 0 {
		t.Error("扫描结果应该包含文件")
	}
	
	// 验证存储统计
	stats, err := fileScanner.GetStorageStats()
	if err != nil {
		t.Fatalf("获取存储统计失败: %v", err)
	}
	
	if stats.TotalSize == 0 {
		t.Error("存储统计应该显示非零大小")
	}
}

// TestDatabaseOperations 集成测试：数据库操作
func TestDatabaseOperations(t *testing.T) {
	// 创建临时数据库文件
	dbPath := filepath.Join(os.TempDir(), "kiro-cleaner-integration-db-test.db")
	os.Remove(dbPath) // 确保文件不存在
	defer os.Remove(dbPath)
	
	// 创建数据库管理器
	dbManager := database.NewDatabaseManager()
	
	// 连接数据库
	err := dbManager.Connect(dbPath)
	if err != nil {
		t.Fatalf("连接数据库失败: %v", err)
	}
	defer dbManager.Close()
	
	// 创建表
	err = dbManager.CreateTables()
	if err != nil {
		t.Fatalf("创建数据表失败: %v", err)
	}
	
	// 测试查询对话
	conversations, err := dbManager.GetAllConversations()
	if err != nil {
		t.Fatalf("查询对话失败: %v", err)
	}
	
	// 初始状态应该为空
	if len(conversations) != 0 {
		t.Error("初始数据库应该为空")
	}
}

// TestCleanupWorkflow 集成测试：完整清理工作流程
func TestCleanupWorkflow(t *testing.T) {
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-integration-cleanup-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件
	createCleanupTestFiles(t, tempDir)
	
	// 创建组件
	fileScanner := scanner.NewFileScanner()
	dbManager := database.NewDatabaseManager()
	backupConfig := &types.BackupConfig{
		Enabled:        false, // 测试时禁用备份
		Path:           filepath.Join(tempDir, "backups"),
		MaxBackups:     3,
		Compressed:     true,
		AutoCleanup:    false,
	}
	backupMgr := backup.NewBackupManager(backupConfig)
	prompter := ui.NewSimplePrompter(os.Stdout)
	
	// 创建清理引擎
	engine := cleaner.NewCleanupEngine(fileScanner, dbManager, backupMgr, prompter)
	
	// 设置清理规则
	rules := []types.CleanupRule{
		{
			Name:        "temp_file_cleanup",
			Description: "清理临时文件",
			Priority:    1,
			Enabled:     true,
			Conditions: []types.Condition{
				{
					Type:     "file_type",
					Field:    "file_type",
					Operator: "=",
					Value:    "temp",
				},
			},
			Actions: []types.Action{
				{
					Type:   "delete",
					Backup: false,
				},
			},
		},
	}
	
	err := engine.SetRules(rules)
	if err != nil {
		t.Fatalf("设置清理规则失败: %v", err)
	}
	
	// 扫描文件
	files, err := fileScanner.Scan()
	if err != nil {
		t.Fatalf("扫描失败: %v", err)
	}
	
	// 预览清理
	preview, err := engine.Preview(files)
	if err != nil {
		t.Fatalf("预览清理失败: %v", err)
	}
	
	// 预览可能为空（取决于扫描到的文件类型）
	_ = preview
	
	// 执行清理（预览模式）
	result, err := engine.Execute(files, true) // dry-run
	if err != nil {
		t.Fatalf("执行清理失败: %v", err)
	}
	
	if !result.Success {
		t.Error("预览模式应该总是成功")
	}
}

// TestBackupOperations 集成测试：备份操作
func TestBackupOperations(t *testing.T) {
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-integration-backup-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件
	testFiles := []string{
		"test1.txt",
		"test2.db",
		"test3.log",
	}
	
	var fileInfos []types.FileInfo
	for _, filename := range testFiles {
		filePath := filepath.Join(tempDir, filename)
		os.WriteFile(filePath, []byte("test content"), 0644)
		
		fileInfo := types.FileInfo{
			Path:     filePath,
			Name:     filename,
			Size:     12,
			FileType: types.TypeUnknown,
		}
		fileInfos = append(fileInfos, fileInfo)
	}
	
	// 创建备份管理器
	backupConfig := &types.BackupConfig{
		Enabled:     true,
		Path:        filepath.Join(tempDir, "backups"),
		MaxBackups:  3,
		Compressed:  true,
		AutoCleanup: false,
	}
	backupMgr := backup.NewBackupManager(backupConfig)
	
	// 创建备份
	backupID, err := backupMgr.CreateBackup(fileInfos)
	if err != nil {
		t.Fatalf("创建备份失败: %v", err)
	}
	
	if backupID == "" {
		t.Error("备份ID不应为空")
	}
	
	// 列出备份
	backups, err := backupMgr.ListBackups()
	if err != nil {
		t.Fatalf("列出备份失败: %v", err)
	}
	
	if len(backups) == 0 {
		t.Error("应该至少有一个备份")
	}
}

// 辅助函数：创建测试文件结构
func createTestFileStructure(t *testing.T, baseDir string) {
	t.Helper()
	
	// 创建子目录
	subDirs := []string{"cache", "logs", "temp"}
	for _, subDir := range subDirs {
		dirPath := filepath.Join(baseDir, subDir)
		os.MkdirAll(dirPath, 0755)
	}
	
	// 创建测试文件
	testFiles := map[string]string{
		"conversations.db": baseDir,
		"config.json":      baseDir,
		"model_cache.dat":  filepath.Join(baseDir, "cache"),
		"app.log":          filepath.Join(baseDir, "logs"),
		"session.tmp":      filepath.Join(baseDir, "temp"),
	}
	
	for filename, dir := range testFiles {
		filePath := filepath.Join(dir, filename)
		content := []byte("test content for " + filename)
		if err := os.WriteFile(filePath, content, 0644); err != nil {
			t.Fatalf("创建测试文件失败: %v", err)
		}
	}
}

// 辅助函数：创建清理测试文件
func createCleanupTestFiles(t *testing.T, baseDir string) {
	t.Helper()
	
	// 创建临时文件
	tempFile := filepath.Join(baseDir, "temp_file.tmp")
	if err := os.WriteFile(tempFile, []byte("temp content"), 0644); err != nil {
		t.Fatalf("创建临时文件失败: %v", err)
	}
	
	// 创建一个旧的日志文件
	logFile := filepath.Join(baseDir, "old.log")
	// 模拟7天前的文件
	os.Chtimes(logFile, time.Now().AddDate(0, 0, -7), time.Now().AddDate(0, 0, -7))
	if err := os.WriteFile(logFile, []byte("old log content"), 0644); err != nil {
		t.Fatalf("创建日志文件失败: %v", err)
	}
}