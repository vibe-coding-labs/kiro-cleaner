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

	// 扩展颜色 - 彩虹色系
	RedColor    = lipgloss.Color("#EF4444") // 红色
	OrangeColor = lipgloss.Color("#F97316") // 橙色
	YellowColor = lipgloss.Color("#EAB308") // 黄色
	GreenColor  = lipgloss.Color("#22C55E") // 绿色
	BlueColor   = lipgloss.Color("#3B82F6") // 蓝色
	IndigoColor = lipgloss.Color("#6366F1") // 靛蓝
	PurpleColor = lipgloss.Color("#A855F7") // 紫色
	PinkColor   = lipgloss.Color("#EC4899") // 粉色
	CyanColor   = lipgloss.Color("#06B6D4") // 青色
	TealColor   = lipgloss.Color("#14B8A6") // 蓝绿色

	// 中性色
	WhiteColor     = lipgloss.Color("#FFFFFF")
	LightGrayColor = lipgloss.Color("#E5E7EB")
	GrayColor      = lipgloss.Color("#9CA3AF")
	DarkGrayColor  = lipgloss.Color("#4B5563")
	BlackColor     = lipgloss.Color("#111827")

	// 语义色 - 亮色变体
	SuccessLightColor = lipgloss.Color("#86EFAC")
	WarningLightColor = lipgloss.Color("#FDE047")
	DangerLightColor  = lipgloss.Color("#FCA5A5")
	InfoLightColor    = lipgloss.Color("#93C5FD")

	// 背景色
	BgDark      = lipgloss.Color("#1F2937")
	BgLight     = lipgloss.Color("#374151")
	BgPrimary   = lipgloss.Color("#4C1D95")
	BgSecondary = lipgloss.Color("#164E63")
	BgSuccess   = lipgloss.Color("#064E3B")
	BgWarning   = lipgloss.Color("#78350F")
	BgDanger    = lipgloss.Color("#7F1D1D")
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

	// === 扩展样式 ===

	// 信息样式
	InfoStyle = lipgloss.NewStyle().
		Foreground(BlueColor)

	// 彩虹色样式
	RedStyle = lipgloss.NewStyle().
		Foreground(RedColor)

	OrangeStyle = lipgloss.NewStyle().
		Foreground(OrangeColor)

	YellowStyle = lipgloss.NewStyle().
		Foreground(YellowColor)

	GreenStyle = lipgloss.NewStyle().
		Foreground(GreenColor)

	BlueStyle = lipgloss.NewStyle().
		Foreground(BlueColor)

	IndigoStyle = lipgloss.NewStyle().
		Foreground(IndigoColor)

	PurpleStyle = lipgloss.NewStyle().
		Foreground(PurpleColor)

	PinkStyle = lipgloss.NewStyle().
		Foreground(PinkColor)

	CyanStyle = lipgloss.NewStyle().
		Foreground(CyanColor)

	TealStyle = lipgloss.NewStyle().
		Foreground(TealColor)

	// 粗体彩色样式
	BoldRedStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(RedColor)

	BoldOrangeStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(OrangeColor)

	BoldYellowStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(YellowColor)

	BoldGreenStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(GreenColor)

	BoldBlueStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(BlueColor)

	BoldPurpleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(PurpleColor)

	BoldCyanStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(CyanColor)

	// 带背景的样式
	SuccessBadgeStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(WhiteColor).
				Background(SuccessColor).
				Padding(0, 1)

	WarningBadgeStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(BlackColor).
				Background(WarningColor).
				Padding(0, 1)

	DangerBadgeStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(WhiteColor).
				Background(DangerColor).
				Padding(0, 1)

	InfoBadgeStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(WhiteColor).
			Background(BlueColor).
			Padding(0, 1)

	PrimaryBadgeStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(WhiteColor).
				Background(PrimaryColor).
				Padding(0, 1)

	// 斜体样式
	ItalicStyle = lipgloss.NewStyle().
			Italic(true).
			Foreground(GrayColor)

	// 下划线样式
	UnderlineStyle = lipgloss.NewStyle().
			Underline(true).
			Foreground(CyanColor)

	// 链接样式
	LinkStyle = lipgloss.NewStyle().
			Underline(true).
			Foreground(BlueColor)

	// 代码样式
	CodeStyle = lipgloss.NewStyle().
			Foreground(PinkColor).
			Background(DarkGrayColor).
			Padding(0, 1)

	// 命令样式
	CommandStyle = lipgloss.NewStyle().
			Foreground(YellowColor).
			Bold(true)

	// 路径样式
	PathStyle = lipgloss.NewStyle().
			Foreground(CyanColor).
			Italic(true)

	// 文件大小样式
	FileSizeStyle = lipgloss.NewStyle().
			Foreground(GreenColor).
			Bold(true)

	// 时间戳样式
	TimestampStyle = lipgloss.NewStyle().
			Foreground(GrayColor)

	// 百分比样式
	PercentStyle = lipgloss.NewStyle().
			Foreground(OrangeColor).
			Bold(true)

	// 计数样式
	CountStyle = lipgloss.NewStyle().
			Foreground(CyanColor).
			Bold(true)

	// 分隔线样式
	DividerStyle = lipgloss.NewStyle().
			Foreground(DarkGrayColor)

	// 章节标题样式
	SectionTitleStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(PurpleColor).
				MarginTop(1).
				MarginBottom(1)

	// 列表项样式
	ListItemStyle = lipgloss.NewStyle().
			Foreground(LightGrayColor).
			PaddingLeft(2)

	// 选中项样式
	SelectedStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(WhiteColor).
			Background(PrimaryColor).
			Padding(0, 1)

	// 禁用样式
	DisabledStyle = lipgloss.NewStyle().
			Foreground(DarkGrayColor).
			Strikethrough(true)

	// 渐变进度条颜色
	ProgressLowStyle = lipgloss.NewStyle().
				Foreground(GreenColor)

	ProgressMediumStyle = lipgloss.NewStyle().
				Foreground(YellowColor)

	ProgressHighStyle = lipgloss.NewStyle().
				Foreground(OrangeColor)

	ProgressCriticalStyle = lipgloss.NewStyle().
				Foreground(RedColor)

	// 表格交替行样式
	TableRowAltStyle = lipgloss.NewStyle().
				Foreground(LightGrayColor).
				Background(BgLight)

	// 边框卡片变体
	SuccessCardStyle = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(SuccessColor).
				Padding(1, 2)

	WarningCardStyle = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(WarningColor).
				Padding(1, 2)

	DangerCardStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(DangerColor).
			Padding(1, 2)

	InfoCardStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(BlueColor).
			Padding(1, 2)
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

	// 扩展图标
	IconRocket     = "🚀"
	IconFire       = "🔥"
	IconLightning  = "⚡"
	IconGear       = "⚙️"
	IconLock       = "🔒"
	IconUnlock     = "🔓"
	IconKey        = "🔑"
	IconLink       = "🔗"
	IconPin        = "📌"
	IconTag        = "🏷️"
	IconPackage    = "📦"
	IconTrash      = "🗑️"
	IconRefresh    = "🔄"
	IconDownload   = "⬇️"
	IconUpload     = "⬆️"
	IconPlay       = "▶️"
	IconPause      = "⏸️"
	IconStop       = "⏹️"
	IconSkip       = "⏭️"
	IconRewind     = "⏪"
	IconHeart      = "❤️"
	IconThumbsUp   = "👍"
	IconThumbsDown = "👎"
	IconEye        = "👁️"
	IconEdit       = "✏️"
	IconCopy       = "📋"
	IconPaste      = "📥"
	IconCut        = "✂️"
	IconSave       = "💾"
	IconUndo       = "↩️"
	IconRedo       = "↪️"
	IconExpand     = "➕"
	IconCollapse   = "➖"
	IconUp         = "⬆"
	IconDown       = "⬇"
	IconLeft       = "⬅"
	IconRight      = "➡"
	IconDot        = "●"
	IconCircle     = "○"
	IconSquare     = "■"
	IconDiamond    = "◆"
	IconTriangle   = "▲"
)

