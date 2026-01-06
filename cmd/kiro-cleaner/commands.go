package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/utils"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// scanCmd scan command
var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan storage usage",
	Long:  `Scan Kiro storage and show what can be cleaned.`,
	RunE:  runScan,
}

// cleanCmd clean command
var cleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Clean up redundant data",
	Long:  `Clean temp files, old logs, and cache. Use --dry-run to preview.`,
	RunE:  runClean,
}

func init() {
	// Add subcommands
	rootCmd.AddCommand(scanCmd)
	rootCmd.AddCommand(cleanCmd)
	
	// Clean command flags
	cleanCmd.Flags().BoolVar(&dryRun, "dry-run", false, "Preview only, no deletion")
	cleanCmd.Flags().BoolVarP(&force, "force", "f", false, "Skip confirmation")
}

var (
	dryRun bool
	force  bool
)

// runScan 扫描存储
func runScan(cmd *cobra.Command, args []string) error {
	fmt.Println("Scanning...")
	fmt.Println()
	
	// 扫描文件
	fileScanner := scanner.NewFileScanner()
	files, _ := fileScanner.Scan()
	stats, _ := fileScanner.GetStorageStats()
	if stats == nil {
		stats = &types.StorageStats{FileCounts: make(map[string]int)}
	}
	
	// 扫描对话
	chatScanner := scanner.NewChatScanner()
	convStats, _ := chatScanner.GetConversationStats()
	if convStats == nil {
		convStats = &types.ConversationStats{}
	}
	
	// 显示结果
	displayScanResult(stats, convStats, files)
	return nil
}

// runClean 清理数据
func runClean(cmd *cobra.Command, args []string) error {
	fmt.Println("Scanning for cleanable files...")
	fmt.Println()

	// 检测 Kiro 是否运行
	running, _, _ := utils.IsKiroRunning()
	if running && !dryRun {
		fmt.Println("[WARN] Kiro is running, some files may be locked")
		if !force {
			fmt.Print("Continue anyway? [y/N]: ")
			var input string
			fmt.Scanln(&input)
			if input != "y" && input != "Y" {
				fmt.Println("Cancelled")
				return nil
			}
		}
		fmt.Println()
	}

	// 扫描文件
	fileScanner := scanner.NewFileScanner()
	files, _ := fileScanner.Scan()
	
	// 收集要清理的文件：临时文件 + 7天前的日志
	var toClean []cleanItem
	var totalSize int64
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	
	for _, file := range files {
		if file.FileType == types.TypeTemp {
			toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "temp"})
			totalSize += file.Size
		} else if file.FileType == types.TypeLog && file.Modified.Before(sevenDaysAgo) {
			toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "old log"})
			totalSize += file.Size
		}
	}
	
	if len(toClean) == 0 {
		fmt.Println("[OK] Nothing to clean")
		return nil
	}
	
	// 显示要清理的内容
	fmt.Printf("Found %d files (%s) to clean:\n", len(toClean), storage.FormatSize(totalSize))
	
	// 按类型统计
	typeCount := make(map[string]int)
	typeSize := make(map[string]int64)
	for _, item := range toClean {
		typeCount[item.reason]++
		typeSize[item.reason] += item.size
	}
	for reason, count := range typeCount {
		fmt.Printf("  - %s: %d files (%s)\n", reason, count, storage.FormatSize(typeSize[reason]))
	}
	fmt.Println()
	
	// 预览模式
	if dryRun {
		fmt.Println("[INFO] Dry-run mode, no files deleted")
		return nil
	}
	
	// 确认
	if !force {
		fmt.Print("Delete these files? [y/N]: ")
		var input string
		fmt.Scanln(&input)
		if input != "y" && input != "Y" {
			fmt.Println("Cancelled")
			return nil
		}
	}
	
	// 执行清理
	var cleaned int
	var cleanedSize int64
	for _, item := range toClean {
		if err := os.Remove(item.path); err == nil {
			cleaned++
			cleanedSize += item.size
		}
	}
	
	fmt.Printf("\n[OK] Cleaned %d files, freed %s\n", cleaned, storage.FormatSize(cleanedSize))
	return nil
}

// cleanItem 清理项
type cleanItem struct {
	path   string
	size   int64
	reason string
}

// displayScanResult 显示扫描结果
func displayScanResult(stats *types.StorageStats, convStats *types.ConversationStats, files []types.FileInfo) {
	// 按类型统计文件大小
	typeSizes := make(map[types.FileType]int64)
	for _, file := range files {
		typeSizes[file.FileType] += file.Size
	}
	
	// 计算 Other（未分类的文件）
	otherSize := stats.TotalSize - stats.CacheSize - stats.LogSize - stats.TempSize - stats.DBSize
	if otherSize < 0 {
		otherSize = 0
	}
	
	// 存储统计
	fmt.Println("[Storage]")
	fmt.Printf("  Total:         %s\n", storage.FormatSize(stats.TotalSize+convStats.TotalSize))
	fmt.Printf("  Conversations: %s (%d)\n", storage.FormatSize(convStats.TotalSize), convStats.TotalConversations)
	fmt.Printf("  Logs:          %s\n", storage.FormatSize(stats.LogSize))
	fmt.Printf("  Cache:         %s\n", storage.FormatSize(stats.CacheSize))
	fmt.Printf("  Temp:          %s\n", storage.FormatSize(stats.TempSize))
	if otherSize > 0 {
		fmt.Printf("  Other:         %s\n", storage.FormatSize(otherSize))
	}
	fmt.Println()
	
	// 可清理项
	tempCount := 0
	var tempSize int64
	for _, file := range files {
		if file.FileType == types.TypeTemp {
			tempCount++
			tempSize += file.Size
		}
	}
	
	// 7天前的日志
	logCount := 0
	var logSize int64
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	for _, file := range files {
		if file.FileType == types.TypeLog && file.Modified.Before(sevenDaysAgo) {
			logCount++
			logSize += file.Size
		}
	}
	
	totalCleanable := tempSize + logSize
	if totalCleanable > 0 {
		fmt.Println("[Cleanable]")
		if tempCount > 0 {
			fmt.Printf("  Temp files:    %d files (%s)\n", tempCount, storage.FormatSize(tempSize))
		}
		if logCount > 0 {
			fmt.Printf("  Old logs:      %d files (%s)\n", logCount, storage.FormatSize(logSize))
		}
		fmt.Printf("  Total:         %s\n", storage.FormatSize(totalCleanable))
		fmt.Println()
		fmt.Println("Run 'kiro-cleaner clean' to free up space")
	} else {
		fmt.Println("[OK] Nothing to clean")
	}
}
