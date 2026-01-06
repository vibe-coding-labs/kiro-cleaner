package main

import (
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
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
		Long:  getLongDescription(),
		Version: version,
	}

	uiPrompter ui.Prompter
)

func getLongDescription() string {
	// Colors
	cyan := color.New(color.FgHiCyan, color.Bold).SprintFunc()
	green := color.New(color.FgHiGreen, color.Bold).SprintFunc()
	yellow := color.New(color.FgHiYellow, color.Bold).SprintFunc()
	blue := color.New(color.FgHiBlue, color.Bold).SprintFunc()
	red := color.New(color.FgHiRed, color.Bold).SprintFunc()
	white := color.New(color.FgHiWhite).SprintFunc()
	dim := color.New(color.FgWhite).SprintFunc()
	
	return fmt.Sprintf(`
%s %s

%s

%s
  %s     %s
  %s    %s

%s
  %s kiro-cleaner scan
  %s kiro-cleaner scan --detailed
  %s kiro-cleaner clean --dry-run
  %s kiro-cleaner clean --temp --logs --force

%s %s
%s %s`,
		cyan("🧹 Kiro Cleaner"),
		dim("v"+version),
		white("Safely clean Kiro IDE storage: conversations, cache, logs, and temp files."),
		yellow("⚡ Quick Start:"),
		green("scan"),
		white("Scan storage usage (use --detailed for full analysis)"),
		red("clean"),
		white("Clean up redundant files"),
		yellow("📋 Examples:"),
		dim("$"),
		dim("$"),
		dim("$"),
		dim("$"),
		cyan("🔗 GitHub:"),
		blue("https://github.com/vibe-coding-labs/kiro-cleaner"),
		cyan("📦 Install:"),
		dim("go install github.com/vibe-coding-labs/kiro-cleaner@latest"),
	)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

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
