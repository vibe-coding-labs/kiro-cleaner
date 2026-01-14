package storage_test

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

func TestPathFinder_getCommonPaths(t *testing.T) {
	// 通过 StorageDetector 间接测试 PathFinder
	sd := storage.NewStorageDetector()
	paths, err := sd.FindKiroPaths()
	if err != nil {
		t.Errorf("FindKiroPaths 失败: %v", err)
	}
	
	// 路径可能为空（如果 Kiro 未安装），但不应该出错
	_ = paths
}

func TestStorageDetector_pathExists(t *testing.T) {
	sd := storage.NewStorageDetector()
	
	// 测试存在的目录 - 通过 FindKiroPaths 间接测试
	paths, _ := sd.FindKiroPaths()
	for _, path := range paths {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			t.Errorf("FindKiroPaths 返回了不存在的路径: %s", path)
		}
	}
}

func TestStorageDetector_DetectFileTypes(t *testing.T) {
	sd := storage.NewStorageDetector()
	
	// 创建临时测试目录
	tempDir := filepath.Join(os.TempDir(), "kiro-cleaner-file-types-test")
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)
	
	// 创建测试文件
	testFiles := map[string]types.FileType{
		"test.db":         types.TypeDatabase,
		"config.json":     types.TypeConfig, 
		"app.log":         types.TypeLog,
		"temp.tmp":        types.TypeTemp,
		"image.jpg":       types.TypeImage,
		"backup.zip":      types.TypeBackup,
		"unknown.txt":     types.TypeUnknown,
	}
	
	for filename := range testFiles {
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
		
		if detectedType != expectedType {
			t.Errorf("文件 %s 类型检测错误: 期望 %v, 实际 %v", filename, expectedType, detectedType)
		}
	}
}

func TestStorageDetector_GetDirectorySize(t *testing.T) {
	sd := storage.NewStorageDetector()
	
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
	sd := storage.NewStorageDetector()
	
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
		result := storage.FormatSize(test.bytes)
		if result != test.expected {
			t.Errorf("格式化文件大小失败: 期望 %s, 实际 %s", test.expected, result)
		}
	}
}
