package main

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// statusCmd status command
var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "View Kiro data status and recommendations",
	Long: `View detailed status of Kiro data including:
- Conversation statistics
- Storage usage breakdown
- Redundancy analysis
- Cleanup recommendations`,
	RunE: runStatus,
}

// scanCmd scan command
var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan storage usage",
	Long:  `Scan Kiro application storage usage, analyze file sizes and counts by type`,
	RunE:  runScan,
}

// analyzeCmd analyze command
var analyzeCmd = &cobra.Command{
	Use:   "analyze",
	Short: "Analyze data redundancy",
	Long:  `Deep analysis of Kiro data redundancy with detailed report`,
	RunE:  runAnalyze,
}

// cleanCmd clean command
var cleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Clean up redundant data",
	Long: `Clean up Kiro application redundant data including:
- Temp files
- Old log files (>7 days)
- Old conversations (>30 days, requires confirmation)
- Cache files

Use --dry-run to preview what will be cleaned
Use --force to skip confirmation`,
	RunE: runClean,
}

func init() {
	// Add subcommands
	rootCmd.AddCommand(statusCmd)
	rootCmd.AddCommand(scanCmd)
	rootCmd.AddCommand(analyzeCmd)
	rootCmd.AddCommand(cleanCmd)
	
	// Status command flags
	statusCmd.Flags().BoolVar(&detailed, "detailed", false, "Show detailed information")
	statusCmd.Flags().BoolVar(&showConversations, "conversations", false, "Show conversation details")
	statusCmd.Flags().IntVar(&conversationLimit, "limit", 10, "Limit number of conversations shown")
	
	// Clean command flags
	cleanCmd.Flags().BoolVar(&dryRun, "dry-run", false, "Preview mode, no actual deletion")
	cleanCmd.Flags().BoolVar(&force, "force", false, "Skip confirmation")
	cleanCmd.Flags().BoolVar(&cleanLogs, "logs", false, "Clean old log files")
	cleanCmd.Flags().BoolVar(&cleanCache, "cache", false, "Clean cache files")
	cleanCmd.Flags().BoolVar(&cleanTemp, "temp", true, "Clean temp files")
	cleanCmd.Flags().BoolVar(&cleanChats, "chats", false, "Clean old conversations (requires confirmation)")
	cleanCmd.Flags().IntVar(&chatAgeDays, "chat-age", 30, "Days to keep conversations")
}

var (
	detailed          bool
	showConversations bool
	conversationLimit int
	dryRun            bool
	force             bool
	cleanLogs         bool
	cleanCache        bool
	cleanTemp         bool
	cleanChats        bool
	chatAgeDays       int
)

// 创建渲染器
var renderer = ui.NewRenderer()

// runStatus 运行状态查看
func runStatus(cmd *cobra.Command, args []string) error {
	// 显示扫描中的提示
	fmt.Println("Scanning Kiro data...")
	fmt.Println()
	
	// 1. 扫描文件系统
	fileScanner := scanner.NewFileScanner()
	files, err := fileScanner.Scan()
	if err != nil && verbose {
		fmt.Println(renderer.RenderWarning(fmt.Sprintf("扫描文件失败: %v", err)))
	}
	
	// 2. 获取存储统计
	stats, err := fileScanner.GetStorageStats()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("获取存储统计失败: %v", err)))
		}
		stats = &types.StorageStats{FileCounts: make(map[string]int)}
	}
	
	// 3. 使用 ChatScanner 扫描对话数据
	chatScanner := scanner.NewChatScanner()
	convStats, err := chatScanner.GetConversationStats()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("扫描对话数据失败: %v", err)))
		}
		convStats = &types.ConversationStats{}
	}
	
	// 4. 查找可清理的对话
	cleanable, err := chatScanner.FindCleanableConversations(30, 1024*1024)
	if err != nil {
		cleanable = []types.CleanableConversation{}
	}
	
	// 5. 显示结果
	displayStatusPretty(stats, convStats, cleanable, files)
	
	return nil
}

