package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/pterm/pterm"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"github.com/vibe-coding-labs/kiro-cleaner/internal/ui"
)

// Build info (set by goreleaser)
var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

var (
	cfgFile   string
	verbose   bool
	backup    bool
	output    string
	configDir string

	rootCmd = &cobra.Command{
		Use:   "kiro-cleaner",
		Short: "Kiro storage cleaner tool",
		Long:  "Clean Kiro IDE storage: temp files, old logs, cache.",
		Version: version,
	}

	uiPrompter ui.Prompter
)

// 自定义帮助模板
func customHelpFunc(cmd *cobra.Command, args []string) {
	// 标题
	fmt.Println()
	title := pterm.NewStyle(pterm.FgCyan, pterm.Bold).Sprint("🧹 Kiro Cleaner")
	ver := pterm.NewStyle(pterm.FgGray).Sprint("v" + version)
	fmt.Printf("  %s %s\n", title, ver)
	fmt.Println()
	
	// 描述
	desc := pterm.NewStyle(pterm.FgWhite).Sprint("  Clean Kiro IDE storage: temp files, old logs, cache, and conversations.")
	fmt.Println(desc)
	fmt.Println()
	
	// 主要命令
	printSectionHeader("Commands")
	commands := []struct {
		name  string
		desc  string
		color pterm.Color
	}{
		{"scan", "Show storage usage and what can be cleaned", pterm.FgGreen},
		{"clean", "Delete temp files, logs, cache, and conversations", pterm.FgRed},
		{"config", "Show or edit global configuration", pterm.FgYellow},
	}
	for _, c := range commands {
		name := pterm.NewStyle(c.color, pterm.Bold).Sprintf("%-10s", c.name)
		desc := pterm.NewStyle(pterm.FgWhite).Sprint(c.desc)
		fmt.Printf("    %s  %s\n", name, desc)
	}
	fmt.Println()
	
	// 示例
	printSectionHeader("Examples")
	examples := []struct {
		cmd  string
		desc string
	}{
		{"kiro-cleaner scan", "View storage usage"},
		{"kiro-cleaner clean --dry-run", "Preview what will be cleaned"},
		{"kiro-cleaner clean", "Clean all redundant data"},
		{"kiro-cleaner clean --kill-kiro", "Stop Kiro and clean"},
		{"kiro-cleaner clean --keep-chats", "Clean but keep conversations"},
	}
	for _, e := range examples {
		dollar := pterm.NewStyle(pterm.FgGray).Sprint("$")
		cmdText := pterm.NewStyle(pterm.FgCyan).Sprint(e.cmd)
		descText := pterm.NewStyle(pterm.FgGray).Sprint("# " + e.desc)
		fmt.Printf("    %s %s  %s\n", dollar, cmdText, descText)
	}
	fmt.Println()
	
	// 用法
	printSectionHeader("Usage")
	usage := pterm.NewStyle(pterm.FgWhite).Sprint("kiro-cleaner")
	cmdPlaceholder := pterm.NewStyle(pterm.FgCyan).Sprint("[command]")
	flagPlaceholder := pterm.NewStyle(pterm.FgYellow).Sprint("[flags]")
	fmt.Printf("    %s %s %s\n", usage, cmdPlaceholder, flagPlaceholder)
	fmt.Println()
	
	// 所有命令
	printSectionHeader("Available Commands")
	allCommands := []struct {
		name  string
		desc  string
		color pterm.Color
	}{
		{"clean", "Clean up all redundant data", pterm.FgRed},
		{"completion", "Generate shell autocompletion script", pterm.FgBlue},
		{"config", "Show or edit global config", pterm.FgYellow},
		{"help", "Help about any command", pterm.FgWhite},
		{"install", "Install kiro-cleaner to system PATH", pterm.FgGreen},
		{"scan", "Scan storage usage", pterm.FgGreen},
		{"uninstall", "Remove kiro-cleaner from system PATH", pterm.FgMagenta},
	}
	for _, c := range allCommands {
		name := pterm.NewStyle(c.color, pterm.Bold).Sprintf("%-12s", c.name)
		desc := pterm.NewStyle(pterm.FgWhite).Sprint(c.desc)
		fmt.Printf("    %s  %s\n", name, desc)
	}
	fmt.Println()
	
	// 全局标志
	printSectionHeader("Global Flags")
	flags := []struct {
		short string
		long  string
		typ   string
		desc  string
	}{
		{"-c", "--config", "string", "Config file path"},
		{"", "--config-dir", "string", "Config directory path"},
		{"-h", "--help", "", "Help for kiro-cleaner"},
		{"-o", "--output", "string", "Output format: table|json|csv (default \"table\")"},
		{"-v", "--verbose", "", "Verbose output"},
		{"", "--version", "", "Version for kiro-cleaner"},
	}
	for _, f := range flags {
		var flagStr string
		if f.short != "" {
			flagStr = pterm.NewStyle(pterm.FgYellow).Sprintf("%s, ", f.short)
		} else {
			flagStr = "    "
		}
		longFlag := pterm.NewStyle(pterm.FgYellow).Sprint(f.long)
		if f.typ != "" {
			longFlag += " " + pterm.NewStyle(pterm.FgGray).Sprint(f.typ)
		}
		desc := pterm.NewStyle(pterm.FgWhite).Sprint(f.desc)
		fmt.Printf("    %s%-22s  %s\n", flagStr, longFlag, desc)
	}
	fmt.Println()
	
	// 提示
	tip := pterm.NewStyle(pterm.FgGray).Sprint("Use")
	cmdHelp := pterm.NewStyle(pterm.FgCyan).Sprint("kiro-cleaner [command] --help")
	tipEnd := pterm.NewStyle(pterm.FgGray).Sprint("for more information about a command.")
	fmt.Printf("  %s %s %s\n", tip, cmdHelp, tipEnd)
	fmt.Println()
}

