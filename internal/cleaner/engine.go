package cleaner

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/internal/backup"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/database"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// CleanupEngine 清理引擎
type CleanupEngine struct {
	scanner    scanner.Scanner
	dbManager  *database.DatabaseManager
	backupMgr  *backup.BackupManager
	prompter   *ui.SimplePrompter
	progress   *ui.ProgressDisplay
	rules      []types.CleanupRule
	safety     *SafetyChecker
}

// SafetyChecker 安全检查器
type SafetyChecker struct {
	config *types.SafetyConfig
}

// NewCleanupEngine 创建新的清理引擎
func NewCleanupEngine(scanner scanner.Scanner, dbManager *database.DatabaseManager, 
	backupMgr *backup.BackupManager, prompter *ui.SimplePrompter) *CleanupEngine {
	
	return &CleanupEngine{
		scanner:    scanner,
		dbManager:  dbManager,
		backupMgr:  backupMgr,
		prompter:   prompter,
		progress:   ui.NewProgressDisplay(os.Stdout, true),
		safety:     &SafetyChecker{config: &types.SafetyConfig{}},
	}
}

// SetRules 设置清理规则
func (ce *CleanupEngine) SetRules(rules []types.CleanupRule) error {
	ce.rules = rules
	return nil
}

// Preview 预览清理操作
func (ce *CleanupEngine) Preview(targets []types.FileInfo) (*types.CleanupPreview, error) {
	preview := &types.CleanupPreview{
		Actions:      []types.CleanupAction{},
		TotalSize:    0,
		SafeToDelete: true,
		Warnings:     []string{},
		Recommendations: []string{},
	}
	
	// 评估每个目标文件
	for i, target := range targets {
		action := ce.evaluateFile(target)
		if action != nil {
			action.ID = int64(i + 1)
			preview.Actions = append(preview.Actions, *action)
			preview.TotalSize += action.Size
			
			// 添加安全检查
			if !ce.isSafeToDelete(target) {
				preview.SafeToDelete = false
				preview.Warnings = append(preview.Warnings, 
					fmt.Sprintf("文件 %s 可能不安全删除", target.Name))
			}
		}
	}
	
	// 生成建议
	preview.Recommendations = ce.generateRecommendations(preview)
	
	return preview, nil
}

// evaluateFile 评估文件
func (ce *CleanupEngine) evaluateFile(file types.FileInfo) *types.CleanupAction {
	// 检查是否匹配任何清理规则
	for _, rule := range ce.rules {
		if !rule.Enabled {
			continue
		}
		
		if ce.matchesRule(file, rule) {
			return &types.CleanupAction{
				Type:    "delete",
				Target:  file,
				Rule:    rule.Name,
				Reason:  rule.Description,
				Size:    file.Size,
			}
		}
	}
	
	return nil
}

// matchesRule 检查文件是否匹配规则
func (ce *CleanupEngine) matchesRule(file types.FileInfo, rule types.CleanupRule) bool {
	// 简单的规则匹配逻辑
	for _, condition := range rule.Conditions {
		if !ce.matchesCondition(file, condition) {
			return false
		}
	}
	return true
}

// matchesCondition 检查条件匹配
func (ce *CleanupEngine) matchesCondition(file types.FileInfo, condition types.Condition) bool {
	switch condition.Type {
	case "file_age":
		age := time.Since(file.Modified)
		switch condition.Operator {
		case ">":
			expectedAge, err := parseDuration(condition.Value.(string))
			if err != nil {
				return false
			}
			return age > expectedAge
		}
	case "file_type":
		return fmt.Sprintf("%d", file.FileType) == condition.Value.(string)
	case "file_size":
		switch condition.Operator {
		case ">":
			return file.Size > condition.Value.(int64)
		case "<":
			return file.Size < condition.Value.(int64)
		}
	case "file_name":
		switch condition.Operator {
		case "contains":
			return contains(file.Name, condition.Value.(string))
		case "regex":
			// 简单的正则匹配（这里用contains代替）
			return contains(file.Name, condition.Value.(string))
		}
	}
	return false
}

// parseDuration 解析持续时间字符串
func parseDuration(s string) (time.Duration, error) {
	// 简单的持续时间解析
	if s == "1h" {
		return time.Hour, nil
	} else if s == "24h" {
		return 24 * time.Hour, nil
	} else if s == "168h" { // 7天
		return 168 * time.Hour, nil
	} else if s == "720h" { // 30天
		return 720 * time.Hour, nil
	}
	return 0, fmt.Errorf("未支持的持续时间格式: %s", s)
}

// contains 检查字符串是否包含子字符串
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || 
		(s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || 
		 findSubstring(s, substr)))
}

// findSubstring 简单子字符串查找
func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// protectedFiles 受保护的文件名（不应删除）
var protectedFiles = map[string]bool{
	"config.json":     true,
	"settings.json":   true,
	"mcp.json":        true,
	"sessions.json":   true,
	"state.vscdb":     true,
	"workspace.json":  true,
	"storage.json":    true,
	".continuerc.json": true,
}

// protectedDirs 受保护的目录名（不应删除其中的文件）
var protectedDirs = map[string]bool{
	"index":      true,  // 代码索引
	".migrations": true, // 迁移记录
	"lancedb":    true,  // 向量数据库
}

