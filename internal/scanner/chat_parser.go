package scanner

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// ChatParser 解析 .chat 文件
type ChatParser struct{}

// NewChatParser 创建新的解析器
func NewChatParser() *ChatParser {
	return &ChatParser{}
}

// ParseChatFile 解析单个 chat 文件
func (cp *ChatParser) ParseChatFile(path string) (*types.ChatFileInfo, error) {
	// 获取文件信息
	fileInfo, err := os.Stat(path)
	if err != nil {
		return nil, fmt.Errorf("获取文件信息失败: %v", err)
	}

	// 读取文件内容
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("读取文件失败: %v", err)
	}

	// 解析 JSON
	var chatFile types.ChatFile
	if err := json.Unmarshal(data, &chatFile); err != nil {
		return nil, fmt.Errorf("解析 JSON 失败: %v", err)
	}

	// 统计消息
	humanCount, botCount, toolCount := cp.CountMessages(chatFile.Chat)

	return &types.ChatFileInfo{
		Path:          path,
		Size:          fileInfo.Size(),
		ModTime:       fileInfo.ModTime(),
		MessageCount:  len(chatFile.Chat),
		HumanMessages: humanCount,
		BotMessages:   botCount,
		ToolMessages:  toolCount,
		Metadata:      chatFile.Metadata,
	}, nil
}

// CountMessages 统计消息数量
func (cp *ChatParser) CountMessages(messages []types.ChatMessage) (human, bot, tool int) {
	for _, msg := range messages {
		switch msg.Role {
		case "human":
			human++
		case "bot":
			bot++
		case "tool":
			tool++
		}
	}
	return
}

// ExtractMetadata 提取元数据并转换时间戳
func (cp *ChatParser) ExtractMetadata(metadata types.ChatMetadata) (startTime, endTime time.Time) {
	if metadata.StartTime > 0 {
		startTime = time.UnixMilli(metadata.StartTime)
	}
	if metadata.EndTime > 0 {
		endTime = time.UnixMilli(metadata.EndTime)
	}
	return
}

// ParseChatFileFromBytes 从字节数据解析 chat 文件（用于测试）
func (cp *ChatParser) ParseChatFileFromBytes(data []byte, path string, size int64, modTime time.Time) (*types.ChatFileInfo, error) {
	var chatFile types.ChatFile
	if err := json.Unmarshal(data, &chatFile); err != nil {
		return nil, fmt.Errorf("解析 JSON 失败: %v", err)
	}

	humanCount, botCount, toolCount := cp.CountMessages(chatFile.Chat)

	return &types.ChatFileInfo{
		Path:          path,
		Size:          size,
		ModTime:       modTime,
		MessageCount:  len(chatFile.Chat),
		HumanMessages: humanCount,
		BotMessages:   botCount,
		ToolMessages:  toolCount,
		Metadata:      chatFile.Metadata,
	}, nil
}
