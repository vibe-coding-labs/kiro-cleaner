package ui

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/storage"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// Renderer 渲染器
type Renderer struct {
	width int
}

// NewRenderer 创建新的渲染器
func NewRenderer() *Renderer {
	return &Renderer{
		width: 60,
	}
}

// SetWidth 设置宽度
func (r *Renderer) SetWidth(width int) {
	r.width = width
}

// RenderHeader 渲染头部
func (r *Renderer) RenderHeader(title string) string {
	// 顶部装饰线
	topBorder := lipgloss.NewStyle().
		Foreground(PrimaryColor).
		Render("╭" + strings.Repeat("─", r.width-2) + "╮")
	
	// 标题
	headerStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(PrimaryColor).
		Padding(0, 2).
		Width(r.width - 2).
		Align(lipgloss.Center)
	
	titleLine := lipgloss.NewStyle().
		Foreground(PrimaryColor).
		Render("│") + headerStyle.Render(title) + lipgloss.NewStyle().
		Foreground(PrimaryColor).
		Render("│")
	
	// 底部装饰线
	bottomBorder := lipgloss.NewStyle().
		Foreground(PrimaryColor).
		Render("╰" + strings.Repeat("─", r.width-2) + "╯")
	
	return topBorder + "\n" + titleLine + "\n" + bottomBorder
}

// RenderSection 渲染章节
func (r *Renderer) RenderSection(icon, title string) string {
	return SubtitleStyle.Render(fmt.Sprintf("\n%s %s", icon, title))
}

// RenderDivider 渲染分隔线
func (r *Renderer) RenderDivider() string {
	return MutedStyle.Render(strings.Repeat("─", r.width))
}

// RenderKeyValue 渲染键值对
func (r *Renderer) RenderKeyValue(key, value string) string {
	keyStyle := LabelStyle.Copy().Width(20)
	return fmt.Sprintf("%s %s", keyStyle.Render(key+":"), ValueStyle.Render(value))
}

// RenderKeyValueHighlight 渲染高亮键值对
func (r *Renderer) RenderKeyValueHighlight(key, value string) string {
	keyStyle := LabelStyle.Copy().Width(20)
	return fmt.Sprintf("%s %s", keyStyle.Render(key+":"), NumberStyle.Render(value))
}

// RenderProgressBar 渲染进度条
func (r *Renderer) RenderProgressBar(current, total int64, width int) string {
	if total == 0 {
		return ""
	}
	
	percent := float64(current) / float64(total)
	filled := int(percent * float64(width))
	empty := width - filled
	
	bar := SuccessStyle.Render(strings.Repeat("█", filled)) +
		MutedStyle.Render(strings.Repeat("░", empty))
	
	return fmt.Sprintf("[%s] %.1f%%", bar, percent*100)
}