// isSafeToDelete 检查是否可以安全删除
func (ce *CleanupEngine) isSafeToDelete(file types.FileInfo) bool {
	// 检查是否是受保护的文件
	if protectedFiles[file.Name] {
		return false
	}
	
	// 检查是否在受保护的目录中
	for dir := range protectedDirs {
		if contains(file.Path, "/"+dir+"/") {
			return false
		}
	}
	
	// 安全检查逻辑
	switch file.FileType {
	case types.TypeTemp:
		return true // 临时文件可以安全删除
	case types.TypeLog:
		// 只删除超过7天的日志
		return time.Since(file.Modified) > 7*24*time.Hour
	case types.TypeCache:
		return true // 缓存文件可以安全删除
	case types.TypeDatabase:
		// 数据库文件需要特殊处理
		// .chat 文件可以在用户确认后删除
		if filepath.Ext(file.Name) == ".chat" {
			return time.Since(file.Modified) > 30*24*time.Hour // 30天以上的对话
		}
		return false // 其他数据库文件不建议删除
	case types.TypeConfig:
		return false // 配置文件不建议直接删除
	case types.TypeBackup:
		// 历史文件可以在超过30天后删除
		return time.Since(file.Modified) > 30*24*time.Hour
	default:
		return false // 其他类型需要用户确认
	}
}

// generateRecommendations 生成建议
func (ce *CleanupEngine) generateRecommendations(preview *types.CleanupPreview) []string {
	var recommendations []string
	
	if len(preview.Actions) == 0 {
		recommendations = append(recommendations, "没有发现需要清理的文件")
		return recommendations
	}
	
	if preview.TotalSize > 100*1024*1024 { // 大于100MB
		recommendations = append(recommendations, 
			fmt.Sprintf("清理将释放 %d MB 空间", preview.TotalSize/(1024*1024)))
	}
	
	if !preview.SafeToDelete {
		recommendations = append(recommendations, 
			"建议在清理前创建备份")
	}
	
	if len(preview.Actions) > 100 {
		recommendations = append(recommendations, 
			"发现大量文件，建议分批清理")
	}
	
	return recommendations
}

// Execute 执行清理
func (ce *CleanupEngine) Execute(targets []types.FileInfo, dryRun bool) (*types.CleanupResult, error) {
	result := &types.CleanupResult{
		Success:      true,
		ActionsTaken: []types.CleanupAction{},
		BytesFreed:   0,
		Errors:       []types.CleanupError{},
		Duration:     0,
	}
	
	startTime := time.Now()
	
	// 预览
	preview, err := ce.Preview(targets)
	if err != nil {
		result.Success = false
		result.Errors = append(result.Errors, types.CleanupError{
			Code:        "preview_failed",
			Message:     fmt.Sprintf("预览失败: %v", err),
			Timestamp:   time.Now(),
			Recoverable: true,
		})
		return result, err
	}
	
	// 显示预览
	ce.progress.ShowCleanupPreview(&ui.CleanupPreview{
		Actions:         preview.Actions,
		TotalSize:       preview.TotalSize,
		SafeToDelete:    preview.SafeToDelete,
		Warnings:        preview.Warnings,
		Recommendations: preview.Recommendations,
	})
	
	if dryRun {
		ce.prompter.Info("预览模式：未执行实际清理操作")
		return result, nil
	}
	
	// 备份
	if len(preview.Actions) > 0 && ce.backupMgr != nil {
		backupID, err := ce.backupMgr.CreateBackup(targets)
		if err != nil {
			ce.prompter.Warning(fmt.Sprintf("创建备份失败: %v", err))
		} else {
			result.BackupID = backupID
			ce.prompter.Success(fmt.Sprintf("备份创建成功: %s", backupID))
		}
	}
	
	// 执行清理
	ce.progress.SetTotal(int64(len(preview.Actions)))
	ce.progress.SetPrefix("清理中")
	
	for i, action := range preview.Actions {
		ce.progress.SetCurrent(int64(i + 1))
		
		if err := ce.executeAction(action); err != nil {
			result.Success = false
			result.Errors = append(result.Errors, types.CleanupError{
				Code:        "action_failed",
				Message:     fmt.Sprintf("执行操作失败: %v", err),
				FilePath:    action.Target.Path,
				Timestamp:   time.Now(),
				Recoverable: false,
			})
			continue
		}
		
		result.ActionsTaken = append(result.ActionsTaken, action)
		result.BytesFreed += action.Size
	}
	
	ce.progress.Finish()
	result.Duration = time.Since(startTime)
	
	return result, nil
}

// executeAction 执行单个操作
func (ce *CleanupEngine) executeAction(action types.CleanupAction) error {
	switch action.Type {
	case "delete":
		return ce.deleteFile(action.Target)
	default:
		return fmt.Errorf("不支持的操作类型: %s", action.Type)
	}
}

// deleteFile 删除文件
func (ce *CleanupEngine) deleteFile(file types.FileInfo) error {
	// 检查文件是否存在
	if _, err := os.Stat(file.Path); os.IsNotExist(err) {
		return fmt.Errorf("文件不存在: %s", file.Path)
	}
	
	// 删除文件
	return os.Remove(file.Path)
}

// Rollback 回滚操作
func (ce *CleanupEngine) Rollback(operationID string) error {
	// 这里实现回滚逻辑
	// 由于备份系统已经实现，可以从备份恢复
	return fmt.Errorf("回滚功能暂未实现")
}