package backup

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// BackupManager 备份管理器
type BackupManager struct {
	config    *types.BackupConfig
	backupDir string
}

// NewBackupManager 创建新的备份管理器
func NewBackupManager(config *types.BackupConfig) *BackupManager {
	backupDir := config.Path
	if backupDir == "" {
		backupDir = filepath.Join(os.Getenv("HOME"), ".kiro-cleaner", "backups")
	}
	
	return &BackupManager{
		config:    config,
		backupDir: backupDir,
	}
}

// CreateBackup 创建备份
func (bm *BackupManager) CreateBackup(items []types.FileInfo) (string, error) {
	if !bm.config.Enabled {
		return "", fmt.Errorf("备份功能已禁用")
	}
	
	// 创建备份目录
	if err := os.MkdirAll(bm.backupDir, 0755); err != nil {
		return "", fmt.Errorf("创建备份目录失败: %v", err)
	}
	
	// 生成备份ID和时间戳
	timestamp := time.Now().Format("20060102_150405")
	backupID := fmt.Sprintf("backup_%s", timestamp)
	backupPath := filepath.Join(bm.backupDir, backupID+".zip")
	
	// 创建ZIP文件
	zipFile, err := os.Create(backupPath)
	if err != nil {
		return "", fmt.Errorf("创建备份文件失败: %v", err)
	}
	defer zipFile.Close()
	
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()
	
	// 备份文件
	for _, item := range items {
		if err := bm.addFileToZip(zipWriter, item.Path); err != nil {
			return "", fmt.Errorf("备份文件 %s 失败: %v", item.Path, err)
		}
	}
	
	return backupID, nil
}

// addFileToZip 将文件添加到ZIP
func (bm *BackupManager) addFileToZip(zipWriter *zip.Writer, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()
	
	// 获取文件信息
	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}
	
	// 创建ZIP文件头
	header, err := zip.FileInfoHeader(fileInfo)
	if err != nil {
		return err
	}
	
	// 设置压缩方法
	header.Method = zip.Deflate
	
	// 添加文件到ZIP
	writer, err := zipWriter.CreateHeader(header)
	if err != nil {
		return err
	}
	
	// 复制文件内容
	_, err = io.Copy(writer, file)
	return err
}

// Restore 恢复备份
func (bm *BackupManager) Restore(backupID string) error {
	backupPath := filepath.Join(bm.backupDir, backupID+".zip")
	
	// 检查备份文件是否存在
	if _, err := os.Stat(backupPath); os.IsNotExist(err) {
		return fmt.Errorf("备份文件不存在: %s", backupPath)
	}
	
	// 打开ZIP文件
	zipFile, err := zip.OpenReader(backupPath)
	if err != nil {
		return fmt.Errorf("打开备份文件失败: %v", err)
	}
	defer zipFile.Close()
	
	// 提取文件
	for _, file := range zipFile.File {
		filePath := filepath.Join(bm.backupDir, file.Name)
		
		if file.FileInfo().IsDir() {
			// 创建目录
			if err := os.MkdirAll(filePath, 0755); err != nil {
				return fmt.Errorf("创建目录失败: %v", err)
			}
			continue
		}
		
		// 创建文件
		if err := bm.extractFile(file, filePath); err != nil {
			return fmt.Errorf("提取文件失败: %v", err)
		}
	}
	
	return nil
}

// extractFile 提取单个文件
func (bm *BackupManager) extractFile(file *zip.File, destPath string) error {
	// 创建目标目录
	destDir := filepath.Dir(destPath)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		return err
	}
	
	// 创建目标文件
	destFile, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer destFile.Close()
	
	// 复制文件内容
	sourceFile, err := file.Open()
	if err != nil {
		return err
	}
	defer sourceFile.Close()
	
	_, err = io.Copy(destFile, sourceFile)
	return err
}

// ListBackups 列出备份
func (bm *BackupManager) ListBackups() ([]types.BackupInfo, error) {
	var backups []types.BackupInfo
	
	// 读取备份目录
	files, err := os.ReadDir(bm.backupDir)
	if err != nil {
		if os.IsNotExist(err) {
			return backups, nil
		}
		return nil, err
	}
	
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		
		name := file.Name()
		if filepath.Ext(name) != ".zip" {
			continue
		}
		
		backupID := name[:len(name)-4] // 移除.zip扩展名
		
		// 获取文件信息
		info, err := file.Info()
		if err != nil {
			continue
		}
		
		backup := types.BackupInfo{
			ID:        backupID,
			Path:      filepath.Join(bm.backupDir, name),
			Size:      info.Size(),
			CreatedAt: info.ModTime(),
			ItemCount: 0, // 暂时设为0，后续可以解析ZIP获取
			Description: fmt.Sprintf("自动备份 %s", info.ModTime().Format("2006-01-02 15:04:05")),
		}
		
		backups = append(backups, backup)
	}
	
	return backups, nil
}

// CleanupOldBackups 清理旧备份
func (bm *BackupManager) CleanupOldBackups() error {
	if !bm.config.AutoCleanup {
		return nil
	}
	
	backups, err := bm.ListBackups()
	if err != nil {
		return err
	}
	
	if len(backups) <= bm.config.MaxBackups {
		return nil
	}
	
	// 按创建时间排序
	for i := 0; i < len(backups)-1; i++ {
		for j := i + 1; j < len(backups); j++ {
			if backups[i].CreatedAt.After(backups[j].CreatedAt) {
				backups[i], backups[j] = backups[j], backups[i]
			}
		}
	}
	
	// 删除多余的备份
	toDelete := len(backups) - bm.config.MaxBackups
	for i := 0; i < toDelete; i++ {
		if err := os.Remove(backups[i].Path); err != nil {
			return fmt.Errorf("删除备份文件失败: %v", err)
		}
	}
	
	return nil
}

// GetBackupDir 获取备份目录
func (bm *BackupManager) GetBackupDir() string {
	return bm.backupDir
}