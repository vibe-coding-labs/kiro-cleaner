package ui

import (
	"fmt"
	"strings"

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
	return fmt.Sprintf("\n=== %s ===\n", title)
}

// RenderSection 渲染章节
func (r *Renderer) RenderSection(icon, title string) string {
	if icon != "" {
		return fmt.Sprintf("\n%s %s", icon, title)
	}
	return fmt.Sprintf("\n[%s]", title)
}

// RenderDivider 渲染分隔线
func (r *Renderer) RenderDivider() string {
	return strings.Repeat("-", 40)
}

// RenderKeyValue 渲染键值对
func (r *Renderer) RenderKeyValue(key, value string) string {
	return fmt.Sprintf("  %-16s %s", key+":", value)
}

// RenderKeyValueHighlight 渲染高亮键值对
func (r *Renderer) RenderKeyValueHighlight(key, value string) string {
	return fmt.Sprintf("  %-16s %s", key+":", value)
}

// RenderProgressBar 渲染进度条
func (r *Renderer) RenderProgressBar(current, total int64, width int) string {
	if total == 0 {
		return ""
	}

	percent := float64(current) / float64(total)
	filled := int(percent * float64(width))
	empty := width - filled

	bar := strings.Repeat("#", filled) + strings.Repeat("-", empty)
	return fmt.Sprintf("[%s] %.1f%%", bar, percent*100)
}

// RenderTable 渲染表格（紧凑版）
func (r *Renderer) RenderTable(headers []string, rows [][]string) string {
	var sb strings.Builder

	// 紧凑列宽
	col1Width := 14
	col2Width := 10
	col3Width := 6

	// 分隔线
	divider := "+" + strings.Repeat("-", col1Width) + "+" + strings.Repeat("-", col2Width) + "+" + strings.Repeat("-", col3Width) + "+"

	sb.WriteString(divider + "\n")

	// 表头
	sb.WriteString("|")
	sb.WriteString(padCenter(headers[0], col1Width))
	sb.WriteString("|")
	sb.WriteString(padCenter(headers[1], col2Width))
	sb.WriteString("|")
	sb.WriteString(padCenter(headers[2], col3Width))
	sb.WriteString("|\n")

	sb.WriteString(divider + "\n")

	// 数据行
	for _, row := range rows {
		sb.WriteString("|")
		sb.WriteString(padRight(row[0], col1Width))
		sb.WriteString("|")
		sb.WriteString(padLeft(row[1], col2Width))
		sb.WriteString("|")
		sb.WriteString(padLeft(row[2], col3Width))
		sb.WriteString("|\n")
	}

	sb.WriteString(divider + "\n")

	return sb.String()
}

// padRight 右填充空格
func padRight(s string, width int) string {
	if len(s) >= width {
		return s[:width]
	}
	return s + strings.Repeat(" ", width-len(s))
}

// padLeft 左填充空格
func padLeft(s string, width int) string {
	if len(s) >= width {
		return s[:width]
	}
	return strings.Repeat(" ", width-len(s)) + s
}

// padCenter 居中填充空格
func padCenter(s string, width int) string {
	if len(s) >= width {
		return s[:width]
	}
	left := (width - len(s)) / 2
	right := width - len(s) - left
	return strings.Repeat(" ", left) + s + strings.Repeat(" ", right)
}

// RenderStorageStats 渲染存储统计
func (r *Renderer) RenderStorageStats(stats *types.StorageStats) string {
	var sb strings.Builder

	sb.WriteString("\n[Storage Usage]\n")

	items := []struct {
		label string
		size  int64
	}{
		{"Total", stats.TotalSize},
		{"Cache", stats.CacheSize},
		{"Logs", stats.LogSize},
		{"Temp", stats.TempSize},
	}

	maxSize := stats.TotalSize
	if maxSize == 0 {
		maxSize = 1
	}

	for _, item := range items {
		sizeStr := storage.FormatSize(item.size)
		barWidth := 15
		filled := int(float64(item.size) / float64(maxSize) * float64(barWidth))
		if filled > barWidth {
			filled = barWidth
		}
		bar := strings.Repeat("#", filled) + strings.Repeat("-", barWidth-filled)

		sb.WriteString(fmt.Sprintf("%-8s [%s] %s\n", item.label, bar, sizeStr))
	}

	return sb.String()
}

