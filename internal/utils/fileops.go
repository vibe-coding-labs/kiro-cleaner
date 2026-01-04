package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// FileOps 文件操作工具
type FileOps struct{}

// NewFileOps 创建新的文件操作工具
func NewFileOps() *FileOps {
	return &FileOps{}
}

// EnsureDir 确保目录存在
func (fo *FileOps) EnsureDir(dir string) error {
	return os.MkdirAll(dir, 0755)
}

// IsEmptyDir 检查目录是否为空
func (fo *FileOps) IsEmptyDir(dir string) (bool, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return false, err
	}
	return len(files) == 0, nil
}

// GetFileSize 获取文件大小
func (fo *FileOps) GetFileSize(path string) (int64, error) {
	info, err := os.Stat(path)
	if err != nil {
		return 0, err
	}
	return info.Size(), nil
}

// GetFileAge 获取文件年龄
func (fo *FileOps) GetFileAge(path string) (time.Duration, error) {
	info, err := os.Stat(path)
	if err != nil {
		return 0, err
	}
	return time.Since(info.ModTime()), nil
}

// IsFileOlderThan 检查文件是否比指定时间旧
func (fo *FileOps) IsFileOlderThan(path string, duration time.Duration) (bool, error) {
	age, err := fo.GetFileAge(path)
	if err != nil {
		return false, err
	}
	return age > duration, nil
}

// SafeRemove 安全删除文件
func (fo *FileOps) SafeRemove(path string) error {
	// 检查文件是否存在
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil // 文件不存在，无需删除
	}
	
	// 移动到临时目录再删除（更安全）
	tempDir := filepath.Join(os.Getenv("TMPDIR"), "kiro-cleaner-temp")
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return err
	}
	
	tempPath := filepath.Join(tempDir, filepath.Base(path))
	if err := os.Rename(path, tempPath); err != nil {
		return err
	}
	
	return os.Remove(tempPath)
}

// CopyFile 复制文件
func (fo *FileOps) CopyFile(src, dst string) error {
	input, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	return os.WriteFile(dst, input, 0644)
}

// Time 时间工具
type TimeUtil struct{}

// NewTimeUtil 创建新的时间工具
func NewTimeUtil() *TimeUtil {
	return &TimeUtil{}
}

// FormatDuration 格式化持续时间
func (tu *TimeUtil) FormatDuration(d time.Duration) string {
	if d < time.Minute {
		return fmt.Sprintf("%d秒", int(d.Seconds()))
	} else if d < time.Hour {
		return fmt.Sprintf("%d分钟", int(d.Minutes()))
	} else if d < 24*time.Hour {
		return fmt.Sprintf("%d小时", int(d.Hours()))
	} else {
		days := int(d.Hours() / 24)
		return fmt.Sprintf("%d天", days)
	}
}

// ParseDuration 解析持续时间字符串
func (tu *TimeUtil) ParseDuration(s string) (time.Duration, error) {
	// 支持的格式: 1h, 24h, 7d, 30d
	switch s {
	case "1h":
		return time.Hour, nil
	case "24h":
		return 24 * time.Hour, nil
	case "168h": // 7天
		return 168 * time.Hour, nil
	case "720h": // 30天
		return 720 * time.Hour, nil
	case "7d":
		return 7 * 24 * time.Hour, nil
	case "30d":
		return 30 * 24 * time.Hour, nil
	default:
		return 0, fmt.Errorf("不支持的持续时间格式: %s", s)
	}
}

// Errors 错误处理工具
type ErrorUtil struct{}

// NewErrorUtil 创建新的错误工具
func NewErrorUtil() *ErrorUtil {
	return &ErrorUtil{}
}

// IsPermissionError 检查是否为权限错误
func (eu *ErrorUtil) IsPermissionError(err error) bool {
	if err == nil {
		return false
	}
	return os.IsPermission(err)
}

// IsNotExistError 检查是否为文件不存在错误
func (eu *ErrorUtil) IsNotExistError(err error) bool {
	if err == nil {
		return false
	}
	return os.IsNotExist(err)
}

// IsFileExistsError 检查是否为文件已存在错误
func (eu *ErrorUtil) IsFileExistsError(err error) bool {
	if err == nil {
		return false
	}
	return os.IsExist(err)
}

// WrapError 包装错误信息
func (eu *ErrorUtil) WrapError(err error, context string) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %v", context, err)
}

// FormatError 格式化错误信息
func (eu *ErrorUtil) FormatError(err error) string {
	if err == nil {
		return "无错误"
	}
	return err.Error()
}

// IsRecoverableError 检查错误是否可恢复
func (eu *ErrorUtil) IsRecoverableError(err error) bool {
	if err == nil {
		return true
	}
	
	// 权限错误和文件不存在错误通常可恢复
	return eu.IsPermissionError(err) || eu.IsNotExistError(err)
}

// Path 路径工具
type PathUtil struct{}

// NewPathUtil 创建新的路径工具
func NewPathUtil() *PathUtil {
	return &PathUtil{}
}

// JoinPath 安全的路径拼接
func (pu *PathUtil) JoinPath(elem ...string) string {
	return filepath.Join(elem...)
}

// IsAbsolutePath 检查是否为绝对路径
func (pu *PathUtil) IsAbsolutePath(path string) bool {
	return filepath.IsAbs(path)
}

// CleanPath 清理路径
func (pu *PathUtil) CleanPath(path string) string {
	return filepath.Clean(path)
}

// BaseName 获取文件名（不含路径）
func (pu *PathUtil) BaseName(path string) string {
	return filepath.Base(path)
}

// DirName 获取目录名
func (pu *PathUtil) DirName(path string) string {
	return filepath.Dir(path)
}

// Ext 获取文件扩展名
func (pu *PathUtil) Ext(path string) string {
	return filepath.Ext(path)
}

// HomeDir 获取用户主目录
func (pu *PathUtil) HomeDir() (string, error) {
	return os.UserHomeDir()
}

// TempDir 获取临时目录
func (pu *PathUtil) TempDir() string {
	return os.TempDir()
}