// RenderTable 渲染表格
func (r *Renderer) RenderTable(headers []string, rows [][]string) string {
	var sb strings.Builder
	
	// 计算列宽
	colWidths := make([]int, len(headers))
	for i, h := range headers {
		colWidths[i] = len(h) + 2
	}
	for _, row := range rows {
		for i, cell := range row {
			if i < len(colWidths) {
				cellLen := len(cell) + 2
				if cellLen > colWidths[i] {
					colWidths[i] = cellLen
				}
			}
		}
	}
	
	// 计算总宽度
	totalWidth := 1
	for _, w := range colWidths {
		totalWidth += w + 1
	}
	
	// 顶部边框
	sb.WriteString(MutedStyle.Render("┌"))
	for i, w := range colWidths {
		sb.WriteString(MutedStyle.Render(strings.Repeat("─", w)))
		if i < len(colWidths)-1 {
			sb.WriteString(MutedStyle.Render("┬"))
		}
	}
	sb.WriteString(MutedStyle.Render("┐"))
	sb.WriteString("\n")
	
	// 表头
	sb.WriteString(MutedStyle.Render("│"))
	for i, h := range headers {
		cell := TableHeaderStyle.Copy().Width(colWidths[i]).Align(lipgloss.Center).Render(h)
		sb.WriteString(cell)
		sb.WriteString(MutedStyle.Render("│"))
	}
	sb.WriteString("\n")
	
	// 表头分隔线
	sb.WriteString(MutedStyle.Render("├"))
	for i, w := range colWidths {
		sb.WriteString(MutedStyle.Render(strings.Repeat("─", w)))
		if i < len(colWidths)-1 {
			sb.WriteString(MutedStyle.Render("┼"))
		}
	}
	sb.WriteString(MutedStyle.Render("┤"))
	sb.WriteString("\n")
	
	// 数据行
	for _, row := range rows {
		sb.WriteString(MutedStyle.Render("│"))
		for i, cell := range row {
			width := colWidths[0]
			if i < len(colWidths) {
				width = colWidths[i]
			}
			cellStyle := TableRowStyle.Copy().Width(width).Align(lipgloss.Left)
			if i > 0 {
				cellStyle = cellStyle.Align(lipgloss.Right)
			}
			sb.WriteString(cellStyle.Render(cell))
			sb.WriteString(MutedStyle.Render("│"))
		}
		sb.WriteString("\n")
	}
	
	// 底部边框
	sb.WriteString(MutedStyle.Render("└"))
	for i, w := range colWidths {
		sb.WriteString(MutedStyle.Render(strings.Repeat("─", w)))
		if i < len(colWidths)-1 {
			sb.WriteString(MutedStyle.Render("┴"))
		}
	}
	sb.WriteString(MutedStyle.Render("┘"))
	sb.WriteString("\n")
	
	return sb.String()
}

// RenderStorageStats 渲染存储统计
func (r *Renderer) RenderStorageStats(stats *types.StorageStats) string {
	var sb strings.Builder
	
	sb.WriteString(r.RenderSection(IconSize, "存储使用情况"))
	sb.WriteString("\n")
	sb.WriteString(MutedStyle.Render(strings.Repeat("─", 40)))
	sb.WriteString("\n")
	
	// 存储条目
	items := []struct {
		icon  string
		label string
		size  int64
		color lipgloss.Color
	}{
		{IconDatabase, "总存储", stats.TotalSize, SecondaryColor},
		{IconCache, "缓存", stats.CacheSize, WarningColor},
		{IconLog, "日志", stats.LogSize, MutedColor},
		{IconTemp, "临时文件", stats.TempSize, DangerColor},
	}
	
	maxSize := stats.TotalSize
	if maxSize == 0 {
		maxSize = 1
	}
	
	for _, item := range items {
		sizeStr := storage.FormatSize(item.size)
		// 计算进度条
		barWidth := 20
		filled := int(float64(item.size) / float64(maxSize) * float64(barWidth))
		if filled > barWidth {
			filled = barWidth
		}
		bar := lipgloss.NewStyle().Foreground(item.color).Render(strings.Repeat("█", filled)) +
			MutedStyle.Render(strings.Repeat("░", barWidth-filled))
		
		line := fmt.Sprintf("  %s %-10s %s %s\n", 
			item.icon, 
			item.label, 
			bar,
			lipgloss.NewStyle().Foreground(item.color).Bold(true).Render(fmt.Sprintf("%10s", sizeStr)))
		sb.WriteString(line)
	}
	
	return sb.String()
}

