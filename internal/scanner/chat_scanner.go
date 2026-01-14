package scanner

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ChatScanner 扫描 Kiro 对话文件
type ChatScanner struct {
	basePath string
	parser   *ChatParser
}

// NewChatScanner 创建新的对话扫描器
func NewChatScanner() *ChatScanner {
	return &ChatScanner{
		parser: NewChatParser(),
	}
}

// specialDirs 特殊目录，不应作为工作区扫描
var specialDirs = map[string]bool{
	"index":              true,
	"dev_data":           true,
	"workspace-sessions": true,
	".migrations":        true,
	".diffs":             true,
	".utils":             true,
	"default":            true,
}

// FindKiroAgentPath 查找 Kiro 代理存储路径
func (cs *ChatScanner) FindKiroAgentPath() (string, error) {
	var basePath string

	switch runtime.GOOS {
	case "darwin": // macOS
		home := os.Getenv("HOME")
		// 注意：实际路径是小写 'kiro'
		basePath = filepath.Join(home, "Library", "Application Support", "kiro", "User", "globalStorage", "kiro.kiroagent")
		// 如果小写路径不存在，尝试大写
		if _, err := os.Stat(basePath); os.IsNotExist(err) {
			basePath = filepath.Join(home, "Library", "Application Support", "Kiro", "User", "globalStorage", "kiro.kiroagent")
		}
	case "windows":
		appData := os.Getenv("APPDATA")
		if appData == "" {
			return "", fmt.Errorf("APPDATA 环境变量未设置")
		}
		// Windows 尝试两种大小写
		basePath = filepath.Join(appData, "kiro", "User", "globalStorage", "kiro.kiroagent")
		if _, err := os.Stat(basePath); os.IsNotExist(err) {
			basePath = filepath.Join(appData, "Kiro", "User", "globalStorage", "kiro.kiroagent")
		}
	case "linux":
		xdgConfig := os.Getenv("XDG_CONFIG_HOME")
		if xdgConfig == "" {
			xdgConfig = filepath.Join(os.Getenv("HOME"), ".config")
		}
		basePath = filepath.Join(xdgConfig, "kiro", "User", "globalStorage", "kiro.kiroagent")
		if _, err := os.Stat(basePath); os.IsNotExist(err) {
			basePath = filepath.Join(xdgConfig, "Kiro", "User", "globalStorage", "kiro.kiroagent")
		}
	default:
		home := os.Getenv("HOME")
		basePath = filepath.Join(home, ".config", "kiro", "User", "globalStorage", "kiro.kiroagent")
	}

	// 检查路径是否存在
	if _, err := os.Stat(basePath); os.IsNotExist(err) {
		return "", fmt.Errorf("Kiro 代理存储路径不存在: %s", basePath)
	}

	cs.basePath = basePath
	return basePath, nil
}

// SetBasePath 设置基础路径（用于测试）
func (cs *ChatScanner) SetBasePath(path string) {
	cs.basePath = path
}

// ScanWorkspaces 扫描所有工作区（向后兼容）
func (cs *ChatScanner) ScanWorkspaces() ([]types.WorkspaceStats, error) {
	return cs.ScanWorkspacesWithProgress(nil)
}

// ScanWorkspacesWithProgress 带进度回调的工作区扫描
func (cs *ChatScanner) ScanWorkspacesWithProgress(callback types.ProgressCallback) ([]types.WorkspaceStats, error) {
	if cs.basePath == "" {
		if _, err := cs.FindKiroAgentPath(); err != nil {
			return nil, err
		}
	}

	var workspaces []types.WorkspaceStats

	// 读取基础目录
	entries, err := os.ReadDir(cs.basePath)
	if err != nil {
		return nil, fmt.Errorf("读取目录失败: %v", err)
	}

	// 初始化进度（如果有回调）
	var progress *types.ScanProgress
	if callback != nil {
		progress = types.NewScanProgress()
		progress.Phase = "chats"
	}

	for _, entry := range entries {
		// 跳过非目录和隐藏目录
		if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
			continue
		}

		// 跳过特殊目录（不是工作区）
		if specialDirs[entry.Name()] {
			continue
		}

		workspacePath := filepath.Join(cs.basePath, entry.Name())
		
		// 更新进度
		if progress != nil {
			progress.ScannedDirs++
			progress.CurrentPath = workspacePath
			callback(*progress)
		}
		
		stats, err := cs.scanSingleWorkspaceWithProgress(entry.Name(), workspacePath, progress, callback)
		if err != nil {
			// 跳过无法扫描的工作区，继续处理其他
			continue
		}

		if stats.ConversationCount > 0 {
			workspaces = append(workspaces, *stats)
		}
	}

	// 标记完成
	if progress != nil {
		progress.IsComplete = true
		callback(*progress)
	}

	return workspaces, nil
}

// scanSingleWorkspace 扫描单个工作区（向后兼容）
func (cs *ChatScanner) scanSingleWorkspace(workspaceID, path string) (*types.WorkspaceStats, error) {
	return cs.scanSingleWorkspaceWithProgress(workspaceID, path, nil, nil)
}