// 彩虹色数组，用于渐变效果
var RainbowColors = []lipgloss.Color{
	RedColor,
	OrangeColor,
	YellowColor,
	GreenColor,
	CyanColor,
	BlueColor,
	PurpleColor,
	PinkColor,
}

// 进度条颜色阈值
var ProgressColors = []struct {
	Threshold float64
	Color     lipgloss.Color
}{
	{0.25, GreenColor},
	{0.50, YellowColor},
	{0.75, OrangeColor},
	{1.00, RedColor},
}

// GetProgressColor 根据百分比获取进度条颜色
func GetProgressColor(percent float64) lipgloss.Color {
	for _, pc := range ProgressColors {
		if percent <= pc.Threshold {
			return pc.Color
		}
	}
	return RedColor
}

// GetProgressStyle 根据百分比获取进度条样式
func GetProgressStyle(percent float64) lipgloss.Style {
	color := GetProgressColor(percent)
	return lipgloss.NewStyle().Foreground(color)
}

// Colorize 使用指定颜色渲染文本
func Colorize(text string, color lipgloss.Color) string {
	return lipgloss.NewStyle().Foreground(color).Render(text)
}

// Bold 渲染粗体文本
func Bold(text string) string {
	return lipgloss.NewStyle().Bold(true).Render(text)
}

