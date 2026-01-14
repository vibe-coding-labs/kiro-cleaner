package scanner

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/database"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// Scanner 扫描器接口
type Scanner interface {
	Scan() ([]types.FileInfo, error)
	GetStorageStats() (*types.StorageStats, error)
	Analyze() (*types.AnalysisResult, error)
}

// FileScanner 文件扫描器
type FileScanner struct {
	detector    *storage.StorageDetector
	pathFinder  *storage.PathFinder
	kiroPaths   []string
}

// NewFileScanner 创建新的文件扫描器
func NewFileScanner() *FileScanner {
	return &FileScanner{
		detector:   storage.NewStorageDetector(),
		pathFinder: storage.NewPathFinder(),
	}
}

// Scan 扫描文件（向后兼容）
func (fs *FileScanner) Scan() ([]types.FileInfo, error) {
	return fs.ScanWithProgress(nil)
}

// ScanWithProgress 带进度回调的扫描
func (fs *FileScanner) ScanWithProgress(callback types.ProgressCallback) ([]types.FileInfo, error) {
	var allFiles []types.FileInfo
	
	// 初始化进度
	progress := types.NewScanProgress()
	progress.Phase = "files"
	
	// 查找Kiro路径
	paths, err := fs.detector.FindKiroPaths()
	if err != nil {
		return nil, fmt.Errorf("查找Kiro路径失败: %v", err)
	}
	
	fs.kiroPaths = paths
	
	// 扫描每个路径
	for _, path := range paths {
		files, err := fs.scanPathWithProgress(path, progress, callback)
		if err != nil {
			// 静默跳过无法扫描的路径
			continue
		}
		allFiles = append(allFiles, files...)
	}
	
	// 标记完成
	if callback != nil {
		progress.IsComplete = true
		callback(*progress)
	}
	
	return allFiles, nil
}

// scanPath 扫描单个路径（向后兼容）
func (fs *FileScanner) scanPath(path string) ([]types.FileInfo, error) {
	return fs.scanPathWithProgress(path, nil, nil)
}

// scanPathWithProgress 带进度回调的路径扫描
func (fs *FileScanner) scanPathWithProgress(path string, progress *types.ScanProgress, callback types.ProgressCallback) ([]types.FileInfo, error) {
	var files []types.FileInfo
	
	// 获取文件类型映射
	fileTypes, err := fs.detector.DetectFileTypes(path)
	if err != nil {
		return nil, err
	}
	
	// 遍历目录
	err = filepath.Walk(path, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // 跳过无法访问的文件
		}
		
		// 更新进度 - 目录
		if info.IsDir() {
			if progress != nil {
				progress.ScannedDirs++
				progress.CurrentPath = filePath
				if callback != nil {
					callback(*progress)
				}
			}
			return nil
		}
		
		// 获取文件信息
		fileType := fileTypes[filePath]
		
		fileInfo := types.FileInfo{
			Path:        filePath,
			Name:        info.Name(),
			Size:        info.Size(),
			Modified:    info.ModTime(),
			FileType:    fileType,
			IsEmpty:     info.Size() == 0,
			IsCorrupted: false,
		}
		
		files = append(files, fileInfo)
		
		// 更新进度 - 文件
		if progress != nil {
			progress.ScannedFiles++
			progress.TotalSize += info.Size()
			progress.CurrentPath = filePath
			
			// 更新类型统计
			typeName := fileTypeToString(fileType)
			progress.TypeCounts[typeName]++
			progress.TypeSizes[typeName] += info.Size()
			
			if callback != nil {
				callback(*progress)
			}
		}
		
		return nil
	})
	
	return files, err
}

// fileTypeToString 将文件类型转换为字符串
func fileTypeToString(ft types.FileType) string {
	switch ft {
	case types.TypeLog:
		return "log"
	case types.TypeCache:
		return "cache"
	case types.TypeTemp:
		return "temp"
	case types.TypeIndex:
		return "index"
	case types.TypeBackup:
		return "history"
	case types.TypeDatabase:
		return "database"
	case types.TypeConfig:
		return "config"
	default:
		return "other"
	}
}

// GetStorageStats 获取存储统计信息
func (fs *FileScanner) GetStorageStats() (*types.StorageStats, error) {
	stats := &types.StorageStats{
		FileCounts: make(map[string]int),
	}
	
	for _, path := range fs.kiroPaths {
		// 获取目录大小
		size, err := fs.detector.GetDirectorySize(path)
		if err != nil {
			continue
		}
		stats.TotalSize += size
		
		// 扫描该路径的文件
		files, err := fs.scanPath(path)
		if err != nil {
			continue
		}
		
		// 分类统计
		for _, file := range files {
				switch file.FileType {
				case types.TypeDatabase:
					stats.DBSize += file.Size
				case types.TypeCache:
					stats.CacheSize += file.Size
				case types.TypeLog:
					stats.LogSize += file.Size
				case types.TypeTemp:
					stats.TempSize += file.Size
				}
				
				// 统计文件类型数量
				typeName := getFileTypeName(file.FileType)
				stats.FileCounts[typeName]++
			}
	}
	
	return stats, nil
}

// getFileTypeName 获取文件类型名称
func getFileTypeName(fileType types.FileType) string {
	switch fileType {
	case types.TypeDatabase:
		return "数据库"
	case types.TypeConfig:
		return "配置"
	case types.TypeCache:
		return "缓存"
	case types.TypeLog:
		return "日志"
	case types.TypeTemp:
		return "临时"
	case types.TypeImage:
		return "图片"
	case types.TypeBackup:
		return "备份"
	default:
		return "其他"
	}
}