// RenderConversationStats 渲染对话统计
func (r *Renderer) RenderConversationStats(stats *types.ConversationStats) string {
	var sb strings.Builder
	
	sb.WriteString(r.RenderSection(IconChat, "对话数据统计"))
	sb.WriteString("\n")
	sb.WriteString(MutedStyle.Render(strings.Repeat("─", 40)))
	sb.WriteString("\n")
	
	// 主要统计 - 两列布局
	col1 := fmt.Sprintf("  %-14s %s", "总对话数", NumberStyle.Render(fmt.Sprintf("%d", stats.TotalConversations)))
	col2 := fmt.Sprintf("%-14s %s", "总消息数", NumberStyle.Render(fmt.Sprintf("%d", stats.TotalMessages)))
	sb.WriteString(col1 + "    " + col2 + "\n")
	
	// 消息类型分布
	total := stats.HumanMessages + stats.BotMessages + stats.ToolMessages
	if total == 0 {
		total = 1
	}
	
	sb.WriteString("\n  消息类型分布:\n")
	
	// 用户消息
	humanPct := float64(stats.HumanMessages) / float64(total) * 100
	sb.WriteString(fmt.Sprintf("    👤 用户    %s %s\n", 
		r.renderMiniBar(stats.HumanMessages, total, 15, SuccessColor),
		MutedStyle.Render(fmt.Sprintf("%5d (%.0f%%)", stats.HumanMessages, humanPct))))
	
	// 助手消息
	botPct := float64(stats.BotMessages) / float64(total) * 100
	sb.WriteString(fmt.Sprintf("    🤖 助手    %s %s\n", 
		r.renderMiniBar(stats.BotMessages, total, 15, SecondaryColor),
		MutedStyle.Render(fmt.Sprintf("%5d (%.0f%%)", stats.BotMessages, botPct))))
	
	// 工具消息
	toolPct := float64(stats.ToolMessages) / float64(total) * 100
	sb.WriteString(fmt.Sprintf("    🔧 工具    %s %s\n", 
		r.renderMiniBar(stats.ToolMessages, total, 15, WarningColor),
		MutedStyle.Render(fmt.Sprintf("%5d (%.0f%%)", stats.ToolMessages, toolPct))))
	
	sb.WriteString("\n")
	sb.WriteString(fmt.Sprintf("  %-14s %s\n", "平均消息/对话", NumberStyle.Render(fmt.Sprintf("%.1f", stats.AvgMessagesPerConv))))
	sb.WriteString(fmt.Sprintf("  %-14s %s\n", "数据大小", NumberStyle.Render(storage.FormatSize(stats.TotalSize))))
	
	if !stats.LastActivity.IsZero() {
		sb.WriteString(fmt.Sprintf("  %-14s %s\n", "最后活动", MutedStyle.Render(stats.LastActivity.Format("2006-01-02 15:04:05"))))
	}
	
	return sb.String()
}

// renderMiniBar 渲染迷你进度条
func (r *Renderer) renderMiniBar(value, total, width int, color lipgloss.Color) string {
	if total == 0 {
		total = 1
	}
	filled := int(float64(value) / float64(total) * float64(width))
	if filled > width {
		filled = width
	}
	return lipgloss.NewStyle().Foreground(color).Render(strings.Repeat("▓", filled)) +
		MutedStyle.Render(strings.Repeat("░", width-filled))
}

// RenderWorkspaceBreakdown 渲染工作区分解
func (r *Renderer) RenderWorkspaceBreakdown(workspaces []types.WorkspaceStats) string {
	var sb strings.Builder
	
	sb.WriteString(r.RenderSection(IconFolder, "工作区分解"))
	sb.WriteString("\n")
	sb.WriteString(MutedStyle.Render(strings.Repeat("─", 40)))
	sb.WriteString("\n")
	
	// 找出最大值用于进度条
	var maxSize int64
	for _, ws := range workspaces {
		if ws.TotalSize > maxSize {
			maxSize = ws.TotalSize
		}
	}
	if maxSize == 0 {
		maxSize = 1
	}
	
	colors := []lipgloss.Color{SecondaryColor, SuccessColor, WarningColor, PrimaryColor}
	
	for i, ws := range workspaces {
		// 截断工作区ID
		wsID := ws.WorkspaceID
		if len(wsID) > 8 {
			wsID = wsID[:8]
		}
		
		color := colors[i%len(colors)]
		bar := r.renderMiniBar(int(ws.TotalSize), int(maxSize), 10, color)
		
		line := fmt.Sprintf("  %s %s %s %s对话 %s消息 %s\n",
			lipgloss.NewStyle().Foreground(color).Render("●"),
			MutedStyle.Render(wsID),
			bar,
			NumberStyle.Render(fmt.Sprintf("%3d", ws.ConversationCount)),
			MutedStyle.Render(fmt.Sprintf("%5d", ws.TotalMessages)),
			lipgloss.NewStyle().Foreground(color).Render(storage.FormatSize(ws.TotalSize)))
		sb.WriteString(line)
	}
	
	return sb.String()
}