// scanSingleWorkspaceWithProgress 带进度回调的单个工作区扫描
func (cs *ChatScanner) scanSingleWorkspaceWithProgress(workspaceID, path string, progress *types.ScanProgress, callback types.ProgressCallback) (*types.WorkspaceStats, error) {
	stats := &types.WorkspaceStats{
		WorkspaceID: workspaceID,
		Path:        path,
	}

	// 扫描 .chat 文件
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".chat") {
			continue
		}

		chatPath := filepath.Join(path, entry.Name())
		chatInfo, err := cs.parser.ParseChatFile(chatPath)
		if err != nil {
			// 跳过无法解析的文件
			continue
		}

		stats.ConversationCount++
		stats.TotalMessages += chatInfo.MessageCount
		stats.TotalSize += chatInfo.Size

		if chatInfo.ModTime.After(stats.LastActivity) {
			stats.LastActivity = chatInfo.ModTime
		}

		// 更新进度
		if progress != nil {
			progress.ScannedFiles++
			progress.TotalSize += chatInfo.Size
			progress.CurrentPath = chatPath
			progress.TypeCounts["chat"]++
			progress.TypeSizes["chat"] += chatInfo.Size
			
			if callback != nil {
				callback(*progress)
			}
		}
	}

	return stats, nil
}

// GetConversationStats 获取对话统计
func (cs *ChatScanner) GetConversationStats() (*types.ConversationStats, error) {
	workspaces, err := cs.ScanWorkspaces()
	if err != nil {
		return nil, err
	}

	stats := &types.ConversationStats{
		WorkspaceBreakdown: workspaces,
	}

	// 聚合统计
	for _, ws := range workspaces {
		stats.TotalConversations += ws.ConversationCount
		stats.TotalMessages += ws.TotalMessages
		stats.TotalSize += ws.TotalSize

		if ws.LastActivity.After(stats.LastActivity) {
			stats.LastActivity = ws.LastActivity
		}
	}

	// 计算平均值
	if stats.TotalConversations > 0 {
		stats.AvgMessagesPerConv = float64(stats.TotalMessages) / float64(stats.TotalConversations)
	}

	// 统计各类消息（需要重新扫描以获取详细信息）
	cs.countMessageTypes(stats)

	return stats, nil
}

// countMessageTypes 统计各类消息数量
func (cs *ChatScanner) countMessageTypes(stats *types.ConversationStats) {
	if cs.basePath == "" {
		return
	}

	entries, err := os.ReadDir(cs.basePath)
	if err != nil {
		return
	}

	for _, entry := range entries {
		if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
			continue
		}

		// 跳过特殊目录
		if specialDirs[entry.Name()] {
			continue
		}

		workspacePath := filepath.Join(cs.basePath, entry.Name())
		chatFiles, err := os.ReadDir(workspacePath)
		if err != nil {
			continue
		}

		for _, chatEntry := range chatFiles {
			if chatEntry.IsDir() || !strings.HasSuffix(chatEntry.Name(), ".chat") {
				continue
			}

			chatPath := filepath.Join(workspacePath, chatEntry.Name())
			chatInfo, err := cs.parser.ParseChatFile(chatPath)
			if err != nil {
				continue
			}

			stats.HumanMessages += chatInfo.HumanMessages
			stats.BotMessages += chatInfo.BotMessages
			stats.ToolMessages += chatInfo.ToolMessages
		}
	}
}

// FindCleanableConversations 查找可清理的对话
// ageDays=0 表示返回所有会话，sizeBytes=0 表示不按大小过滤
func (cs *ChatScanner) FindCleanableConversations(ageDays int, sizeBytes int64) ([]types.CleanableConversation, error) {
	if cs.basePath == "" {
		if _, err := cs.FindKiroAgentPath(); err != nil {
			return nil, err
		}
	}

	var cleanable []types.CleanableConversation
	var cutoffTime time.Time
	if ageDays > 0 {
		cutoffTime = time.Now().AddDate(0, 0, -ageDays)
	}

	entries, err := os.ReadDir(cs.basePath)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
			continue
		}

		// 跳过特殊目录
		if specialDirs[entry.Name()] {
			continue
		}

		workspacePath := filepath.Join(cs.basePath, entry.Name())
		chatFiles, err := os.ReadDir(workspacePath)
		if err != nil {
			continue
		}

		for _, chatEntry := range chatFiles {
			if chatEntry.IsDir() || !strings.HasSuffix(chatEntry.Name(), ".chat") {
				continue
			}

			chatPath := filepath.Join(workspacePath, chatEntry.Name())
			fileInfo, err := os.Stat(chatPath)
			if err != nil {
				continue
			}

			// ageDays=0 表示返回所有会话
			if ageDays == 0 {
				cleanable = append(cleanable, types.CleanableConversation{
					Path:    chatPath,
					Size:    fileInfo.Size(),
					ModTime: fileInfo.ModTime(),
					Reason:  "all",
				})
			} else if fileInfo.ModTime().Before(cutoffTime) {
				// 检查是否符合年龄条件
				cleanable = append(cleanable, types.CleanableConversation{
					Path:    chatPath,
					Size:    fileInfo.Size(),
					ModTime: fileInfo.ModTime(),
					Reason:  "old",
				})
			} else if sizeBytes > 0 && fileInfo.Size() > sizeBytes {
				// 检查是否符合大小条件
				cleanable = append(cleanable, types.CleanableConversation{
					Path:    chatPath,
					Size:    fileInfo.Size(),
					ModTime: fileInfo.ModTime(),
					Reason:  "large",
				})
			}
		}
	}

	return cleanable, nil
}

// CalculateSpaceSavings 计算潜在节省空间
func (cs *ChatScanner) CalculateSpaceSavings(cleanable []types.CleanableConversation) int64 {
	var total int64
	for _, c := range cleanable {
		total += c.Size
	}
	return total
}

// IsChatFile 检查文件是否为 .chat 文件
func IsChatFile(filename string) bool {
	return strings.HasSuffix(strings.ToLower(filename), ".chat")
}
