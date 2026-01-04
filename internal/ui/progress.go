package ui

import (
	"fmt"
	"io"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ProgressDisplay 进度显示器
type ProgressDisplay struct {
	output  io.Writer
	total   int64
	current int64
	prefix  string
	enabled bool
}

// NewProgressDisplay 创建新的进度显示器
func NewProgressDisplay(output io.Writer, enabled bool) *ProgressDisplay {
	return &ProgressDisplay{
		output:  output,
		enabled: enabled,
	}
}

// SetTotal 设置总数
func (p *ProgressDisplay) SetTotal(total int64) {
	p.total = total
}

// SetCurrent 设置当前进度
func (p *ProgressDisplay) SetCurrent(current int64) {
	p.current = current
	if p.enabled {
		p.render()
	}
}

// SetPrefix 设置前缀
func (p *ProgressDisplay) SetPrefix(prefix string) {
	p.prefix = prefix
}

// Finish 完成进度
func (p *ProgressDisplay) Finish() {
	if p.enabled {
		fmt.Fprintln(p.output)
	}
}

// render 渲染进度条
func (p *ProgressDisplay) render() {
	if p.total == 0 {
		return
	}
	
	percent := float64(p.current) / float64(p.total)
	barWidth := 30
	filled := int(percent * float64(barWidth))
	
	bar := SuccessStyle.Render(strings.Repeat("█", filled)) +
		MutedStyle.Render(strings.Repeat("░", barWidth-filled))
	
	fmt.Fprintf(p.output, "\r%s [%s] %d/%d (%.0f%%)", 
		p.prefix, bar, p.current, p.total, percent*100)
}

// CleanupPreview 清理预览
type CleanupPreview struct {
	Actions         []types.CleanupAction
	TotalSize       int64
	SafeToDelete    bool
	Warnings        []string
	Recommendations []string
}

// ShowCleanupPreview 显示清理预览
func (p *ProgressDisplay) ShowCleanupPreview(preview *CleanupPreview) {
	if !p.enabled {
		return
	}
	
	renderer := NewRenderer()
	
	// 标题
	titleStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(PrimaryColor)
	
	fmt.Fprintln(p.output, titleStyle.Render("\n📋 清理预览"))
	fmt.Fprintln(p.output, MutedStyle.Render(strings.Repeat("─", 40)))
	
	// 操作数量
	fmt.Fprintf(p.output, "  待执行操作: %s\n", NumberStyle.Render(fmt.Sprintf("%d", len(preview.Actions))))
	fmt.Fprintf(p.output, "  预计释放:   %s\n", NumberStyle.Render(formatSize(preview.TotalSize)))
	
	// 安全状态
	if preview.SafeToDelete {
		fmt.Fprintln(p.output, renderer.RenderSuccess("所有操作安全"))
	} else {
		fmt.Fprintln(p.output, renderer.RenderWarning("部分操作需要确认"))
	}
	
	// 警告
	if len(preview.Warnings) > 0 {
		fmt.Fprintln(p.output, "\n⚠️ 警告:")
		for _, w := range preview.Warnings {
			fmt.Fprintf(p.output, "  • %s\n", WarningStyle.Render(w))
		}
	}
	
	// 建议
	if len(preview.Recommendations) > 0 {
		fmt.Fprintln(p.output, "\n💡 建议:")
		for _, r := range preview.Recommendations {
			fmt.Fprintf(p.output, "  • %s\n", r)
		}
	}
	
	fmt.Fprintln(p.output)
}

// formatSize 格式化大小
func formatSize(bytes int64) string {
	const (
		KB = 1024
		MB = 1024 * KB
		GB = 1024 * MB
	)
	
	switch {
	case bytes >= GB:
		return fmt.Sprintf("%.2f GB", float64(bytes)/GB)
	case bytes >= MB:
		return fmt.Sprintf("%.2f MB", float64(bytes)/MB)
	case bytes >= KB:
		return fmt.Sprintf("%.2f KB", float64(bytes)/KB)
	default:
		return fmt.Sprintf("%d B", bytes)
	}
}

// SimplePrompter 简单的提示器实现
type SimplePrompter struct {
	output io.Writer
}

// NewSimplePrompter 创建简单提示器
func NewSimplePrompter(output io.Writer) *SimplePrompter {
	return &SimplePrompter{output: output}
}

// Info 显示信息
func (s *SimplePrompter) Info(message string) {
	fmt.Fprintln(s.output, MutedStyle.Render("ℹ️ "+message))
}

// Warning 显示警告
func (s *SimplePrompter) Warning(message string) {
	fmt.Fprintln(s.output, WarningStyle.Render("⚠️ "+message))
}

// Success 显示成功
func (s *SimplePrompter) Success(message string) {
	fmt.Fprintln(s.output, SuccessStyle.Render("✅ "+message))
}

// Error 显示错误
func (s *SimplePrompter) Error(message string) {
	fmt.Fprintln(s.output, ErrorStyle.Render("❌ "+message))
}
