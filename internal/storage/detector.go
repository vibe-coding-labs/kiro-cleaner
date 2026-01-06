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
		pathLower := strings.ToLower(filePath)
		
		switch {
		// 数据库文件
		case ext == ".db" || ext == ".sqlite" || ext == ".sqlite3" || ext == ".vscdb":
			// 区分索引数据库和普通数据库
			if strings.Contains(pathLower, "/index/") || strings.Contains(pathLower, "lancedb") {
				fileTypes[filePath] = types.TypeIndex
			} else {
				fileTypes[filePath] = types.TypeDatabase
			}
		case ext == ".chat":
			fileTypes[filePath] = types.TypeDatabase
		
		// 索引文件（向量数据库等）
		case strings.Contains(pathLower, "/index/") || 
			strings.Contains(pathLower, "lancedb") ||
			ext == ".lance" || ext == ".manifest" || ext == ".txn":
			fileTypes[filePath] = types.TypeIndex
			
		// 代码差异/历史版本缓存（kiroagent 目录下非 .chat 文件）
		case strings.Contains(pathLower, "kiro.kiroagent") && 
			!strings.HasSuffix(name, ".chat") &&
			!strings.Contains(pathLower, "/index/") &&
			!strings.Contains(pathLower, "lancedb") &&
			!strings.Contains(pathLower, "workspace-sessions") &&
			!strings.Contains(pathLower, "dev_data") &&
			!strings.Contains(pathLower, "/default/"):
			fileTypes[filePath] = types.TypeCache
			
		// 配置文件（不应删除）
		case name == "config.json" || name == "settings.json" || name == "mcp.json" ||
			name == "preferences" || name == "machineid" || name == "machineid.json" ||
			name == "languagepacks.json" || name == "code.lock":
			fileTypes[filePath] = types.TypeConfig
			
		// 日志文件
		case ext == ".log" || strings.Contains(pathLower, "/logs/") || strings.Contains(name, ".log"):
			fileTypes[filePath] = types.TypeLog
			
		// 临时文件和崩溃报告
		case ext == ".tmp" || ext == ".temp" || name == "temp" ||
			strings.Contains(pathLower, "crashpad") ||
			strings.HasPrefix(name, ".dev.kiro.desktop") ||
			name == "code.lock" || ext == ".sock":
			fileTypes[filePath] = types.TypeTemp
			
		// Electron/Chrome 数据文件（可清理但可能影响登录）
		case name == "cookies" || name == "cookies-journal" ||
			name == "dips" || name == "dips-wal" ||
			name == "sharedstorage" || name == "sharedstorage-wal" ||
			name == "trust tokens" || name == "trust tokens-journal" ||
			name == "network persistent state" || name == "transportsecurity":
			fileTypes[filePath] = types.TypeCache
			
		// 缓存文件（各种缓存目录）
		case strings.Contains(pathLower, "cache") ||
			strings.Contains(pathLower, "cacheddata") ||
			strings.Contains(pathLower, "cachedprofilesdata") ||
			strings.Contains(pathLower, "gpucache") ||
			strings.Contains(pathLower, "dawnwebgpucache") ||
			strings.Contains(pathLower, "dawngraphitecache") ||
			strings.Contains(pathLower, "code cache") ||
			strings.Contains(pathLower, "service worker") ||
			strings.Contains(pathLower, "local storage") ||
			strings.Contains(pathLower, "webstorage") ||
			strings.Contains(pathLower, "session storage") ||
			strings.Contains(pathLower, "blob_storage") ||
			strings.Contains(pathLower, "shared dictionary") ||
			strings.Contains(pathLower, "leveldb") ||
			ext == ".ldb" || ext == ".sst": // LevelDB 文件
			fileTypes[filePath] = types.TypeCache
			
		// 历史文件
		case strings.Contains(pathLower, "history"):
			fileTypes[filePath] = types.TypeBackup
			
		// 图片文件
		case ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".webp":
			fileTypes[filePath] = types.TypeImage
			
		// 备份文件
		case ext == ".zip" || ext == ".tar" || ext == ".gz" || strings.Contains(name, "backup"):
			fileTypes[filePath] = types.TypeBackup
			
		// 其他 JSON/配置文件
		case ext == ".json" || ext == ".xml" || ext == ".yaml" || ext == ".yml":
			if strings.Contains(name, "session") {
				fileTypes[filePath] = types.TypeDatabase
			} else {
				fileTypes[filePath] = types.TypeConfig
			}
			
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