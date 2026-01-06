package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"time"

	"github.com/pterm/pterm"
	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/config"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/scanner"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/utils"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

var termUI = ui.NewTerminalUI()

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
	Short: "Clean up all redundant data",
	Long: `Clean all redundant data by default (temp, logs, cache, chats, index).
Use --keep-* flags to preserve specific types.
Use --dry-run to preview what will be cleaned.

Global config: ~/.kiro-cleaner/config.json`,
	RunE:  runClean,
}

// configCmd config command
var configCmd = &cobra.Command{
	Use:   "config",
	Short: "Show or edit global config",
	Long:  `Show current global config or edit it. Config file: ~/.kiro-cleaner/config.json`,
	RunE:  runConfig,
}

// installCmd install command
var installCmd = &cobra.Command{
	Use:   "install",
	Short: "Install kiro-cleaner to system PATH",
	Long:  `Install kiro-cleaner binary to /usr/local/bin for easy access from anywhere.`,
	RunE:  runInstall,
}

// uninstallCmd uninstall command
var uninstallCmd = &cobra.Command{
	Use:   "uninstall",
	Short: "Remove kiro-cleaner from system PATH",
	Long:  `Remove kiro-cleaner binary from /usr/local/bin.`,
	RunE:  runUninstall,
}

func init() {
	// Add subcommands
	rootCmd.AddCommand(scanCmd)
	rootCmd.AddCommand(cleanCmd)
	rootCmd.AddCommand(configCmd)
	rootCmd.AddCommand(installCmd)
	rootCmd.AddCommand(uninstallCmd)
	
	// 为所有子命令设置自定义帮助函数
	for _, cmd := range rootCmd.Commands() {
		cmd.SetHelpFunc(customSubCmdHelpFunc)
	}
	
	// Clean command flags (override global config)
	cleanCmd.Flags().BoolVar(&dryRun, "dry-run", false, "Preview only, no deletion")
	cleanCmd.Flags().BoolVarP(&force, "force", "f", false, "Skip confirmation")
	cleanCmd.Flags().BoolVar(&killKiro, "kill-kiro", false, "Automatically stop Kiro before cleaning")
	cleanCmd.Flags().BoolVar(&keepLogs, "keep-logs", false, "Keep log files")
	cleanCmd.Flags().BoolVar(&keepCache, "keep-cache", false, "Keep cache files")
	cleanCmd.Flags().BoolVar(&keepChats, "keep-chats", false, "Keep chat conversations")
	cleanCmd.Flags().BoolVar(&keepIndex, "keep-index", false, "Keep code index")
	cleanCmd.Flags().IntVar(&keepRecent, "keep-recent", 0, "Keep files modified within N days (0=keep none)")
	
	// Install command flags
	installCmd.Flags().StringVar(&installPath, "path", defaultInstallPath(), "Installation path")
}

var (
	dryRun      bool
	force       bool
	killKiro    bool
	keepLogs    bool
	keepCache   bool
	keepChats   bool
	keepIndex   bool
	keepRecent  int
	installPath string
)

// defaultInstallPath 返回默认安装路径
func defaultInstallPath() string {
	if runtime.GOOS == "windows" {
		return filepath.Join(os.Getenv("LOCALAPPDATA"), "Programs", "kiro-cleaner")
	}
	return "/usr/local/bin"
}

// runScan 扫描存储
func runScan(cmd *cobra.Command, args []string) error {
	spinner := termUI.Spinner("Scanning Kiro storage...")
	
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
	
	spinner.Success("Scan complete")
	fmt.Println()
	
	// 显示结果
	displayScanResult(stats, convStats, files)
	return nil
}