// runScan 运行扫描
func runScan(cmd *cobra.Command, args []string) error {
	fmt.Println("Scanning Kiro storage...")
	fmt.Println()
	
	// 扫描文件系统
	fileScanner := scanner.NewFileScanner()
	files, err := fileScanner.Scan()
	if err != nil && verbose {
		fmt.Println(renderer.RenderWarning(fmt.Sprintf("扫描文件失败: %v", err)))
	}
	
	stats, err := fileScanner.GetStorageStats()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("获取统计失败: %v", err)))
		}
		stats = &types.StorageStats{FileCounts: make(map[string]int)}
	}
	
	// 扫描对话数据
	chatScanner := scanner.NewChatScanner()
	convStats, err := chatScanner.GetConversationStats()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("扫描对话数据失败: %v", err)))
		}
		convStats = &types.ConversationStats{}
	}
	
	displayScanPretty(stats, convStats, files)
	return nil
}

// runAnalyze 运行分析
func runAnalyze(cmd *cobra.Command, args []string) error {
	fmt.Println("Analyzing Kiro data redundancy...")
	fmt.Println()
	
	// 文件系统分析
	fileScanner := scanner.NewFileScanner()
	analysis, err := fileScanner.Analyze()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("分析失败: %v", err)))
		}
		analysis = &types.AnalysisResult{
			StorageStats: &types.StorageStats{FileCounts: make(map[string]int)},
		}
	}
	
	// 对话数据分析
	chatScanner := scanner.NewChatScanner()
	convStats, err := chatScanner.GetConversationStats()
	if err != nil {
		if verbose {
			fmt.Println(renderer.RenderWarning(fmt.Sprintf("扫描对话数据失败: %v", err)))
		}
		convStats = &types.ConversationStats{}
	}
	
	cleanable, err := chatScanner.FindCleanableConversations(30, 1024*1024)
	if err != nil {
		cleanable = []types.CleanableConversation{}
	}
	
	displayAnalyzePretty(analysis, convStats, cleanable)
	return nil
}

// runClean 运行清理
func runClean(cmd *cobra.Command, args []string) error {
	fmt.Println(renderer.RenderHeader("Kiro Data Cleanup"))
	fmt.Println()
	
	// 扫描文件
	fileScanner := scanner.NewFileScanner()
	files, err := fileScanner.Scan()
	if err != nil {
		return fmt.Errorf("扫描文件失败: %v", err)
	}
	
	// 扫描对话
	chatScanner := scanner.NewChatScanner()
	
	// 收集要清理的文件
	var toClean []cleanItem
	var totalSize int64
	
	// 临时文件
	if cleanTemp {
		for _, file := range files {
			if file.FileType == types.TypeTemp {
				toClean = append(toClean, cleanItem{
					path:   file.Path,
					size:   file.Size,
					reason: "临时文件",
				})
				totalSize += file.Size
			}
		}
	}
	
	// 旧日志文件
	if cleanLogs {
		sevenDaysAgo := time.Now().AddDate(0, 0, -7)
		for _, file := range files {
			if file.FileType == types.TypeLog && file.Modified.Before(sevenDaysAgo) {
				toClean = append(toClean, cleanItem{
					path:   file.Path,
					size:   file.Size,
					reason: "旧日志(>7天)",
				})
				totalSize += file.Size
			}
		}
	}
	
	// 缓存文件
	if cleanCache {
		for _, file := range files {
			if file.FileType == types.TypeCache {
				toClean = append(toClean, cleanItem{
					path:   file.Path,
					size:   file.Size,
					reason: "缓存文件",
				})
				totalSize += file.Size
			}
		}
	}
	
	// 旧对话文件
	if cleanChats {
		cleanable, err := chatScanner.FindCleanableConversations(chatAgeDays, 0)
		if err == nil {
			for _, c := range cleanable {
				if c.Reason == "old" {
					toClean = append(toClean, cleanItem{
						path:   c.Path,
						size:   c.Size,
						reason: fmt.Sprintf("旧对话(>%d天)", chatAgeDays),
					})
					totalSize += c.Size
				}
			}
		}
	}
	
	// 显示清理预览
	if len(toClean) == 0 {
		fmt.Println("[OK] No files need cleaning")
		return nil
	}
	
	fmt.Println(renderer.RenderSection("", "Items to Clean"))
	fmt.Println(strings.Repeat("-", 50))
	
	// 按类型分组统计
	typeStats := make(map[string]struct {
		count int
		size  int64
	})
	for _, item := range toClean {
		stat := typeStats[item.reason]
		stat.count++
		stat.size += item.size
		typeStats[item.reason] = stat
	}
	
	for reason, stat := range typeStats {
		fmt.Printf("  * %-20s %d items  %s\n",
			reason,
			stat.count,
			storage.FormatSize(stat.size))
	}
	
	fmt.Println()
	fmt.Printf("  Total: %d files, %s\n",
		len(toClean),
		storage.FormatSize(totalSize))
	fmt.Println()
	
	// 预览模式
	if dryRun {
		fmt.Println("[WARN] Dry-run mode: no files were deleted")
		fmt.Println("       Remove --dry-run flag to perform actual cleanup")
		return nil
	}
	
	// 确认
	if !force {
		fmt.Print("Confirm deletion? [y/N]: ")
		var input string
		fmt.Scanln(&input)
		if input != "y" && input != "Y" {
			fmt.Println("Cancelled")
			return nil
		}
	}
	
	// 执行清理
	fmt.Println()
	fmt.Println("Cleaning...")
	
	var cleaned int
	var cleanedSize int64
	var errors []string
	
	for i, item := range toClean {
		// 显示进度
		fmt.Printf("\r  清理中... %d/%d", i+1, len(toClean))
		
		if err := os.Remove(item.path); err != nil {
			errors = append(errors, fmt.Sprintf("%s: %v", item.path, err))
		} else {
			cleaned++
			cleanedSize += item.size
		}
	}
	fmt.Println()
	
	// 显示结果
	fmt.Println()
	if cleaned > 0 {
		fmt.Printf("[OK] Cleaned %d files, freed %s\n",
			cleaned, storage.FormatSize(cleanedSize))
	}
	
	if len(errors) > 0 {
		fmt.Printf("[ERROR] %d files failed to clean\n", len(errors))
		if verbose {
			for _, e := range errors {
				fmt.Println("   " + e)
			}
		}
	}
	
	return nil
}

