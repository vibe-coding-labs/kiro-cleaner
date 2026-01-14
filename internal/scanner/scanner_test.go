package scanner

import (
	"testing"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// TestFileScannerWithoutCallback 测试无回调时正常工作
func TestFileScannerWithoutCallback(t *testing.T) {
	fs := NewFileScanner()
	
	// 无回调应该正常工作（不会 panic）
	_, err := fs.ScanWithProgress(nil)
	if err != nil {
		// 可能找不到 Kiro 路径，这是正常的
		t.Logf("Scan returned error (expected if Kiro not installed): %v", err)
	}
}

// TestProgressMonotonicallyIncreases 测试进度单调递增
func TestProgressMonotonicallyIncreases(t *testing.T) {
	var prevFiles int
	var prevSize int64
	var callCount int
	
	callback := func(progress types.ScanProgress) {
		callCount++
		if progress.ScannedFiles < prevFiles {
			t.Errorf("ScannedFiles decreased: %d -> %d", prevFiles, progress.ScannedFiles)
		}
		if progress.TotalSize < prevSize {
			t.Errorf("TotalSize decreased: %d -> %d", prevSize, progress.TotalSize)
		}
		prevFiles = progress.ScannedFiles
		prevSize = progress.TotalSize
	}

	fs := NewFileScanner()
	_, _ = fs.ScanWithProgress(callback)
	
	t.Logf("Progress callback was called %d times", callCount)
}

// TestScanProgressInitialization 测试 ScanProgress 初始化
func TestScanProgressInitialization(t *testing.T) {
	progress := types.NewScanProgress()
	
	if progress.TypeCounts == nil {
		t.Error("TypeCounts should be initialized")
	}
	if progress.TypeSizes == nil {
		t.Error("TypeSizes should be initialized")
	}
	if progress.Phase != "files" {
		t.Errorf("Phase should be 'files', got '%s'", progress.Phase)
	}
	if progress.IsComplete {
		t.Error("IsComplete should be false initially")
	}
}

// TestFileTypeToString 测试文件类型转换
func TestFileTypeToString(t *testing.T) {
	tests := []struct {
		fileType types.FileType
		expected string
	}{
		{types.TypeLog, "log"},
		{types.TypeCache, "cache"},
		{types.TypeTemp, "temp"},
		{types.TypeIndex, "index"},
		{types.TypeBackup, "history"},
		{types.TypeDatabase, "database"},
		{types.TypeConfig, "config"},
		{types.TypeUnknown, "other"},
	}
	
	for _, tt := range tests {
		result := fileTypeToString(tt.fileType)
		if result != tt.expected {
			t.Errorf("fileTypeToString(%v) = %s, want %s", tt.fileType, result, tt.expected)
		}
	}
}