// runClean 清理数据
func runClean(cmd *cobra.Command, args []string) error {
	// 加载全局配置
	cfg := config.LoadConfig()
	
	// 命令行参数覆盖全局配置
	if !cmd.Flags().Changed("keep-logs") {
		keepLogs = cfg.KeepLogs
	}
	if !cmd.Flags().Changed("keep-cache") {
		keepCache = cfg.KeepCache
	}
	if !cmd.Flags().Changed("keep-chats") {
		keepChats = cfg.KeepChats
	}
	if !cmd.Flags().Changed("keep-index") {
		keepIndex = cfg.KeepIndex
	}
	if !cmd.Flags().Changed("keep-recent") && cfg.KeepRecent > 0 {
		keepRecent = cfg.KeepRecent
	}
	
	spinner := termUI.Spinner("Scanning for cleanable files...")

	// 检测 Kiro 是否运行
	running, _, _ := utils.IsKiroRunning()
	
	// 如果 Kiro 正在运行且设置了 --kill-kiro，先停止 Kiro
	if running && killKiro && !dryRun {
		spinner.UpdateText("Stopping Kiro...")
		if err := utils.StopKiro(true); err != nil {
			spinner.Fail("Failed to stop Kiro")
			termUI.PrintWarning(fmt.Sprintf("Could not stop Kiro: %v", err))
			termUI.PrintInfo("Try closing Kiro manually or use --force to continue anyway")
			if !force {
				return nil
			}
		} else {
			// 等待 Kiro 完全退出
			if utils.WaitForKiroExit(5 * time.Second) {
				running = false
				spinner.UpdateText("Scanning for cleanable files...")
			} else {
				spinner.Fail("Kiro did not exit in time")
				termUI.PrintWarning("Kiro is still running, some files may be locked")
			}
		}
	}
	
	// 扫描文件
	fileScanner := scanner.NewFileScanner()
	files, _ := fileScanner.Scan()
	
	// 扫描会话
	chatScanner := scanner.NewChatScanner()
	
	// 收集要清理的文件
	var toClean []cleanItem
	var totalSize int64
	
	// 计算保留截止时间
	var keepCutoff time.Time
	if keepRecent > 0 {
		keepCutoff = time.Now().AddDate(0, 0, -keepRecent)
	}
	
	// 处理文件系统中的文件
	for _, file := range files {
		// 如果设置了 keepRecent，跳过最近的文件
		if keepRecent > 0 && file.Modified.After(keepCutoff) {
			continue
		}
		
		switch file.FileType {
		case types.TypeTemp:
			toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "temp"})
			totalSize += file.Size
		case types.TypeLog:
			if !keepLogs {
				toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "log"})
				totalSize += file.Size
			}
		case types.TypeCache:
			if !keepCache {
				toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "cache"})
				totalSize += file.Size
			}
		case types.TypeBackup:
			toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "history"})
			totalSize += file.Size
		case types.TypeIndex:
			if !keepIndex {
				toClean = append(toClean, cleanItem{path: file.Path, size: file.Size, reason: "index"})
				totalSize += file.Size
			}
		}
	}
	
	// 处理会话文件
	if !keepChats {
		allChats, err := chatScanner.FindCleanableConversations(0, 0)
		if err == nil {
			for _, chat := range allChats {
				if keepRecent > 0 && chat.ModTime.After(keepCutoff) {
					continue
				}
				toClean = append(toClean, cleanItem{path: chat.Path, size: chat.Size, reason: "chat"})
				totalSize += chat.Size
			}
		}
	}
	
	spinner.Success("Scan complete")
	fmt.Println()
	
	// Kiro 运行警告
	if running && !dryRun {
		termUI.PrintWarning("Kiro is running, some files may be locked")
		termUI.PrintInfo("Use --kill-kiro to automatically stop Kiro before cleaning")
		if !force {
			if !termUI.Confirm("Continue anyway?") {
				pterm.Info.Println("Cancelled")
				return nil
			}
		}
		fmt.Println()
	}
	
	if len(toClean) == 0 {
		termUI.PrintSuccess("Nothing to clean")
		return nil
	}
	
	// 按类型统计
	typeCount := make(map[string]int)
	typeSize := make(map[string]int64)
	for _, item := range toClean {
		typeCount[item.reason]++
		typeSize[item.reason] += item.size
	}
	
	// 显示要清理的内容
	termUI.PrintCleanPreview(len(toClean), storage.FormatSize(totalSize))
	
	// 构建清理列表
	var cleanItems []ui.CleanableItem
	displayOrder := []struct {
		key   string
		color pterm.Color
	}{
		{"log", pterm.FgYellow},
		{"cache", pterm.FgBlue},
		{"index", pterm.FgGreen},
		{"chat", pterm.FgCyan},
		{"history", pterm.FgMagenta},
		{"temp", pterm.FgRed},
	}
	
	for _, item := range displayOrder {
		if count, ok := typeCount[item.key]; ok {
			countStr := fmt.Sprintf("%d files", count)
			if item.key == "chat" {
				countStr = fmt.Sprintf("%d conversations", count)
			}
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name:  item.key,
				Size:  storage.FormatSize(typeSize[item.key]),
				Count: countStr,
				Color: item.color,
			})
		}
	}
	
	termUI.PrintCleanableItems(cleanItems, storage.FormatSize(totalSize))
	
	// 预览模式
	if dryRun {
		termUI.PrintDryRunNotice()
		return nil
	}
	
	// 确认
	if !force {
		if !termUI.Confirm("Delete these files?") {
			pterm.Info.Println("Cancelled")
			return nil
		}
	}
	
	// 执行清理
	progressBar, _ := pterm.DefaultProgressbar.
		WithTotal(len(toClean)).
		WithTitle("Cleaning").
		WithBarStyle(pterm.NewStyle(pterm.FgCyan)).
		Start()
	
	var cleaned int
	var cleanedSize int64
	var errors int
	
	for _, item := range toClean {
		if err := os.Remove(item.path); err == nil {
			cleaned++
			cleanedSize += item.size
		} else {
			errors++
		}
		progressBar.Increment()
	}
	
	progressBar.Stop()
	termUI.PrintCleanResult(cleaned, storage.FormatSize(cleanedSize), errors)
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
	// 按类型统计文件大小和数量
	typeSizes := make(map[types.FileType]int64)
	typeCounts := make(map[types.FileType]int)
	for _, file := range files {
		typeSizes[file.FileType] += file.Size
		typeCounts[file.FileType]++
	}
	
	// 计算 Other
	classifiedSize := stats.CacheSize + stats.LogSize + stats.TempSize + typeSizes[types.TypeBackup] + typeSizes[types.TypeIndex] + convStats.TotalSize
	otherSize := stats.TotalSize + convStats.TotalSize - classifiedSize
	if otherSize < 0 {
		otherSize = 0
	}
	
	// 存储概览
	storageItems := []ui.StorageItem{
		{Name: "Conversations", Size: storage.FormatSize(convStats.TotalSize), Extra: fmt.Sprintf("%d chats", convStats.TotalConversations), Color: pterm.FgCyan},
		{Name: "Logs", Size: storage.FormatSize(stats.LogSize), Color: pterm.FgYellow},
		{Name: "Cache", Size: storage.FormatSize(stats.CacheSize), Color: pterm.FgBlue},
		{Name: "Index", Size: storage.FormatSize(typeSizes[types.TypeIndex]), Extra: "code search", Color: pterm.FgGreen},
		{Name: "History", Size: storage.FormatSize(typeSizes[types.TypeBackup]), Color: pterm.FgMagenta},
		{Name: "Temp", Size: storage.FormatSize(stats.TempSize), Color: pterm.FgRed},
	}
	
	if otherSize > 0 {
		storageItems = append(storageItems, ui.StorageItem{
			Name: "Other", Size: storage.FormatSize(otherSize), Extra: "config, etc.", Color: pterm.FgGray,
		})
	}
	
	// 添加 Total
	storageItems = append(storageItems, ui.StorageItem{
		Name: "Total", Size: storage.FormatSize(stats.TotalSize + convStats.TotalSize), IsTotal: true,
	})
	
	termUI.PrintStorageOverview(storageItems)
	
	// 可清理项统计
	tempSize := typeSizes[types.TypeTemp]
	logSize := stats.LogSize
	cacheSize := stats.CacheSize
	historySize := typeSizes[types.TypeBackup]
	indexSize := typeSizes[types.TypeIndex]
	chatSize := convStats.TotalSize
	chatCount := convStats.TotalConversations
	
	totalCleanable := tempSize + logSize + cacheSize + historySize + indexSize + chatSize
	
	if totalCleanable > 0 {
		var cleanItems []ui.CleanableItem
		
		if logSize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "Logs", Size: storage.FormatSize(logSize), Color: pterm.FgYellow,
			})
		}
		if cacheSize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "Cache", Size: storage.FormatSize(cacheSize), Color: pterm.FgBlue,
			})
		}
		if indexSize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "Index", Size: storage.FormatSize(indexSize), Count: "will rebuild", Color: pterm.FgGreen,
			})
		}
		if chatSize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "Chats", Size: storage.FormatSize(chatSize), Count: fmt.Sprintf("%d conversations", chatCount), Color: pterm.FgCyan,
			})
		}
		if historySize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "History", Size: storage.FormatSize(historySize), Color: pterm.FgMagenta,
			})
		}
		if tempSize > 0 {
			cleanItems = append(cleanItems, ui.CleanableItem{
				Name: "Temp", Size: storage.FormatSize(tempSize), Count: fmt.Sprintf("%d files", typeCounts[types.TypeTemp]), Color: pterm.FgRed,
			})
		}
		
		termUI.PrintCleanableItems(cleanItems, storage.FormatSize(totalCleanable))
		
		// 提示
		termUI.PrintTips([]string{
			"Run 'kiro-cleaner clean' to free up space",
			"Use --keep-* flags to preserve specific types",
			"Use --dry-run to preview without deleting",
		})
	} else {
		fmt.Println()
		termUI.PrintSuccess("Nothing to clean - your Kiro is tidy!")
	}
}