// cleanItem 清理项
type cleanItem struct {
	path   string
	size   int64
	reason string
}

// displayStatusPretty 美化显示状态
func displayStatusPretty(stats *types.StorageStats, convStats *types.ConversationStats, cleanable []types.CleanableConversation, files []types.FileInfo) {
	// 头部
	fmt.Println(renderer.RenderHeader("Kiro Data Status Report"))
	fmt.Println()
	
	// 存储统计
	fmt.Println(renderer.RenderStorageStats(stats))
	
	// 对话统计
	fmt.Println(renderer.RenderConversationStats(convStats))
	
	// 工作区分解（详细模式）
	if detailed && len(convStats.WorkspaceBreakdown) > 0 {
		fmt.Println(renderer.RenderWorkspaceBreakdown(convStats.WorkspaceBreakdown))
	}
	
	// 可清理项目统计
	oldCount, largeCount := 0, 0
	var oldSize, largeSize int64
	for _, c := range cleanable {
		if c.Reason == "old" {
			oldCount++
			oldSize += c.Size
		} else if c.Reason == "large" {
			largeCount++
			largeSize += c.Size
		}
	}
	
	// 统计临时/日志文件
	tempCount := 0
	var tempSize int64
	for _, file := range files {
		if file.FileType == types.TypeTemp {
			tempCount++
			tempSize += file.Size
		}
	}
	
	fmt.Println(renderer.RenderCleanableItems(oldCount, largeCount, tempCount, oldSize, largeSize, tempSize))
	
	// 总节省空间
	totalSavings := oldSize + largeSize + tempSize
	fmt.Println(renderer.RenderTotalSavings(totalSavings))
	fmt.Println()
	
	// 建议
	var recommendations []string
	if oldCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d old conversations (>30 days), consider cleaning", oldCount))
	}
	if largeCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d large conversations (>1MB), consider cleaning", largeCount))
	}
	if tempCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d temp/old log files, recommend cleaning", tempCount))
	}
	if len(recommendations) == 0 {
		recommendations = append(recommendations, "No data needs cleaning")
	}
	
	fmt.Println(renderer.RenderRecommendations(recommendations))
}

