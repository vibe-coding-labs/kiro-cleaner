package ui

import (
    "context"
    "fmt"
    "io"
)

type Interface interface {
    DisplayMessage(message string)
    DisplayError(err error)
    DisplayResult(result interface{})
    GetInput(prompt string) string
    ConfirmSimple(message string) bool
    DisplayProgress(message string)
    DisplayTable(headers []string, rows [][]string)
    DisplayJSON(data interface{})
}

type Prompter interface {
    Input(prompt string) (string, error)
    Password(prompt string) (string, error)
    Confirm(prompt string, defaultVal bool) bool
    Select(prompt string, options []string) (int, error)
    MultiSelect(prompt string, options []string) ([]int, error)
}

type CLI struct {
    output io.Writer
}

func NewCLI() *CLI {
    return &CLI{
        output: nil,
    }
}

func (c *CLI) DisplayMessage(message string) {
    fmt.Println(message)
}

func (c *CLI) DisplayError(err error) {
    if err != nil {
        fmt.Printf("错误: %v\n", err)
    }
}

func (c *CLI) DisplayResult(result interface{}) {
    fmt.Printf("结果: %v\n", result)
}

func (c *CLI) GetInput(prompt string) string {
    fmt.Print(prompt)
    var input string
    fmt.Scanln(&input)
    return input
}

func (c *CLI) ConfirmSimple(message string) bool {
    input := c.GetInput(message + " (y/N): ")
    return input == "y" || input == "Y"
}

func (c *CLI) DisplayProgress(message string) {
    fmt.Printf("进度: %s\n", message)
}

func (c *CLI) DisplayTable(headers []string, rows [][]string) {
    fmt.Println("表格显示功能")
}

func (c *CLI) DisplayJSON(data interface{}) {
    fmt.Printf("JSON数据: %v\n", data)
}

func NewPrompter() Prompter {
    return &CLI{}
}

func (c *CLI) Input(prompt string) (string, error) {
    fmt.Print(prompt)
    var input string
    _, err := fmt.Scanln(&input)
    return input, err
}

func (c *CLI) Password(prompt string) (string, error) {
    fmt.Print(prompt)
    var input string
    _, err := fmt.Scanln(&input)
    return input, err
}

func (c *CLI) Confirm(prompt string, defaultVal bool) bool {
    defaultText := "N"
    if defaultVal {
        defaultText = "Y"
    }
    input := c.GetInput(fmt.Sprintf("%s (y/N) [默认: %s]: ", prompt, defaultText))
    if input == "" {
        return defaultVal
    }
    return input == "y" || input == "Y"
}

func (c *CLI) Select(prompt string, options []string) (int, error) {
    fmt.Println(prompt)
    for i, option := range options {
        fmt.Printf("%d. %s\n", i+1, option)
    }
    fmt.Print("请选择 (输入数字): ")
    var selection int
    fmt.Scanln(&selection)
    return selection - 1, nil
}

func (c *CLI) MultiSelect(prompt string, options []string) ([]int, error) {
    fmt.Println(prompt)
    for i, option := range options {
        fmt.Printf("%d. %s\n", i+1, option)
    }
    fmt.Print("请选择多个选项 (用逗号分隔): ")
    var selections []int
    fmt.Printf("多选功能开发中...\n")
    return selections, nil
}

func RunApp(ctx context.Context) {
    cli := NewCLI()
    cli.DisplayMessage("Kiro Cleaner 启动中...")
}

// SimplePrompter 简单提示器
type SimplePrompter struct {
    output io.Writer
}

// NewSimplePrompter 创建简单提示器
func NewSimplePrompter(output io.Writer) *SimplePrompter {
    if output == nil {
        output = io.Discard
    }
    return &SimplePrompter{output: output}
}

// Info 显示信息
func (sp *SimplePrompter) Info(message string) {
    fmt.Fprintf(sp.output, "ℹ️  %s\n", message)
}

// Warning 显示警告
func (sp *SimplePrompter) Warning(message string) {
    fmt.Fprintf(sp.output, "⚠️  %s\n", message)
}

// Success 显示成功
func (sp *SimplePrompter) Success(message string) {
    fmt.Fprintf(sp.output, "✅ %s\n", message)
}

// Error 显示错误
func (sp *SimplePrompter) Error(message string) {
    fmt.Fprintf(sp.output, "❌ %s\n", message)
}