// 子命令帮助模板
func customSubCmdHelpFunc(cmd *cobra.Command, args []string) {
	// 标题
	fmt.Println()
	cmdName := pterm.NewStyle(pterm.FgCyan, pterm.Bold).Sprint(cmd.Name())
	fmt.Printf("  %s - %s\n", cmdName, cmd.Short)
	fmt.Println()
	
	// 描述
	if cmd.Long != "" {
		lines := strings.Split(cmd.Long, "\n")
		for _, line := range lines {
			fmt.Printf("  %s\n", pterm.NewStyle(pterm.FgWhite).Sprint(line))
		}
		fmt.Println()
	}
	
	// 用法
	printSectionHeader("Usage")
	usage := pterm.NewStyle(pterm.FgCyan).Sprint(cmd.UseLine())
	fmt.Printf("    %s\n", usage)
	fmt.Println()
	
	// 命令特定标志
	if cmd.HasLocalFlags() {
		printSectionHeader("Flags")
		cmd.LocalFlags().VisitAll(func(f *pflag.Flag) {
			var flagStr string
			if f.Shorthand != "" {
				flagStr = pterm.NewStyle(pterm.FgYellow).Sprintf("-%s, ", f.Shorthand)
			} else {
				flagStr = "    "
			}
			longFlag := pterm.NewStyle(pterm.FgYellow).Sprint("--" + f.Name)
			if f.Value.Type() != "bool" {
				longFlag += " " + pterm.NewStyle(pterm.FgGray).Sprint(f.Value.Type())
			}
			desc := pterm.NewStyle(pterm.FgWhite).Sprint(f.Usage)
			if f.DefValue != "" && f.DefValue != "false" && f.DefValue != "0" {
				desc += pterm.NewStyle(pterm.FgGray).Sprintf(" (default: %s)", f.DefValue)
			}
			fmt.Printf("    %s%-24s  %s\n", flagStr, longFlag, desc)
		})
		fmt.Println()
	}
	
	// 全局标志
	if cmd.HasInheritedFlags() {
		printSectionHeader("Global Flags")
		cmd.InheritedFlags().VisitAll(func(f *pflag.Flag) {
			var flagStr string
			if f.Shorthand != "" {
				flagStr = pterm.NewStyle(pterm.FgYellow).Sprintf("-%s, ", f.Shorthand)
			} else {
				flagStr = "    "
			}
			longFlag := pterm.NewStyle(pterm.FgYellow).Sprint("--" + f.Name)
			if f.Value.Type() != "bool" {
				longFlag += " " + pterm.NewStyle(pterm.FgGray).Sprint(f.Value.Type())
			}
			desc := pterm.NewStyle(pterm.FgWhite).Sprint(f.Usage)
			fmt.Printf("    %s%-24s  %s\n", flagStr, longFlag, desc)
		})
		fmt.Println()
	}
}

// 打印分区标题
func printSectionHeader(title string) {
	header := pterm.NewStyle(pterm.FgYellow, pterm.Bold).Sprint(title + ":")
	fmt.Printf("  %s\n", header)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// 设置自定义帮助函数
	rootCmd.SetHelpFunc(customHelpFunc)
	
	// 设置版本模板
	rootCmd.SetVersionTemplate(fmt.Sprintf(
		"  %s %s\n",
		pterm.NewStyle(pterm.FgCyan, pterm.Bold).Sprint("🧹 Kiro Cleaner"),
		pterm.NewStyle(pterm.FgGray).Sprint("v"+version),
	))

	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "", "Config file path")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "Verbose output")
	rootCmd.PersistentFlags().StringVarP(&output, "output", "o", "table", "Output format (table|json|csv)")
	rootCmd.PersistentFlags().StringVar(&configDir, "config-dir", "", "Config directory path")
}

func initConfig() {
	if cfgFile != "" {
		fmt.Printf("Using config file: %s\n", cfgFile)
	}

	uiPrompter = ui.NewPrompter()
}
