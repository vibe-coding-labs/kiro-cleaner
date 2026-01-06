package ui

import (
	"fmt"
	"strings"

	"github.com/pterm/pterm"
)

// TerminalUI 终端 UI 组件
type TerminalUI struct{}

// NewTerminalUI 创建终端 UI
func NewTerminalUI() *TerminalUI {
	// 禁用颜色调试信息
	pterm.PrintDebugMessages = false
	return &TerminalUI{}
}

// PrintBanner 打印横幅
func (t *TerminalUI) PrintBanner() {
	pterm.DefaultCenter.Println(
		pterm.NewStyle(pterm.FgCyan, pterm.Bold).Sprint("🧹 Kiro Cleaner"),
	)
	fmt.Println()
}

// PrintHeader 打印标题
func (t *TerminalUI) PrintHeader(title string) {
	pterm.DefaultHeader.
		WithBackgroundStyle(pterm.NewStyle(pterm.BgCyan)).
		WithTextStyle(pterm.NewStyle(pterm.FgBlack, pterm.Bold)).
		Println(title)
	fmt.Println()
}

// PrintSection 打印分区标题
func (t *TerminalUI) PrintSection(title string) {
	fmt.Println()
	pterm.NewStyle(pterm.FgCyan, pterm.Bold).Println("━━━ " + title + " " + strings.Repeat("━", 40-len(title)))
	fmt.Println()
}

// PrintSuccess 打印成功消息
func (t *TerminalUI) PrintSuccess(msg string) {
	pterm.Success.Println(msg)
}

// PrintWarning 打印警告消息
func (t *TerminalUI) PrintWarning(msg string) {
	pterm.Warning.Println(msg)
}

// PrintError 打印错误消息
func (t *TerminalUI) PrintError(msg string) {
	pterm.Error.Println(msg)
}

// PrintInfo 打印信息
func (t *TerminalUI) PrintInfo(msg string) {
	pterm.Info.Println(msg)
}

// StorageItem 存储项
type StorageItem struct {
	Name    string
	Size    string
	Extra   string
	Color   pterm.Color
	IsTotal bool
}

// PrintStorageOverview 打印存储概览
func (t *TerminalUI) PrintStorageOverview(items []StorageItem) {
	t.PrintSection("Storage Overview")
	
	for _, item := range items {
		name := pterm.NewStyle(item.Color, pterm.Bold).Sprintf("%-14s", item.Name)
		size := pterm.NewStyle(pterm.FgWhite).Sprintf("%10s", item.Size)
		
		if item.IsTotal {
			// Total 行特殊处理
			fmt.Println(strings.Repeat("─", 44))
			name = pterm.NewStyle(pterm.FgWhite, pterm.Bold).Sprintf("%-14s", item.Name)
			size = pterm.NewStyle(pterm.FgGreen, pterm.Bold).Sprintf("%10s", item.Size)
		}
		
		if item.Extra != "" {
			extra := pterm.NewStyle(pterm.FgGray).Sprintf("  %s", item.Extra)
			fmt.Printf("  %s %s%s\n", name, size, extra)
		} else {
			fmt.Printf("  %s %s\n", name, size)
		}
	}
}

// CleanableItem 可清理项
type CleanableItem struct {
	Name    string
	Size    string
	Count   string
	Percent float64
	Color   pterm.Color
}