// displayScanPretty 美化显示扫描结果
func displayScanPretty(stats *types.StorageStats, convStats *types.ConversationStats, files []types.FileInfo) {
	// 头部
	fmt.Println(renderer.RenderHeader("Kiro Storage Scan Results"))
	fmt.Println()
	
	// 表格数据
	headers := []string{"Type", "Size", "Count"}
	rows := [][]string{
		{"Total", storage.FormatSize(stats.TotalSize + convStats.TotalSize), fmt.Sprintf("%d", len(files)+convStats.TotalConversations)},
		{"Conversations", storage.FormatSize(convStats.TotalSize), fmt.Sprintf("%d", convStats.TotalConversations)},
		{"Cache", storage.FormatSize(stats.CacheSize), fmt.Sprintf("%d", stats.FileCounts["缓存"])},
		{"Logs", storage.FormatSize(stats.LogSize), fmt.Sprintf("%d", stats.FileCounts["日志"])},
		{"Temp Files", storage.FormatSize(stats.TempSize), fmt.Sprintf("%d", stats.FileCounts["临时"])},
	}
	
	fmt.Println(renderer.RenderTable(headers, rows))
	
	// 对话统计
	fmt.Printf("\n  Total Messages: %d\n", convStats.TotalMessages)
	fmt.Printf("  Workspaces: %d\n", len(convStats.WorkspaceBreakdown))
}

// displayAnalyzePretty 美化显示分析结果
func displayAnalyzePretty(analysis *types.AnalysisResult, convStats *types.ConversationStats, cleanable []types.CleanableConversation) {
	// 头部
	fmt.Println(renderer.RenderHeader("Kiro Redundancy Analysis Report"))
	fmt.Println()
	
	stats := analysis.StorageStats
	
	// 存储概览
	fmt.Println("[Storage Overview]")
	fmt.Println(strings.Repeat("-", 50))
	fmt.Printf("  File System Storage: %s\n", storage.FormatSize(stats.TotalSize))
	fmt.Printf("  Conversation Storage: %s\n", storage.FormatSize(convStats.TotalSize))
	fmt.Printf("  Total Storage Used:   %s\n", storage.FormatSize(stats.TotalSize+convStats.TotalSize))
	fmt.Println()
	
	// 可清理对话统计
	var oldSize, largeSize int64
	oldCount, largeCount := 0, 0
	for _, c := range cleanable {
		if c.Reason == "old" {
			oldCount++
			oldSize += c.Size
		} else {
			largeCount++
			largeSize += c.Size
		}
	}
	
	fmt.Println(renderer.RenderCleanableItems(oldCount, largeCount, 0, oldSize, largeSize, 0))
	
	// 总节省空间
	totalSavings := analysis.SpaceSavings + oldSize + largeSize
	fmt.Println(renderer.RenderTotalSavings(totalSavings))
	fmt.Println()
	
	// 建议
	var recommendations []string
	recommendations = append(recommendations, analysis.Recommendations...)
	if oldCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d old conversations (>30 days), consider cleaning", oldCount))
	}
	if largeCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d large conversations (>1MB), consider cleaning", largeCount))
	}
	
	if len(recommendations) > 0 {
		fmt.Println(renderer.RenderRecommendations(recommendations))
	}
}

// 保留旧的显示函数用于兼容（可以删除）
func displayStatus(stats *types.StorageStats, dbAnalysis *DBAnalysis, files []types.FileInfo) {
	displayStatusPretty(stats, &types.ConversationStats{}, []types.CleanableConversation{}, files)
}

func displayScanResults(stats *types.StorageStats, files []types.FileInfo) {
	displayScanPretty(stats, &types.ConversationStats{}, files)
}

func displayAnalysis(analysis *types.AnalysisResult) {
	displayAnalyzePretty(analysis, &types.ConversationStats{}, []types.CleanableConversation{})
}

// DBAnalysis 数据库分析结果（保留用于兼容）
type DBAnalysis struct {
	TotalConversations int
	TotalMessages      int
	AvgMessagesPerConv float64
	OldConversations   int
	LargeConversations int
	EmptyConversations int
	TotalSize          int64
}

// displayRecentConversations 显示最近对话
func displayRecentConversations() {
	fmt.Println(renderer.RenderInfo("使用 --detailed --conversations 查看详细信息"))
}

// 删除不再需要的旧函数
func displayStatusNew(stats *types.StorageStats, convStats *types.ConversationStats, cleanable []types.CleanableConversation, files []types.FileInfo) {
	displayStatusPretty(stats, convStats, cleanable, files)
}

func displayScanResultsNew(stats *types.StorageStats, convStats *types.ConversationStats, files []types.FileInfo) {
	displayScanPretty(stats, convStats, files)
}

func displayAnalysisNew(analysis *types.AnalysisResult, convStats *types.ConversationStats, cleanable []types.CleanableConversation) {
	displayAnalyzePretty(analysis, convStats, cleanable)
}

// 辅助函数：重复字符串
func repeatString(s string, n int) string {
	return strings.Repeat(s, n)
}