// BoldColor 渲染粗体彩色文本
func BoldColor(text string, color lipgloss.Color) string {
	return lipgloss.NewStyle().Bold(true).Foreground(color).Render(text)
}

// Italic 渲染斜体文本
func Italic(text string) string {
	return lipgloss.NewStyle().Italic(true).Render(text)
}

// Underline 渲染下划线文本
func Underline(text string) string {
	return lipgloss.NewStyle().Underline(true).Render(text)
}

// Strikethrough 渲染删除线文本
func Strikethrough(text string) string {
	return lipgloss.NewStyle().Strikethrough(true).Render(text)
}

// Badge 渲染徽章样式文本
func Badge(text string, fg, bg lipgloss.Color) string {
	return lipgloss.NewStyle().
		Bold(true).
		Foreground(fg).
		Background(bg).
		Padding(0, 1).
		Render(text)
}

// RainbowText 渲染彩虹色文本
func RainbowText(text string) string {
	result := ""
	colors := RainbowColors
	for i, char := range text {
		color := colors[i%len(colors)]
		result += lipgloss.NewStyle().Foreground(color).Render(string(char))
	}
	return result
}

// GradientText 渲染渐变色文本（从 startColor 到 endColor）
func GradientText(text string, startColor, endColor lipgloss.Color) string {
	// 简化实现：交替使用两种颜色
	result := ""
	for i, char := range text {
		var color lipgloss.Color
		if i%2 == 0 {
			color = startColor
		} else {
			color = endColor
		}
		result += lipgloss.NewStyle().Foreground(color).Render(string(char))
	}
	return result
}

// StatusIcon 根据状态返回对应图标
func StatusIcon(status string) string {
	switch status {
	case "success", "ok", "done", "complete":
		return IconSuccess
	case "error", "fail", "failed":
		return IconError
	case "warning", "warn":
		return IconWarning
	case "info":
		return IconInfo
	case "loading", "pending":
		return IconSpinner
	default:
		return IconBullet
	}
}

// StatusStyle 根据状态返回对应样式
func StatusStyle(status string) lipgloss.Style {
	switch status {
	case "success", "ok", "done", "complete":
		return SuccessStyle
	case "error", "fail", "failed":
		return ErrorStyle
	case "warning", "warn":
		return WarningStyle
	case "info":
		return InfoStyle
	default:
		return MutedStyle
	}
}

// FormatStatus 格式化状态文本（带图标和颜色）
func FormatStatus(status, message string) string {
	icon := StatusIcon(status)
	style := StatusStyle(status)
	return icon + " " + style.Render(message)
}