// Analyze 分析扫描结果
func (fs *FileScanner) Analyze() (*types.AnalysisResult, error) {
	// 获取文件列表
	files, err := fs.Scan()
	if err != nil {
		return nil, err
	}
	
	// 获取存储统计
	stats, err := fs.GetStorageStats()
	if err != nil {
		return nil, err
	}
	
	// 分类文件
	fileAnalysis := make(map[types.FileType][]types.FileInfo)
	for _, file := range files {
		fileAnalysis[file.FileType] = append(fileAnalysis[file.FileType], file)
	}
	
	// 简单的规则匹配（这里先实现基础逻辑）
	ruleMatches := fs.evaluateRules(files)
	
	// 计算潜在节省空间
	spaceSavings := fs.calculateSpaceSavings(files)
	
	// 生成建议
	recommendations := fs.generateRecommendations(stats, files)
	
	return &types.AnalysisResult{
		StorageStats:   stats,
		FileAnalysis:   fileAnalysis,
		RuleMatches:    ruleMatches,
		SpaceSavings:   spaceSavings,
		Recommendations: recommendations,
	}, nil
}

// evaluateRules 评估规则匹配
func (fs *FileScanner) evaluateRules(files []types.FileInfo) []types.RuleMatch {
	var matches []types.RuleMatch
	
	// 统计各类文件数量
	tempFileCount := 0
	oldLogFileCount := 0
	
	for _, file := range files {
		// 临时文件规则
		if file.FileType == types.TypeTemp {
			tempFileCount++
		}
		
		// 旧日志文件规则
		if file.FileType == types.TypeLog && time.Since(file.Modified) > 7*24*time.Hour {
			oldLogFileCount++
		}
	}
	
	// 只添加汇总规则，避免重复
	if tempFileCount > 0 {
		rule := types.CleanupRule{
			Name:        "临时文件清理",
			Description: fmt.Sprintf("清理%d个临时文件", tempFileCount),
			Priority:    1,
		}
		matches = append(matches, types.RuleMatch{
			Rule:        rule,
			FileInfo:    types.FileInfo{}, // 汇总规则不需要具体文件
			Matched:     true,
			Confidence:  0.9,
		})
	}
	
	if oldLogFileCount > 0 {
		rule := types.CleanupRule{
			Name:        "旧日志清理",
			Description: fmt.Sprintf("清理%d个7天前的日志文件", oldLogFileCount),
			Priority:    2,
		}
		matches = append(matches, types.RuleMatch{
			Rule:        rule,
			FileInfo:    types.FileInfo{}, // 汇总规则不需要具体文件
			Matched:     true,
			Confidence:  0.8,
		})
	}
	
	return matches
}

// calculateSpaceSavings 计算潜在节省空间
func (fs *FileScanner) calculateSpaceSavings(files []types.FileInfo) int64 {
	var savings int64
	
	for _, file := range files {
		// 只计算可以安全删除的文件
		if file.FileType == types.TypeTemp || 
		   (file.FileType == types.TypeLog && time.Since(file.Modified) > 7*24*time.Hour) {
			savings += file.Size
		}
	}
	
	return savings
}

// generateRecommendations 生成建议
func (fs *FileScanner) generateRecommendations(stats *types.StorageStats, files []types.FileInfo) []string {
	var recommendations []string
	
	if stats.TempSize > 10*1024*1024 { // 大于10MB
		recommendations = append(recommendations, 
			fmt.Sprintf("发现 %s 的临时文件，建议清理", storage.FormatSize(stats.TempSize)))
	}
	
	if stats.LogSize > 50*1024*1024 { // 大于50MB
		recommendations = append(recommendations, 
			fmt.Sprintf("发现 %s 的日志文件，建议清理旧日志", storage.FormatSize(stats.LogSize)))
	}
	
	if stats.CacheSize > 100*1024*1024 { // 大于100MB
		recommendations = append(recommendations, 
			fmt.Sprintf("发现 %s 的缓存文件，建议清理", storage.FormatSize(stats.CacheSize)))
	}
	
	if stats.TotalSize > 500*1024*1024 { // 大于500MB
		recommendations = append(recommendations, 
			fmt.Sprintf("总存储使用 %s，建议进行定期清理", storage.FormatSize(stats.TotalSize)))
	}
	
	return recommendations
}

// GetDetailedStats 获取详细的存储统计（包括各子目录）
func (fs *FileScanner) GetDetailedStats() (map[string]int64, error) {
	stats := make(map[string]int64)
	
	for _, basePath := range fs.kiroPaths {
		// 扫描主要子目录
		subDirs := []string{
			"User/History",
			"User/globalStorage",
			"User/workspaceStorage",
			"logs",
			"Cache",
			"CachedData",
			"Crashpad",
			"WebStorage",
			"Local Storage",
			"GPUCache",
		}
		
		for _, subDir := range subDirs {
			fullPath := filepath.Join(basePath, subDir)
			if size, err := fs.detector.GetDirectorySize(fullPath); err == nil {
				stats[subDir] = size
			}
		}
	}
	
	return stats, nil
}

// DBSanner 数据库扫描器
type DBSanner struct {
	dbManager *database.DatabaseManager
}

// NewDBSanner 创建新的数据库扫描器
func NewDBSanner() *DBSanner {
	return &DBSanner{
		dbManager: database.NewDatabaseManager(),
	}
}

// Scan 扫描数据库
func (dbs *DBSanner) Scan() ([]types.FileInfo, error) {
	// 这里实现数据库扫描逻辑
	// 由于数据库路径需要从文件系统中找到，先返回空列表
	return []types.FileInfo{}, nil
}