// RenderCleanableItems 渲染可清理项目
func (r *Renderer) RenderCleanableItems(oldCount, largeCount, tempCount int, oldSize, largeSize, tempSize int64) string {
	var sb strings.Builder
	
	sb.WriteString(r.RenderSection(IconClean, "可清理项目"))
	sb.WriteString("\n")
	sb.WriteString(MutedStyle.Render(strings.Repeat("─", 40)))
	sb.WriteString("\n")
	
	items := []struct {
		icon  string
		label string
		count int
		size  int64
	}{
		{IconClock, "旧对话(>30天)", oldCount, oldSize},
		{IconSize, "大对话(>1MB)", largeCount, largeSize},
		{IconTemp, "临时/日志文件", tempCount, tempSize},
	}
	
	hasCleanable := false
	for _, item := range items {
		if item.count > 0 {
			hasCleanable = true
		}
		
		countStyle := MutedStyle
		sizeStyle := MutedStyle
		if item.count > 0 {
			countStyle = WarningStyle
			sizeStyle = NumberStyle
		}
		
		status := MutedStyle.Render("✓ 无需清理")
		if item.count > 0 {
			status = fmt.Sprintf("%s %s",
				countStyle.Render(fmt.Sprintf("%d个", item.count)),
				sizeStyle.Render(storage.FormatSize(item.size)))
		}
		
		line := fmt.Sprintf("  %s %-16s %s\n", item.icon, item.label, status)
		sb.WriteString(line)
	}
	
	if !hasCleanable {
		sb.WriteString("\n")
		sb.WriteString(SuccessStyle.Render("  ✨ 太棒了！没有需要清理的数据"))
		sb.WriteString("\n")
	}
	
	return sb.String()
}

// RenderTotalSavings 渲染总节省空间
func (r *Renderer) RenderTotalSavings(size int64) string {
	if size == 0 {
		return ""
	}
	
	savingsStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(SuccessColor).
		Padding(0, 2)
	
	return "\n" + savingsStyle.Render(fmt.Sprintf("💾 可释放空间: %s", storage.FormatSize(size)))
}

// RenderRecommendations 渲染建议
func (r *Renderer) RenderRecommendations(recommendations []string) string {
	if len(recommendations) == 0 {
		return ""
	}
	
	var sb strings.Builder
	
	sb.WriteString("\n")
	sb.WriteString(r.RenderSection("💡", "建议"))
	sb.WriteString("\n")
	sb.WriteString(MutedStyle.Render(strings.Repeat("─", 40)))
	sb.WriteString("\n")
	
	for _, rec := range recommendations {
		sb.WriteString(fmt.Sprintf("  %s %s\n", MutedStyle.Render("→"), rec))
	}
	
	return sb.String()
}

// RenderCard 渲染卡片
func (r *Renderer) RenderCard(title, content string) string {
	titleStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(PrimaryColor).
		MarginBottom(1)
	
	cardStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(MutedColor).
		Padding(1, 2)
	
	return cardStyle.Render(titleStyle.Render(title) + "\n" + content)
}

// RenderSuccess 渲染成功消息
func (r *Renderer) RenderSuccess(message string) string {
	return SuccessStyle.Render(fmt.Sprintf("%s %s", IconSuccess, message))
}

// RenderError 渲染错误消息
func (r *Renderer) RenderError(message string) string {
	return ErrorStyle.Render(fmt.Sprintf("%s %s", IconError, message))
}

// RenderWarning 渲染警告消息
func (r *Renderer) RenderWarning(message string) string {
	return WarningStyle.Render(fmt.Sprintf("%s %s", IconWarning, message))
}

// RenderInfo 渲染信息消息
func (r *Renderer) RenderInfo(message string) string {
	return MutedStyle.Render(fmt.Sprintf("%s %s", IconInfo, message))
}
