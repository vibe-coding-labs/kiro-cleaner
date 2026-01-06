package config

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// GlobalConfig 全局配置
type GlobalConfig struct {
	// 清理选项（true=保留，false=清理）
	KeepLogs   bool `json:"keep_logs"`   // 保留日志
	KeepCache  bool `json:"keep_cache"`  // 保留缓存
	KeepChats  bool `json:"keep_chats"`  // 保留对话
	KeepIndex  bool `json:"keep_index"`  // 保留索引
	KeepRecent int  `json:"keep_recent"` // 保留最近N天的文件（0=不保留）
}

// DefaultConfig 默认配置（全部清理）
func DefaultConfig() *GlobalConfig {
	return &GlobalConfig{
		KeepLogs:   false,
		KeepCache:  false,
		KeepChats:  false,
		KeepIndex:  false,
		KeepRecent: 0,
	}
}

// ConfigDir 获取配置目录路径
func ConfigDir() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".kiro-cleaner")
}

// ConfigPath 获取配置文件路径
func ConfigPath() string {
	return filepath.Join(ConfigDir(), "config.json")
}

// LoadConfig 加载配置，如果不存在则返回默认配置
func LoadConfig() *GlobalConfig {
	cfg := DefaultConfig()
	
	data, err := os.ReadFile(ConfigPath())
	if err != nil {
		return cfg
	}
	
	json.Unmarshal(data, cfg)
	return cfg
}

// SaveConfig 保存配置
func SaveConfig(cfg *GlobalConfig) error {
	// 确保目录存在
	if err := os.MkdirAll(ConfigDir(), 0755); err != nil {
		return err
	}
	
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	
	return os.WriteFile(ConfigPath(), data, 0644)
}

// EnsureConfigExists 确保配置文件存在，不存在则创建默认配置
func EnsureConfigExists() error {
	if _, err := os.Stat(ConfigPath()); os.IsNotExist(err) {
		return SaveConfig(DefaultConfig())
	}
	return nil
}
