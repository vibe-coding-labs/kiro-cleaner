package ui

import (
	"fmt"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/pterm/pterm"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
	"golang.org/x/term"
)

// ProgressDisplay 进度展示组件
type ProgressDisplay struct {
	area        *pterm.AreaPrinter
	lastUpdate  time.Time
	minInterval time.Duration
	mu          sync.Mutex
	started     bool
	isTerminal  bool
}

// NewProgressDisplay 创建进度展示
func NewProgressDisplay() *ProgressDisplay {
	// 检测是否为交互式终端
	isTerminal := term.IsTerminal(int(os.Stdout.Fd()))
	
	return &ProgressDisplay{
		minInterval: 100 * time.Millisecond, // 最小更新间隔 100ms
		isTerminal:  isTerminal,
	}
}

// Start 开始展示
func (pd *ProgressDisplay) Start() {
	pd.mu.Lock()
	defer pd.mu.Unlock()
	
	if pd.started {
		return
	}
	
	if pd.isTerminal {
		// 交互式终端使用 Area 打印器
		pd.area, _ = pterm.DefaultArea.
			WithRemoveWhenDone(true).
			Start()
	}
	
	pd.started = true
	pd.lastUpdate = time.Now()
}

// Update 更新进度
func (pd *ProgressDisplay) Update(progress types.ScanProgress) {
	pd.mu.Lock()
	defer pd.mu.Unlock()
	
	if !pd.started {
		return
	}
	
	// 频率限制
	now := time.Now()
	if now.Sub(pd.lastUpdate) < pd.minInterval && !progress.IsComplete {
		return
	}
	pd.lastUpdate = now
	
	// 构建显示内容
	content := pd.buildProgressContent(progress)
	
	if pd.isTerminal && pd.area != nil {
		// 交互式终端：原地更新
		pd.area.Update(content)
	}
	// 非交互式终端：不输出中间进度，只在完成时输出
}

// Stop 停止展示
func (pd *ProgressDisplay) Stop() {
	pd.mu.Lock()
	defer pd.mu.Unlock()
	
	if pd.area != nil && pd.started {
		pd.area.Stop()
	}
	pd.started = false
}

// buildProgressContent 构建进度显示内容
func (pd *ProgressDisplay) buildProgressContent(progress types.ScanProgress) string {
	var sb strings.Builder
	
	// 标题
	title := pterm.NewStyle(pterm.FgCyan, pterm.Bold).Sprint("Scanning Kiro storage...")
	sb.WriteString(title + "\n\n")
	
	// 当前路径
	path := truncatePath(progress.CurrentPath, 50)
	pathLine := fmt.Sprintf("  📁 %s\n", pterm.NewStyle(pterm.FgGray).Sprint(path))
	sb.WriteString(pathLine)
	sb.WriteString("\n")
	
	// 统计信息
	filesStr := pterm.NewStyle(pterm.FgWhite, pterm.Bold).Sprintf("%d", progress.ScannedFiles)
	sizeStr := pterm.NewStyle(pterm.FgGreen, pterm.Bold).Sprint(storage.FormatSize(progress.TotalSize))
	statsLine := fmt.Sprintf("  Files: %s    Size: %s\n", filesStr, sizeStr)
	sb.WriteString(statsLine)
	sb.WriteString("\n")
	
	// 类型分类
	typeOrder := []struct {
		key   string
		name  string
		color pterm.Color
	}{
		{"log", "Logs", pterm.FgYellow},
		{"cache", "Cache", pterm.FgBlue},
		{"temp", "Temp", pterm.FgRed},
		{"index", "Index", pterm.FgGreen},
		{"chat", "Chats", pterm.FgCyan},
		{"history", "History", pterm.FgMagenta},
	}
	
	for _, t := range typeOrder {
		count := progress.TypeCounts[t.key]
		size := progress.TypeSizes[t.key]
		
		if count > 0 {
			bullet := pterm.NewStyle(t.color).Sprint("●")
			name := pterm.NewStyle(pterm.FgWhite).Sprintf("%-8s", t.name)
			countStr := pterm.NewStyle(pterm.FgGray).Sprintf("%4d files", count)
			sizeStr := pterm.NewStyle(t.color).Sprintf("%10s", storage.FormatSize(size))
			
			line := fmt.Sprintf("  %s %s %s  %s\n", bullet, name, countStr, sizeStr)
			sb.WriteString(line)
		}
	}
	
	return sb.String()
}

// truncatePath 截断路径显示
func truncatePath(path string, maxLen int) string {
	if len(path) <= maxLen {
		return path
	}
	
	// 保留路径末尾部分
	return "..." + path[len(path)-maxLen+3:]
}

// GetCallback 获取进度回调函数
func (pd *ProgressDisplay) GetCallback() types.ProgressCallback {
	return func(progress types.ScanProgress) {
		pd.Update(progress)
	}
}

// CleanupPreview 清理预览信息
type CleanupPreview struct {
	Actions         []types.CleanupAction
	TotalSize       int64
	SafeToDelete    bool
	Warnings        []string
	Recommendations []string
}

// ShowCleanupPreview 显示清理预览
func (pd *ProgressDisplay) ShowCleanupPreview(preview *CleanupPreview) {
	fmt.Println("\n📋 清理预览")
	fmt.Println(strings.Repeat("-", 50))
	
	if len(preview.Actions) == 0 {
		fmt.Println("没有需要清理的文件")
		return
	}
	
	fmt.Printf("待清理文件: %d 个\n", len(preview.Actions))
	fmt.Printf("预计释放空间: %s\n", storage.FormatSize(preview.TotalSize))
	
	if !preview.SafeToDelete {
		fmt.Println("\n⚠️  警告:")
		for _, w := range preview.Warnings {
			fmt.Printf("  - %s\n", w)
		}
	}
	
	if len(preview.Recommendations) > 0 {
		fmt.Println("\n💡 建议:")
		for _, r := range preview.Recommendations {
			fmt.Printf("  - %s\n", r)
		}
	}
	fmt.Println()
}

// SetTotal 设置总数
func (pd *ProgressDisplay) SetTotal(total int64) {
	// 用于清理进度显示
}

// SetPrefix 设置前缀
func (pd *ProgressDisplay) SetPrefix(prefix string) {
	// 用于清理进度显示
}

// SetCurrent 设置当前进度
func (pd *ProgressDisplay) SetCurrent(current int64) {
	// 用于清理进度显示
}

// Finish 完成进度
func (pd *ProgressDisplay) Finish() {
	pd.Stop()
}
