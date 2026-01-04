package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

// Config 配置结构
type Config struct {
	Version       string         `json:"version"`
	KiroPaths     []string       `json:"kiro_paths"`
	CleanupRules  []CleanupRule  `json:"cleanup_rules"`
	BackupConfig  BackupConfig   `json:"backup_config"`
	SafetyChecks  SafetyConfig   `json:"safety_checks"`
	UIConfig      UIConfig       `json:"ui_config"`
}

// CleanupRule 清理规则结构
type CleanupRule struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Priority    int         `json:"priority"`
	Enabled     bool        `json:"enabled"`
	Conditions  []Condition `json:"conditions"`
	Actions     []Action    `json:"actions"`
}

// Condition 条件结构
type Condition struct {
	Type        string      `json:"type"`
	Field       string      `json:"field"`
	Operator    string      `json:"operator"`
	Value       interface{} `json:"value"`
	LogicOp     string      `json:"logic_op"`
}

// Action 动作结构
type Action struct {
	Type    string                 `json:"type"`
	Backup  bool                   `json:"backup"`
	Params  map[string]interface{} `json:"params"`
}

// BackupConfig 备份配置结构
type BackupConfig struct {
	Enabled        bool   `json:"enabled"`
	Path           string `json:"path"`
	MaxBackups     int    `json:"max_backups"`
	Compressed     bool   `json:"compressed"`
	AutoCleanup    bool   `json:"auto_cleanup"`
	Schedule       string `json:"schedule"`
}

// SafetyConfig 安全配置结构
type SafetyConfig struct {
	MinDiskSpace     string `json:"min_disk_space"`
	VerifyDatabase   bool   `json:"verify_database"`
	RequireConfirmation bool `json:"require_confirmation"`
	BackupBeforeDelete bool `json:"backup_before_delete"`
	MaxConcurrentOps int    `json:"max_concurrent_ops"`
}

// UIConfig UI配置结构
type UIConfig struct {
	ShowProgress     bool `json:"show_progress"`
	DetailedOutput   bool `json:"detailed_output"`
	ColorOutput      bool `json:"color_output"`
	PauseBetweenSteps bool `json:"pause_between_steps"`
}

// ConfigManager 配置管理器
type ConfigManager struct {
	configPath string
	config     *Config
	viper      *viper.Viper
}

// NewConfigManager 创建新的配置管理器
func NewConfigManager(configPath string) *ConfigManager {
	return &ConfigManager{
		configPath: configPath,
		config:     &Config{},
		viper:      viper.New(),
	}
}

// Load 加载配置
func (cm *ConfigManager) Load() error {
	if cm.configPath == "" {
		// 使用默认路径
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return fmt.Errorf("获取用户主目录失败: %v", err)
		}
		cm.configPath = filepath.Join(homeDir, ".config", "kiro-cleaner", "config.json")
	}
	
	// 创建配置目录
	configDir := filepath.Dir(cm.configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("创建配置目录失败: %v", err)
	}
	
	// 检查配置文件是否存在
	if _, err := os.Stat(cm.configPath); os.IsNotExist(err) {
		// 创建默认配置
		if err := cm.createDefaultConfig(); err != nil {
			return err
		}
	}
	
	// 读取配置文件
	data, err := os.ReadFile(cm.configPath)
	if err != nil {
		return fmt.Errorf("读取配置文件失败: %v", err)
	}
	
	// 解析JSON配置
	if err := json.Unmarshal(data, cm.config); err != nil {
		return fmt.Errorf("解析配置文件失败: %v", err)
	}
	
	return nil
}

// Save 保存配置
func (cm *ConfigManager) Save() error {
	if cm.configPath == "" {
		return fmt.Errorf("配置路径未设置")
	}
	
	// 创建配置目录
	configDir := filepath.Dir(cm.configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("创建配置目录失败: %v", err)
	}
	
	// 序列化为JSON
	data, err := json.MarshalIndent(cm.config, "", "  ")
	if err != nil {
		return fmt.Errorf("序列化配置失败: %v", err)
	}
	
	// 写入文件
	if err := os.WriteFile(cm.configPath, data, 0644); err != nil {
		return fmt.Errorf("写入配置文件失败: %v", err)
	}
	
	return nil
}

// Get 获取配置
func (cm *ConfigManager) Get() *Config {
	return cm.config
}

// Update 更新配置
func (cm *ConfigManager) Update(updates map[string]interface{}) error {
	// 这里可以实现更复杂的配置更新逻辑
	// 暂时使用JSON序列化/反序列化
	return nil
}

// createDefaultConfig 创建默认配置
func (cm *ConfigManager) createDefaultConfig() error {
	defaultConfig := &Config{
		Version: "1.0.0",
		KiroPaths: []string{},
		CleanupRules: []CleanupRule{
			{
				Name:        "temp_file_cleanup",
				Description: "清理临时文件",
				Priority:    1,
				Enabled:     true,
				Conditions: []Condition{
					{
						Type:     "file_type",
						Field:    "file_type",
						Operator: "=",
						Value:    "temp",
					},
				},
				Actions: []Action{
					{
						Type:   "delete",
						Backup: false,
					},
				},
			},
		},
		BackupConfig: BackupConfig{
			Enabled:        true,
			Path:           "~/.kiro-cleaner/backups",
			MaxBackups:     5,
			Compressed:     true,
			AutoCleanup:    true,
			Schedule:       "manual",
		},
		SafetyChecks: SafetyConfig{
			MinDiskSpace:     "100MB",
			VerifyDatabase:   true,
			RequireConfirmation: true,
			BackupBeforeDelete: true,
			MaxConcurrentOps: 3,
		},
		UIConfig: UIConfig{
			ShowProgress:     true,
			DetailedOutput:   false,
			ColorOutput:      true,
			PauseBetweenSteps: false,
		},
	}
	
	cm.config = defaultConfig
	return cm.Save()
}