package ui

import (
	"github.com/charmbracelet/lipgloss"
)

// 颜色定义
var (
	// 主题色
	PrimaryColor   = lipgloss.Color("#7C3AED") // 紫色
	SecondaryColor = lipgloss.Color("#06B6D4") // 青色
	SuccessColor   = lipgloss.Color("#10B981") // 绿色
	WarningColor   = lipgloss.Color("#F59E0B") // 橙色
	DangerColor    = lipgloss.Color("#EF4444") // 红色
	MutedColor     = lipgloss.Color("#6B7280") // 灰色
	
	// 背景色
	BgDark   = lipgloss.Color("#1F2937")
	BgLight  = lipgloss.Color("#374151")
)

// 样式定义
var (
	// 标题样式
	TitleStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(PrimaryColor).
		MarginBottom(1)
	
	// 副标题样式
	SubtitleStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(SecondaryColor)
	
	// 成功样式
	SuccessStyle = lipgloss.NewStyle().
		Foreground(SuccessColor)
	
	// 警告样式
	WarningStyle = lipgloss.NewStyle().
		Foreground(WarningColor)
	
	// 错误样式
	ErrorStyle = lipgloss.NewStyle().
		Foreground(DangerColor)
	
	// 静音样式
	MutedStyle = lipgloss.NewStyle().
		Foreground(MutedColor)
	
	// 高亮样式
	HighlightStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF"))
	
	// 数值样式
	NumberStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(SecondaryColor)
	
	// 边框样式
	BorderStyle = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(PrimaryColor).
		Padding(1, 2)
	
	// 卡片样式
	CardStyle = lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(MutedColor).
		Padding(1, 2).
		MarginBottom(1)
	
	// 表格头样式
	TableHeaderStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(PrimaryColor).
		BorderBottom(true).
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(MutedColor)
	
	// 表格行样式
	TableRowStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#E5E7EB"))
	
	// 进度条样式
	ProgressBarStyle = lipgloss.NewStyle().
		Foreground(SuccessColor)
	
	// 标签样式
	LabelStyle = lipgloss.NewStyle().
		Foreground(MutedColor)
	
	// 值样式
	ValueStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFFFFF"))
)

// 图标定义
const (
	IconFolder    = "📁"
	IconFile      = "📄"
	IconChat      = "💬"
	IconDatabase  = "🗄️"
	IconCache     = "💾"
	IconLog       = "📝"
	IconTemp      = "🗑️"
	IconCheck     = "✓"
	IconCross     = "✗"
	IconWarning   = "⚠️"
	IconInfo      = "ℹ️"
	IconArrow     = "→"
	IconBullet    = "•"
	IconStar      = "★"
	IconClock     = "🕐"
	IconSize      = "📊"
	IconClean     = "🧹"
	IconBackup    = "💿"
	IconSearch    = "🔍"
	IconSuccess   = "✅"
	IconError     = "❌"
	IconSpinner   = "⏳"
)