// RenderConversationStats 渲染对话统计
func (r *Renderer) RenderConversationStats(stats *types.ConversationStats) string {
	var sb strings.Builder

	sb.WriteString("\n[Conversations]\n")
	sb.WriteString(fmt.Sprintf("Total: %d convs, %d msgs\n", stats.TotalConversations, stats.TotalMessages))

	// 消息类型分布
	total := stats.HumanMessages + stats.BotMessages + stats.ToolMessages
	if total == 0 {
		total = 1
	}

	humanPct := float64(stats.HumanMessages) / float64(total) * 100
	botPct := float64(stats.BotMessages) / float64(total) * 100
	toolPct := float64(stats.ToolMessages) / float64(total) * 100

	sb.WriteString(fmt.Sprintf("User: %d (%.0f%%) | Bot: %d (%.0f%%) | Tool: %d (%.0f%%)\n",
		stats.HumanMessages, humanPct,
		stats.BotMessages, botPct,
		stats.ToolMessages, toolPct))

	sb.WriteString(fmt.Sprintf("Avg msgs/conv: %.1f | Size: %s\n",
		stats.AvgMessagesPerConv, storage.FormatSize(stats.TotalSize)))

	if !stats.LastActivity.IsZero() {
		sb.WriteString(fmt.Sprintf("Last activity: %s\n", stats.LastActivity.Format("2006-01-02 15:04")))
	}

	return sb.String()
}

// miniBar 渲染迷你进度条
func (r *Renderer) miniBar(value, total, width int) string {
	if total == 0 {
		total = 1
	}
	filled := int(float64(value) / float64(total) * float64(width))
	if filled > width {
		filled = width
	}
	return "[" + strings.Repeat("#", filled) + strings.Repeat("-", width-filled) + "]"
}

// RenderWorkspaceBreakdown 渲染工作区分解
func (r *Renderer) RenderWorkspaceBreakdown(workspaces []types.WorkspaceStats) string {
	var sb strings.Builder

	sb.WriteString("\n[Workspaces]\n")

	for _, ws := range workspaces {
		wsID := ws.WorkspaceID
		if len(wsID) > 8 {
			wsID = wsID[:8]
		}

		sb.WriteString(fmt.Sprintf("%-8s: %d convs, %d msgs, %s\n",
			wsID,
			ws.ConversationCount,
			ws.TotalMessages,
			storage.FormatSize(ws.TotalSize)))
	}

	return sb.String()
}

// RenderCleanableItems 渲染可清理项目
func (r *Renderer) RenderCleanableItems(oldCount, largeCount, tempCount int, oldSize, largeSize, tempSize int64) string {
	var sb strings.Builder

	sb.WriteString("\n[Cleanable]\n")

	items := []struct {
		label string
		count int
		size  int64
	}{
		{"Old (>30d)", oldCount, oldSize},
		{"Large (>1MB)", largeCount, largeSize},
		{"Temp/Logs", tempCount, tempSize},
	}

	hasCleanable := false
	for _, item := range items {
		if item.count > 0 {
			hasCleanable = true
			sb.WriteString(fmt.Sprintf("%-12s: %d items, %s\n", item.label, item.count, storage.FormatSize(item.size)))
		} else {
			sb.WriteString(fmt.Sprintf("%-12s: OK\n", item.label))
		}
	}

	if !hasCleanable {
		sb.WriteString("All clean!\n")
	}

	return sb.String()
}

// RenderTotalSavings 渲染总节省空间
func (r *Renderer) RenderTotalSavings(size int64) string {
	if size == 0 {
		return ""
	}
	return fmt.Sprintf("\n>>> Potential savings: %s\n", storage.FormatSize(size))
}

// RenderRecommendations 渲染建议
func (r *Renderer) RenderRecommendations(recommendations []string) string {
	if len(recommendations) == 0 {
		return ""
	}

	var sb strings.Builder

	sb.WriteString("\n[Recommendations]\n")

	for _, rec := range recommendations {
		sb.WriteString(fmt.Sprintf("-> %s\n", rec))
	}

	return sb.String()
}

// RenderCard 渲染卡片（简化版）
func (r *Renderer) RenderCard(title, content string) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("\n[%s]\n", title))

	lines := strings.Split(content, "\n")
	for _, line := range lines {
		if line == "" {
			continue
		}
		sb.WriteString(line + "\n")
	}

	return sb.String()
}

// RenderSuccess 渲染成功消息
func (r *Renderer) RenderSuccess(message string) string {
	return fmt.Sprintf("[OK] %s", message)
}

// RenderError 渲染错误消息
func (r *Renderer) RenderError(message string) string {
	return fmt.Sprintf("[ERROR] %s", message)
}

// RenderWarning 渲染警告消息
func (r *Renderer) RenderWarning(message string) string {
	return fmt.Sprintf("[WARN] %s", message)
}

// RenderInfo 渲染信息消息
func (r *Renderer) RenderInfo(message string) string {
	return fmt.Sprintf("[INFO] %s", message)
}