// PrintCleanableItems 打印可清理项
func (t *TerminalUI) PrintCleanableItems(items []CleanableItem, total string) {
	t.PrintSection("Cleanable Items")
	
	// 定义颜色
	colors := []pterm.Color{
		pterm.FgRed,
		pterm.FgYellow,
		pterm.FgBlue,
		pterm.FgMagenta,
		pterm.FgCyan,
		pterm.FgGreen,
	}
	
	for i, item := range items {
		color := colors[i%len(colors)]
		if item.Color != 0 {
			color = item.Color
		}
		
		bullet := pterm.NewStyle(color).Sprint("●")
		name := pterm.NewStyle(pterm.FgWhite, pterm.Bold).Sprintf("%-12s", item.Name)
		size := pterm.NewStyle(color).Sprintf("%10s", item.Size)
		
		if item.Count != "" {
			count := pterm.NewStyle(pterm.FgGray).Sprintf("  %s", item.Count)
			fmt.Printf("  %s %s %s%s\n", bullet, name, size, count)
		} else {
			fmt.Printf("  %s %s %s\n", bullet, name, size)
		}
	}
	
	// Total
	fmt.Println()
	fmt.Println(strings.Repeat("─", 44))
	checkmark := pterm.NewStyle(pterm.FgGreen).Sprint("✓")
	totalLabel := pterm.NewStyle(pterm.FgWhite, pterm.Bold).Sprint("Total")
	totalSize := pterm.NewStyle(pterm.FgGreen, pterm.Bold).Sprintf("%10s", total)
	fmt.Printf("  %s %s        %s\n", checkmark, totalLabel, totalSize)
}

// PrintTips 打印提示
func (t *TerminalUI) PrintTips(tips []string) {
	fmt.Println()
	box := pterm.DefaultBox.
		WithTitle(pterm.NewStyle(pterm.FgYellow).Sprint("💡 Tips")).
		WithTitleTopLeft().
		WithLeftPadding(2).
		WithRightPadding(2).
		WithBoxStyle(pterm.NewStyle(pterm.FgGray))
	
	var content string
	for _, tip := range tips {
		content += pterm.NewStyle(pterm.FgWhite).Sprint("• "+tip) + "\n"
	}
	
	box.Println(strings.TrimSuffix(content, "\n"))
}

// Confirm 确认对话框
func (t *TerminalUI) Confirm(msg string) bool {
	result, _ := pterm.DefaultInteractiveConfirm.
		WithDefaultText(msg).
		WithDefaultValue(false).
		Show()
	return result
}

// PrintCleanResult 打印清理结果
func (t *TerminalUI) PrintCleanResult(cleaned int, freedSize string, errors int) {
	fmt.Println()
	if cleaned > 0 {
		pterm.Success.Printf("Cleaned %d files, freed %s\n", cleaned, freedSize)
	}
	if errors > 0 {
		pterm.Warning.Printf("%d files failed (may be locked by Kiro)\n", errors)
	}
}

// PrintDryRunNotice 打印预览模式提示
func (t *TerminalUI) PrintDryRunNotice() {
	fmt.Println()
	pterm.Info.WithMessageStyle(pterm.NewStyle(pterm.FgYellow)).
		Println("Dry-run mode: no files were deleted")
}

// Spinner 创建加载动画
func (t *TerminalUI) Spinner(msg string) *pterm.SpinnerPrinter {
	spinner, _ := pterm.DefaultSpinner.
		WithStyle(pterm.NewStyle(pterm.FgCyan)).
		WithRemoveWhenDone(true).
		WithShowTimer(false).
		Start(msg)
	return spinner
}

// PrintConfigTable 打印配置表格
func (t *TerminalUI) PrintConfigTable(configPath string, settings [][]string) {
	t.PrintSection("Configuration")
	
	pterm.NewStyle(pterm.FgGray).Printf("  File: %s\n\n", configPath)
	
	for _, row := range settings {
		name := pterm.NewStyle(pterm.FgWhite, pterm.Bold).Sprintf("%-14s", row[0])
		value := row[1]
		if value == "true" {
			value = pterm.NewStyle(pterm.FgGreen).Sprint("true")
		} else if value == "false" {
			value = pterm.NewStyle(pterm.FgRed).Sprint("false")
		} else {
			value = pterm.NewStyle(pterm.FgCyan).Sprint(value)
		}
		desc := pterm.NewStyle(pterm.FgGray).Sprint(row[2])
		fmt.Printf("  %s %s  %s\n", name, value, desc)
	}
}

// PrintCleanPreview 打印清理预览
func (t *TerminalUI) PrintCleanPreview(fileCount int, totalSize string) {
	t.PrintSection(fmt.Sprintf("Found %d files (%s) to clean", fileCount, totalSize))
}
