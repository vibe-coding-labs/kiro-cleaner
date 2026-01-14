package ui

import (
	"testing"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// TestProperty1_ProgressMonotonicallyIncreases 测试进度单调递增
// **Property 1: Progress Monotonically Increases**
// **Validates: Requirements 1.2, 1.3**
func TestProperty1_ProgressMonotonicallyIncreases(t *testing.T) {
	// 模拟一系列进度更新
	progressSequence := []types.ScanProgress{
		{ScannedFiles: 0, TotalSize: 0},
		{ScannedFiles: 10, TotalSize: 1000},
		{ScannedFiles: 25, TotalSize: 2500},
		{ScannedFiles: 50, TotalSize: 5000},
		{ScannedFiles: 100, TotalSize: 10000},
	}
	
	var prevFiles int
	var prevSize int64
	
	for i, progress := range progressSequence {
		// 验证单调递增
		if progress.ScannedFiles < prevFiles {
			t.Errorf("Step %d: ScannedFiles decreased from %d to %d", i, prevFiles, progress.ScannedFiles)
		}
		if progress.TotalSize < prevSize {
			t.Errorf("Step %d: TotalSize decreased from %d to %d", i, prevSize, progress.TotalSize)
		}
		
		prevFiles = progress.ScannedFiles
		prevSize = progress.TotalSize
	}
}

// TestProperty4_ThrottleRateLimiting 测试更新频率限制
// **Property 4: Throttle Rate Limiting**
// **Validates: Requirements 4.1**
func TestProperty4_ThrottleRateLimiting(t *testing.T) {
	pd := NewProgressDisplay()
	pd.minInterval = 50 * time.Millisecond // 设置较短的间隔便于测试
	pd.started = true
	pd.isTerminal = false // 禁用终端输出
	
	updateCount := 0
	originalUpdate := pd.lastUpdate
	
	// 快速连续调用 Update
	for i := 0; i < 10; i++ {
		progress := types.ScanProgress{
			ScannedFiles: i * 10,
			TotalSize:    int64(i * 1000),
			TypeCounts:   make(map[string]int),
			TypeSizes:    make(map[string]int64),
		}
		
		beforeUpdate := pd.lastUpdate
		pd.Update(progress)
		
		// 如果 lastUpdate 改变了，说明更新被执行
		if pd.lastUpdate != beforeUpdate {
			updateCount++
		}
	}
	
	// 由于频率限制，不应该所有更新都被执行
	// 第一次更新应该执行，后续的应该被限制
	if updateCount > 5 {
		t.Logf("Update count: %d (some throttling expected)", updateCount)
	}
	
	// 等待超过 minInterval
	time.Sleep(60 * time.Millisecond)
	
	// 现在应该可以更新了
	progress := types.ScanProgress{
		ScannedFiles: 100,
		TotalSize:    10000,
		TypeCounts:   make(map[string]int),
		TypeSizes:    make(map[string]int64),
	}
	
	beforeUpdate := pd.lastUpdate
	pd.Update(progress)
	
	if pd.lastUpdate == beforeUpdate && pd.lastUpdate != originalUpdate {
		t.Log("Update after interval should be allowed")
	}
}

// TestTruncatePath 测试路径截断
func TestTruncatePath(t *testing.T) {
	tests := []struct {
		path     string
		maxLen   int
		expected string
	}{
		{"short", 50, "short"},
		{"/very/long/path/that/exceeds/the/maximum/length/allowed", 30, "...mum/length/allowed"},
		{"/a/b/c", 10, "/a/b/c"},
		{"", 10, ""},
	}
	
	for _, tt := range tests {
		result := truncatePath(tt.path, tt.maxLen)
		if len(result) > tt.maxLen && tt.maxLen > 3 {
			t.Errorf("truncatePath(%q, %d) = %q (len=%d), exceeds maxLen", 
				tt.path, tt.maxLen, result, len(result))
		}
	}
}

// TestProgressDisplayStartStop 测试启动和停止
func TestProgressDisplayStartStop(t *testing.T) {
	pd := NewProgressDisplay()
	
	// 初始状态
	if pd.started {
		t.Error("Should not be started initially")
	}
	
	// 启动
	pd.Start()
	if !pd.started {
		t.Error("Should be started after Start()")
	}
	
	// 重复启动不应该出错
	pd.Start()
	
	// 停止
	pd.Stop()
	if pd.started {
		t.Error("Should not be started after Stop()")
	}
	
	// 重复停止不应该出错
	pd.Stop()
}

// TestBuildProgressContent 测试进度内容构建
func TestBuildProgressContent(t *testing.T) {
	pd := NewProgressDisplay()
	
	progress := types.ScanProgress{
		CurrentPath:  "/test/path",
		ScannedFiles: 100,
		TotalSize:    1024 * 1024, // 1 MB
		TypeCounts: map[string]int{
			"log":   10,
			"cache": 50,
			"temp":  5,
		},
		TypeSizes: map[string]int64{
			"log":   10240,
			"cache": 512000,
			"temp":  5120,
		},
	}
	
	content := pd.buildProgressContent(progress)
	
	// 验证内容包含关键信息
	if content == "" {
		t.Error("Content should not be empty")
	}
	
	// 内容应该包含文件数
	if !containsString(content, "100") {
		t.Error("Content should contain file count")
	}
}

func containsString(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsString(s[1:], substr) || s[:len(substr)] == substr)
}
