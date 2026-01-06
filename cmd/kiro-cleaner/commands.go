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
	"github.com/vibe-coding-labs/kiro-cleaner/internal/utils"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// scanCmd scan command - 统一的扫描命令
var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan storage usage and show status",
	Long: `Scan Kiro application storage usage and show status report.

By default shows a summary of storage usage.
Use --detailed for full analysis including redundancy detection and cleanup recommendations.

Examples:
  kiro-cleaner scan              # Quick summary
  kiro-cleaner scan --detailed   # Full analysis with recommendations`,
	RunE: runScan,
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
	rootCmd.AddCommand(scanCmd)
	rootCmd.AddCommand(cleanCmd)
	
	// Scan command flags
	scanCmd.Flags().BoolVar(&detailed, "detailed", false, "Show detailed analysis with recommendations")
	scanCmd.Flags().BoolVar(&showConversations, "conversations", false, "Show conversation details")
	scanCmd.Flags().IntVar(&conversationLimit, "limit", 10, "Limit number of conversations shown")
	
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

// runScan 运行扫描（统一命令）
func runScan(cmd *cobra.Command, args []string) error {
	if detailed {
		fmt.Println("Analyzing Kiro data...")
	} else {
		fmt.Println("Scanning Kiro storage...")
	}
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
	
	// 4. 根据模式显示不同详细程度的结果
	if detailed {
		// 详细模式：显示完整分析报告（原 status + analyze 功能）
		cleanable, err := chatScanner.FindCleanableConversations(30, 1024*1024)
		if err != nil {
			cleanable = []types.CleanableConversation{}
		}
		displayDetailedReport(stats, convStats, cleanable, files)
	} else {
		// 简洁模式：显示存储概览
		displayScanSummary(stats, convStats, files)
	}
	
	return nil
}

// runClean 运行清理
func runClean(cmd *cobra.Command, args []string) error {
	fmt.Println(renderer.RenderHeader("Kiro Data Cleanup"))
	fmt.Println()

	// 检测 Kiro 是否正在运行
	running, processes, err := utils.IsKiroRunning()
	if err != nil {
		fmt.Println(renderer.RenderWarning(fmt.Sprintf("检测 Kiro 进程失败: %v", err)))
	}

	if running {
		fmt.Println(renderer.RenderWarning(fmt.Sprintf("检测到 Kiro 正在运行 (%d 个进程)", len(processes))))
		fmt.Println("  清理时 Kiro 可能锁定数据库文件，建议先关闭 Kiro")
		fmt.Println()

		if !dryRun && !force {
			fmt.Print("是否自动关闭 Kiro 后继续清理? [y/N]: ")
			var input string
			fmt.Scanln(&input)
			if input == "y" || input == "Y" {
				fmt.Println("正在关闭 Kiro...")
				if err := utils.StopKiro(true); err != nil {
					fmt.Println(renderer.RenderError(fmt.Sprintf("关闭 Kiro 失败: %v", err)))
					fmt.Println("  请手动关闭 Kiro 后重试")
					return nil
				}
				fmt.Println(renderer.RenderSuccess("Kiro 已关闭"))
				fmt.Println()
			} else {
				fmt.Println("已取消，请手动关闭 Kiro 后重试")
				return nil
			}
		} else if force {
			// force 模式下自动关闭
			fmt.Println("正在关闭 Kiro...")
			if err := utils.StopKiro(true); err != nil {
				fmt.Println(renderer.RenderWarning(fmt.Sprintf("关闭 Kiro 失败: %v", err)))
			} else {
				fmt.Println(renderer.RenderSuccess("Kiro 已关闭"))
			}
			fmt.Println()
		}
	}

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
		fmt.Printf("\r  Cleaning... %d/%d", i+1, len(toClean))
		
		// 检查文件是否存在
		info, err := os.Stat(item.path)
		if err != nil {
			if os.IsNotExist(err) {
				// 文件已不存在，跳过
				continue
			}
			errors = append(errors, fmt.Sprintf("%s: %v", item.path, err))
			continue
		}
		
		// 跳过目录
		if info.IsDir() {
			continue
		}
		
		// 尝试删除文件
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
		// 显示前5个错误
		showCount := 5
		if len(errors) < showCount {
			showCount = len(errors)
		}
		for i := 0; i < showCount; i++ {
			fmt.Println("   " + errors[i])
		}
		if len(errors) > 5 {
			fmt.Printf("   ... and %d more errors (use -v to see all)\n", len(errors)-5)
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

// displayScanSummary 显示扫描摘要（简洁模式）
func displayScanSummary(stats *types.StorageStats, convStats *types.ConversationStats, files []types.FileInfo) {
	// 头部
	fmt.Println(renderer.RenderHeader("Kiro Storage Summary"))
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
	fmt.Println()
	fmt.Println("  Tip: Use --detailed for full analysis with cleanup recommendations")
}

// displayDetailedReport 显示详细报告（详细模式）
func displayDetailedReport(stats *types.StorageStats, convStats *types.ConversationStats, cleanable []types.CleanableConversation, files []types.FileInfo) {
	// 头部
	fmt.Println(renderer.RenderHeader("Kiro Data Analysis Report"))
	fmt.Println()
	
	// 存储统计
	fmt.Println(renderer.RenderStorageStats(stats))
	
	// 对话统计
	fmt.Println(renderer.RenderConversationStats(convStats))
	
	// 工作区分解
	if len(convStats.WorkspaceBreakdown) > 0 {
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
		recommendations = append(recommendations, fmt.Sprintf("Found %d old conversations (>30 days), consider: kiro-cleaner clean --chats", oldCount))
	}
	if largeCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d large conversations (>1MB), consider cleaning", largeCount))
	}
	if tempCount > 0 {
		recommendations = append(recommendations, fmt.Sprintf("Found %d temp files, run: kiro-cleaner clean --temp", tempCount))
	}
	if len(recommendations) == 0 {
		recommendations = append(recommendations, "Storage is clean, no action needed")
	}
	
	fmt.Println(renderer.RenderRecommendations(recommendations))
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

// 辅助函数：重复字符串
func repeatString(s string, n int) string {
	return strings.Repeat(s, n)
}
