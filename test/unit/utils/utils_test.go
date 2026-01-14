package utils_test

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/utils"
)

func TestFileOps_EnsureDir(t *testing.T) {
	fo := utils.NewFileOps()
	testDir := filepath.Join(os.TempDir(), "kiro-cleaner-test")
	
	// 清理测试目录
	defer os.RemoveAll(testDir)
	
	// 测试创建目录
	err := fo.EnsureDir(testDir)
	if err != nil {
		t.Errorf("创建目录失败: %v", err)
	}
	
	// 检查目录是否存在
	if _, err := os.Stat(testDir); os.IsNotExist(err) {
		t.Error("目录未创建")
	}
}

func TestFileOps_IsEmptyDir(t *testing.T) {
	fo := utils.NewFileOps()
	testDir := filepath.Join(os.TempDir(), "kiro-cleaner-empty-test")
	
	// 清理测试目录
	defer os.RemoveAll(testDir)
	
	// 创建空目录
	os.MkdirAll(testDir, 0755)
	
	// 测试空目录检查
	isEmpty, err := fo.IsEmptyDir(testDir)
	if err != nil {
		t.Errorf("检查空目录失败: %v", err)
	}
	if !isEmpty {
		t.Error("空目录检测失败")
	}
	
	// 创建测试文件
	testFile := filepath.Join(testDir, "test.txt")
	os.WriteFile(testFile, []byte("test"), 0644)
	
	// 测试非空目录检查
	isEmpty, err = fo.IsEmptyDir(testDir)
	if err != nil {
		t.Errorf("检查非空目录失败: %v", err)
	}
	if isEmpty {
		t.Error("非空目录检测失败")
	}
}

func TestFileOps_GetFileAge(t *testing.T) {
	fo := utils.NewFileOps()
	testFile := filepath.Join(os.TempDir(), "kiro-cleaner-age-test.txt")
	
	// 清理测试文件
	defer os.Remove(testFile)
	
	// 创建测试文件
	os.WriteFile(testFile, []byte("test"), 0644)
	
	// 测试获取文件年龄
	age, err := fo.GetFileAge(testFile)
	if err != nil {
		t.Errorf("获取文件年龄失败: %v", err)
	}
	
	// 文件年龄应该很小（刚创建）
	if age > time.Second {
		t.Error("文件年龄检测失败")
	}
}

func TestFileOps_IsFileOlderThan(t *testing.T) {
	fo := utils.NewFileOps()
	testFile := filepath.Join(os.TempDir(), "kiro-cleaner-older-test.txt")
	
	// 清理测试文件
	defer os.Remove(testFile)
	
	// 创建测试文件
	os.WriteFile(testFile, []byte("test"), 0644)
	
	// 测试文件是否比1秒旧
	older, err := fo.IsFileOlderThan(testFile, time.Second)
	if err != nil {
		t.Errorf("检查文件年龄失败: %v", err)
	}
	if older {
		t.Error("新创建的文件不应该比1秒旧")
	}
	
	// 测试文件是否比1纳秒旧
	older, err = fo.IsFileOlderThan(testFile, time.Nanosecond)
	if err != nil {
		t.Errorf("检查文件年龄失败: %v", err)
	}
	if !older {
		t.Error("新创建的文件应该比1纳秒旧")
	}
}

func TestTimeUtil_FormatDuration(t *testing.T) {
	tu := utils.NewTimeUtil()
	
	tests := []struct {
		duration time.Duration
		expected string
	}{
		{time.Second, "1秒"},
		{time.Minute, "1分钟"},
		{time.Hour, "1小时"},
		{24 * time.Hour, "1天"},
		{90 * time.Second, "1分钟"}, // 不足1分钟的会向上取整
	}
	
	for _, test := range tests {
		result := tu.FormatDuration(test.duration)
		if result != test.expected {
			t.Errorf("格式化持续时间失败: 期望 %s, 实际 %s", test.expected, result)
		}
	}
}

func TestTimeUtil_ParseDuration(t *testing.T) {
	tu := utils.NewTimeUtil()
	
	tests := []struct {
		input    string
		expected time.Duration
		hasError bool
	}{
		{"1h", time.Hour, false},
		{"24h", 24 * time.Hour, false},
		{"168h", 168 * time.Hour, false},
		{"720h", 720 * time.Hour, false},
		{"7d", 7 * 24 * time.Hour, false},
		{"30d", 30 * 24 * time.Hour, false},
		{"invalid", 0, true},
	}
	
	for _, test := range tests {
		result, err := tu.ParseDuration(test.input)
		if test.hasError {
			if err == nil {
				t.Errorf("期望解析失败但成功了: %s", test.input)
			}
		} else {
			if err != nil {
				t.Errorf("解析失败: %v", err)
			}
			if result != test.expected {
				t.Errorf("解析持续时间失败: 期望 %v, 实际 %v", test.expected, result)
			}
		}
	}
}

func TestErrorUtil_IsPermissionError(t *testing.T) {
	eu := utils.NewErrorUtil()
	
	// 测试正常错误
	normalErr := os.ErrPermission
	if !eu.IsPermissionError(normalErr) {
		t.Error("权限错误检测失败")
	}
	
	// 测试nil错误
	if eu.IsPermissionError(nil) {
		t.Error("nil错误检测失败")
	}
	
	// 测试其他类型错误
	otherErr := os.ErrNotExist
	if eu.IsPermissionError(otherErr) {
		t.Error("其他错误不应被检测为权限错误")
	}
}

func TestPathUtil_JoinPath(t *testing.T) {
	pu := utils.NewPathUtil()
	
	result := pu.JoinPath("dir1", "dir2", "file.txt")
	expected := filepath.Join("dir1", "dir2", "file.txt")
	
	if result != expected {
		t.Errorf("路径拼接失败: 期望 %s, 实际 %s", expected, result)
	}
}

func TestPathUtil_IsAbsolutePath(t *testing.T) {
	pu := utils.NewPathUtil()
	
	if !pu.IsAbsolutePath("/absolute/path") {
		t.Error("绝对路径检测失败")
	}
	
	if pu.IsAbsolutePath("relative/path") {
		t.Error("相对路径检测失败")
	}
}

func TestPathUtil_BaseName(t *testing.T) {
	pu := utils.NewPathUtil()
	
	result := pu.BaseName("/path/to/file.txt")
	expected := "file.txt"
	
	if result != expected {
		t.Errorf("获取文件名失败: 期望 %s, 实际 %s", expected, result)
	}
}

func TestPathUtil_Ext(t *testing.T) {
	pu := utils.NewPathUtil()
	
	result := pu.Ext("/path/to/file.txt")
	expected := ".txt"
	
	if result != expected {
		t.Errorf("获取文件扩展名失败: 期望 %s, 实际 %s", expected, result)
	}
}