// runConfig 显示或编辑配置
func runConfig(cmd *cobra.Command, args []string) error {
	cfg := config.LoadConfig()
	
	settings := [][]string{
		{"keep_logs", fmt.Sprintf("%v", cfg.KeepLogs), "Keep log files"},
		{"keep_cache", fmt.Sprintf("%v", cfg.KeepCache), "Keep cache files"},
		{"keep_chats", fmt.Sprintf("%v", cfg.KeepChats), "Keep conversations"},
		{"keep_index", fmt.Sprintf("%v", cfg.KeepIndex), "Keep code index"},
		{"keep_recent", fmt.Sprintf("%d days", cfg.KeepRecent), "Keep recent files"},
	}
	
	termUI.PrintConfigTable(config.ConfigPath(), settings)
	
	// 提示
	termUI.PrintTips([]string{
		"Edit the config file to change defaults",
		"Command line flags override config",
		"Set keep_* to true to preserve by default",
	})
	
	// 确保配置文件存在
	if err := config.EnsureConfigExists(); err != nil {
		return fmt.Errorf("failed to create config: %v", err)
	}
	
	return nil
}

// runInstall 安装到系统 PATH
func runInstall(cmd *cobra.Command, args []string) error {
	// 获取当前可执行文件路径
	execPath, err := os.Executable()
	if err != nil {
		termUI.PrintError(fmt.Sprintf("Failed to get executable path: %v", err))
		return err
	}
	
	// 解析符号链接
	execPath, err = filepath.EvalSymlinks(execPath)
	if err != nil {
		termUI.PrintError(fmt.Sprintf("Failed to resolve path: %v", err))
		return err
	}
	
	// 目标路径
	destPath := filepath.Join(installPath, "kiro-cleaner")
	if runtime.GOOS == "windows" {
		destPath += ".exe"
	}
	
	termUI.PrintSection("Install kiro-cleaner")
	
	fmt.Printf("  Source: %s\n", pterm.NewStyle(pterm.FgGray).Sprint(execPath))
	fmt.Printf("  Target: %s\n", pterm.NewStyle(pterm.FgCyan).Sprint(destPath))
	fmt.Println()
	
	// 检查是否已安装
	if _, err := os.Stat(destPath); err == nil {
		termUI.PrintWarning("kiro-cleaner is already installed")
		if !termUI.Confirm("Overwrite existing installation?") {
			pterm.Info.Println("Cancelled")
			return nil
		}
	}
	
	// 检查是否需要 sudo
	needSudo := false
	if runtime.GOOS != "windows" {
		// 尝试创建目录
		if err := os.MkdirAll(installPath, 0755); err != nil {
			needSudo = true
		} else {
			// 尝试写入测试文件
			testFile := filepath.Join(installPath, ".kiro-cleaner-test")
			if err := os.WriteFile(testFile, []byte{}, 0644); err != nil {
				needSudo = true
			} else {
				os.Remove(testFile)
			}
		}
	}
	
	if needSudo {
		termUI.PrintInfo("Requires administrator privileges")
		fmt.Println()
		
		// 使用 sudo 复制
		sudoCmd := exec.Command("sudo", "cp", execPath, destPath)
		sudoCmd.Stdin = os.Stdin
		sudoCmd.Stdout = os.Stdout
		sudoCmd.Stderr = os.Stderr
		
		if err := sudoCmd.Run(); err != nil {
			termUI.PrintError(fmt.Sprintf("Installation failed: %v", err))
			return err
		}
		
		// 设置权限
		chmodCmd := exec.Command("sudo", "chmod", "+x", destPath)
		chmodCmd.Run()
	} else {
		// 直接复制
		if err := copyFile(execPath, destPath); err != nil {
			termUI.PrintError(fmt.Sprintf("Installation failed: %v", err))
			return err
		}
		
		// 设置可执行权限
		if runtime.GOOS != "windows" {
			os.Chmod(destPath, 0755)
		}
	}
	
	fmt.Println()
	termUI.PrintSuccess("kiro-cleaner installed successfully!")
	fmt.Println()
	termUI.PrintTips([]string{
		"Run 'kiro-cleaner' from anywhere",
		"Use 'kiro-cleaner uninstall' to remove",
	})
	
	return nil
}

