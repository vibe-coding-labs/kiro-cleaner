package storage

import (
	"os"
	"path/filepath"
	"testing"
)

func TestPathFinder_getCommonPaths(t *testing.T) {
	pf := NewPathFinder()
	paths := pf.getCommonPaths()
	
	// 应该返回至少一个路径
	if len(paths) == 0 {
		t.Error("getCommonPaths 应该返回至少一个路径")
	}
	
	// 所有路径都应该是绝对路径
	for _, path := range paths {
		if !filepath.IsAbs(path) {
			t.Errorf("路径应该是绝对路径: %s", path)
		}
	}
}

func TestStorageDetector_pathExists(t *testing.T) {
	sd := NewStorageDetector()
	
	// 测试存在的目录
	if !sd.pathExists(".") {
		t.Error("当前目录应该存在")
	}
	
	// 测试不存在的目录
	if sd.pathExists("/non/existent/path") {
		t.Error("不存在的路径不应该被检测为存在")
	}
}

func TestStorageDetector_DetectFileTypes(t *testing.T) {
	sd := NewStorageDetector()
	
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-file-types-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件
	testFiles := map[string]string{
		"test.db":         "database",
		"config.json":     "config", 
		"app.log":         "log",
		"temp.tmp":        "temp",
		"cache.dat":       "cache",
		"image.jpg":       "image",
		"backup.zip":      "backup",
		"unknown.txt":     "unknown",
	}
	
	for filename, expectedType := range testFiles {
		filePath := filepath.Join(tempDir, filename)
		os.WriteFile(filePath, []byte("test content"), 0644)
	}
	
	// 检测文件类型
	fileTypes, err := sd.DetectFileTypes(tempDir)
	if err != nil {
		t.Errorf("检测文件类型失败: %v", err)
		return
	}
	
	// 验证检测结果
	for filename, expectedType := range testFiles {
		filePath := filepath.Join(tempDir, filename)
		detectedType, exists := fileTypes[filePath]
		
		if !exists {
			t.Errorf("文件 %s 未被检测", filename)
			continue
		}
		
		typeName := getFileTypeName(detectedType)
		if typeName != expectedType {
			t.Errorf("文件 %s 类型检测错误: 期望 %s, 实际 %s", filename, expectedType, typeName)
		}
	}
}

func TestStorageDetector_GetDirectorySize(t *testing.T) {
	sd := NewStorageDetector()
	
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-size-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件
	testContent := []byte("test content for size calculation")
	for i := 0; i < 3; i++ {
		filename := filepath.Join(tempDir, fmt.Sprintf("file%d.txt", i))
		os.WriteFile(filename, testContent, 0644)
	}
	
	// 计算目录大小
	size, err := sd.GetDirectorySize(tempDir)
	if err != nil {
		t.Errorf("获取目录大小失败: %v", err)
		return
	}
	
	expectedSize := int64(len(testContent) * 3)
	if size != expectedSize {
		t.Errorf("目录大小计算错误: 期望 %d, 实际 %d", expectedSize, size)
	}
}

func TestStorageDetector_ValidateKiroPath(t *testing.T) {
	sd := NewStorageDetector()
	
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-validate-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 测试没有关键文件的目录
	valid, err := sd.ValidateKiroPath(tempDir)
	if err != nil {
		t.Errorf("验证路径失败: %v", err)
	}
	if valid {
		t.Error("没有关键文件的目录不应该被验证为有效")
	}
	
	// 创建关键文件
	keyFiles := []string{"conversations.db", "config.json"}
	for _, keyFile := range keyFiles {
		filePath := filepath.Join(tempDir, keyFile)
		os.WriteFile(filePath, []byte("test"), 0644)
	}
	
	// 测试有关键文件的目录
	valid, err = sd.ValidateKiroPath(tempDir)
	if err != nil {
		t.Errorf("验证路径失败: %v", err)
	}
	if !valid {
		t.Error("有关键文件的目录应该被验证为有效")
	}
}

func TestFormatSize(t *testing.T) {
	tests := []struct {
		bytes    int64
		expected string
	}{
		{1024, "1.00 KB"},
		{1024 * 1024, "1.00 MB"},
		{1024 * 1024 * 1024, "1.00 GB"},
		{512, "512 B"},
		{1536, "1.50 KB"},
	}
	
	for _, test := range tests {
		result := FormatSize(test.bytes)
		if result != test.expected {
			t.Errorf("格式化文件大小失败: 期望 %s, 实际 %s", test.expected, result)
		}
	}
}

// 辅助函数：获取文件类型名称
func getFileTypeName(fileType FileType) string {
	switch fileType {
	case TypeDatabase:
		return "database"
	case TypeConfig:
		return "config"
	case TypeCache:
		return "cache"
	case TypeLog:
		return "log"
	case TypeTemp:
		return "temp"
	case TypeImage:
		return "image"
	case TypeBackup:
		return "backup"
	default:
		return "unknown"
	}
}