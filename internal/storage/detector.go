package storage

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// PathFinder 路径查找器
type PathFinder struct {
	osType string
}

// StorageDetector 存储检测器
type StorageDetector struct {
	pathFinder *PathFinder
}

// NewPathFinder 创建新的路径查找器
func NewPathFinder() *PathFinder {
	return &PathFinder{
		osType: runtime.GOOS,
	}
}

// NewStorageDetector 创建新的存储检测器
func NewStorageDetector() *StorageDetector {
	return &StorageDetector{
		pathFinder: NewPathFinder(),
	}
}

// FindKiroPaths 查找Kiro的存储路径
func (sd *StorageDetector) FindKiroPaths() ([]string, error) {
	var paths []string
	
	// 常见存储位置
	commonPaths := sd.pathFinder.getCommonPaths()
	
	for _, path := range commonPaths {
		if sd.pathExists(path) {
			paths = append(paths, path)
		}
	}
	
	return paths, nil
}

// getCommonPaths 获取常见存储路径
func (pf *PathFinder) getCommonPaths() []string {
	switch pf.osType {
	case "darwin": // macOS
		home := os.Getenv("HOME")
		// 同时返回大小写两种路径，实际存在的会被过滤
		return []string{
			filepath.Join(home, "Library", "Application Support", "kiro"),
			filepath.Join(home, "Library", "Application Support", "Kiro"),
		}
	case "windows":
		appData := os.Getenv("APPDATA")
		if appData != "" {
			return []string{
				filepath.Join(appData, "kiro"),
				filepath.Join(appData, "Kiro"),
			}
		}
	case "linux":
		xdgConfig := os.Getenv("XDG_CONFIG_HOME")
		if xdgConfig == "" {
			xdgConfig = filepath.Join(os.Getenv("HOME"), ".config")
		}
		return []string{
			filepath.Join(xdgConfig, "kiro"),
			filepath.Join(xdgConfig, "Kiro"),
		}
	default:
		home := os.Getenv("HOME")
		return []string{
			filepath.Join(home, ".kiro"),
			filepath.Join(home, ".config", "kiro"),
		}
	}
	return []string{}
}

// pathExists 检查路径是否存在
func (sd *StorageDetector) pathExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// DetectFileTypes 检测文件类型
func (sd *StorageDetector) DetectFileTypes(path string) (map[string]types.FileType, error) {
	fileTypes := make(map[string]types.FileType)
	
	err := filepath.Walk(path, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // 跳过无法访问的文件
		}
		
		if info.IsDir() {
			return nil
		}
		
		ext := strings.ToLower(filepath.Ext(filePath))
		name := strings.ToLower(info.Name())
		
		switch {
		case ext == ".db" || ext == ".sqlite" || ext == ".sqlite3" || ext == ".vscdb":
			fileTypes[filePath] = types.TypeDatabase
		case ext == ".chat":
			// .chat 文件是对话数据，归类为数据库类型
			fileTypes[filePath] = types.TypeDatabase
		case ext == ".json" || ext == ".xml" || ext == ".yaml" || ext == ".yml":
			// 区分配置文件和普通 JSON
			if name == "config.json" || name == "settings.json" || name == "mcp.json" {
				fileTypes[filePath] = types.TypeConfig
			} else if strings.Contains(name, "session") {
				fileTypes[filePath] = types.TypeDatabase // 会话数据
			} else {
				fileTypes[filePath] = types.TypeConfig
			}
		case ext == ".log" || name == "log" || strings.Contains(name, ".log"):
			fileTypes[filePath] = types.TypeLog
		case ext == ".tmp" || ext == ".temp" || name == "temp":
			fileTypes[filePath] = types.TypeTemp
		case strings.Contains(name, "cache") || strings.Contains(filePath, "Cache") || strings.Contains(filePath, "CachedData"):
			fileTypes[filePath] = types.TypeCache
		case strings.Contains(filePath, "Crashpad"):
			fileTypes[filePath] = types.TypeTemp // 崩溃报告可以清理
		case strings.Contains(filePath, "History"):
			fileTypes[filePath] = types.TypeBackup // 历史文件
		case ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".webp":
			fileTypes[filePath] = types.TypeImage
		case ext == ".zip" || ext == ".tar" || ext == ".gz" || strings.Contains(name, "backup"):
			fileTypes[filePath] = types.TypeBackup
		default:
			fileTypes[filePath] = types.TypeUnknown
		}
		
		return nil
	})
	
	return fileTypes, err
}

// GetDirectorySize 获取目录大小
func (sd *StorageDetector) GetDirectorySize(path string) (int64, error) {
	var totalSize int64
	
	err := filepath.Walk(path, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // 跳过无法访问的文件
		}
		
		if !info.IsDir() {
			totalSize += info.Size()
		}
		
		return nil
	})
	
	return totalSize, err
}

// ValidateKiroPath 验证是否为有效的Kiro存储路径
func (sd *StorageDetector) ValidateKiroPath(path string) (bool, error) {
	// 检查关键文件或目录
	keyFiles := []string{
		"conversations.db",
		"config.json",
		"cache",
		"logs",
	}
	
	exists := 0
	for _, keyFile := range keyFiles {
		fullPath := filepath.Join(path, keyFile)
		if _, err := os.Stat(fullPath); err == nil {
			exists++
		}
	}
	
	// 如果存在至少2个关键文件/目录，认为是有效路径
	return exists >= 2, nil
}

// FormatSize 格式化文件大小
func FormatSize(bytes int64) string {
	const (
		KB = 1024
		MB = 1024 * KB
		GB = 1024 * MB
	)
	
	switch {
	case bytes >= GB:
		return fmt.Sprintf("%.2f GB", float64(bytes)/GB)
	case bytes >= MB:
		return fmt.Sprintf("%.2f MB", float64(bytes)/MB)
	case bytes >= KB:
		return fmt.Sprintf("%.2f KB", float64(bytes)/KB)
	default:
		return fmt.Sprintf("%d B", bytes)
	}
}