// runUninstall 从系统 PATH 卸载
func runUninstall(cmd *cobra.Command, args []string) error {
	// 目标路径
	destPath := filepath.Join(defaultInstallPath(), "kiro-cleaner")
	if runtime.GOOS == "windows" {
		destPath += ".exe"
	}
	
	termUI.PrintSection("Uninstall kiro-cleaner")
	
	// 检查是否已安装
	if _, err := os.Stat(destPath); os.IsNotExist(err) {
		termUI.PrintWarning("kiro-cleaner is not installed in system PATH")
		return nil
	}
	
	fmt.Printf("  Path: %s\n", pterm.NewStyle(pterm.FgCyan).Sprint(destPath))
	fmt.Println()
	
	if !termUI.Confirm("Remove kiro-cleaner from system?") {
		pterm.Info.Println("Cancelled")
		return nil
	}
	
	// 检查是否需要 sudo
	needSudo := false
	if runtime.GOOS != "windows" {
		if err := os.Remove(destPath); err != nil {
			if os.IsPermission(err) {
				needSudo = true
			} else {
				termUI.PrintError(fmt.Sprintf("Uninstall failed: %v", err))
				return err
			}
		}
	}
	
	if needSudo {
		termUI.PrintInfo("Requires administrator privileges")
		fmt.Println()
		
		sudoCmd := exec.Command("sudo", "rm", destPath)
		sudoCmd.Stdin = os.Stdin
		sudoCmd.Stdout = os.Stdout
		sudoCmd.Stderr = os.Stderr
		
		if err := sudoCmd.Run(); err != nil {
			termUI.PrintError(fmt.Sprintf("Uninstall failed: %v", err))
			return err
		}
	}
	
	// 删除配置目录（可选）
	configDir := config.ConfigDir()
	if _, err := os.Stat(configDir); err == nil {
		fmt.Println()
		if termUI.Confirm("Also remove config directory (~/.kiro-cleaner)?") {
			os.RemoveAll(configDir)
			pterm.Info.Println("Config directory removed")
		}
	}
	
	fmt.Println()
	termUI.PrintSuccess("kiro-cleaner uninstalled successfully!")
	
	return nil
}

// copyFile 复制文件
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()
	
	// 确保目标目录存在
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	
	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()
	
	_, err = io.Copy(destFile, sourceFile)
	return err
}
