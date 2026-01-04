package scanner

import (
	"encoding/json"
	"testing"
	"testing/quick"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// **Property 2: Message Count Accuracy**
// *For any* valid chat file with a chat array of length N, the parsed MessageCount SHALL equal N,
// and the sum of HumanMessages, BotMessages, and ToolMessages SHALL equal N.
// **Validates: Requirements 3.2, 3.3**

func TestProperty2_MessageCountAccuracy(t *testing.T) {
	parser := NewChatParser()

	// 属性测试：消息计数准确性
	property := func(humanCount, botCount, toolCount uint8) bool {
		// 限制消息数量以避免测试过慢
		h := int(humanCount % 50)
		b := int(botCount % 50)
		to := int(toolCount % 50)

		// 构建消息列表
		messages := make([]types.ChatMessage, 0, h+b+to)
		for i := 0; i < h; i++ {
			messages = append(messages, types.ChatMessage{Role: "human", Content: "test"})
		}
		for i := 0; i < b; i++ {
			messages = append(messages, types.ChatMessage{Role: "bot", Content: "test"})
		}
		for i := 0; i < to; i++ {
			messages = append(messages, types.ChatMessage{Role: "tool", Content: "test"})
		}

		// 构建 chat 文件
		chatFile := types.ChatFile{
			ExecutionID: "test",
			ActionID:    "test",
			Chat:        messages,
			Metadata:    types.ChatMetadata{},
		}

		// 序列化为 JSON
		data, err := json.Marshal(chatFile)
		if err != nil {
			return false
		}

		// 解析
		result, err := parser.ParseChatFileFromBytes(data, "test.chat", int64(len(data)), time.Now())
		if err != nil {
			return false
		}

		// 验证属性：
		// 1. MessageCount 等于消息数组长度
		totalExpected := h + b + to
		if result.MessageCount != totalExpected {
			t.Logf("MessageCount mismatch: got %d, expected %d", result.MessageCount, totalExpected)
			return false
		}

		// 2. 各类消息计数之和等于总数
		sumOfCounts := result.HumanMessages + result.BotMessages + result.ToolMessages
		if sumOfCounts != result.MessageCount {
			t.Logf("Sum mismatch: %d + %d + %d = %d, expected %d",
				result.HumanMessages, result.BotMessages, result.ToolMessages,
				sumOfCounts, result.MessageCount)
			return false
		}

		// 3. 各类消息计数正确
		if result.HumanMessages != h {
			t.Logf("HumanMessages mismatch: got %d, expected %d", result.HumanMessages, h)
			return false
		}
		if result.BotMessages != b {
			t.Logf("BotMessages mismatch: got %d, expected %d", result.BotMessages, b)
			return false
		}
		if result.ToolMessages != to {
			t.Logf("ToolMessages mismatch: got %d, expected %d", result.ToolMessages, to)
			return false
		}

		return true
	}

	// 运行至少 100 次迭代
	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 2 failed: %v", err)
	}
}

// 单元测试：空消息列表
func TestChatParser_EmptyMessages(t *testing.T) {
	parser := NewChatParser()

	chatFile := types.ChatFile{
		ExecutionID: "test",
		ActionID:    "test",
		Chat:        []types.ChatMessage{},
		Metadata:    types.ChatMetadata{},
	}

	data, _ := json.Marshal(chatFile)
	result, err := parser.ParseChatFileFromBytes(data, "test.chat", int64(len(data)), time.Now())

	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if result.MessageCount != 0 {
		t.Errorf("Expected 0 messages, got %d", result.MessageCount)
	}
}

// 单元测试：无效 JSON
func TestChatParser_InvalidJSON(t *testing.T) {
	parser := NewChatParser()

	invalidData := []byte("not valid json")
	_, err := parser.ParseChatFileFromBytes(invalidData, "test.chat", int64(len(invalidData)), time.Now())

	if err == nil {
		t.Error("Expected error for invalid JSON, got nil")
	}
}

// 单元测试：元数据提取
func TestChatParser_ExtractMetadata(t *testing.T) {
	parser := NewChatParser()

	metadata := types.ChatMetadata{
		ModelID:       "claude-opus-4.5",
		ModelProvider: "qdev",
		Workflow:      "act",
		StartTime:     1767443638856,
		EndTime:       1767443643497,
	}

	startTime, endTime := parser.ExtractMetadata(metadata)

	if startTime.IsZero() {
		t.Error("StartTime should not be zero")
	}
	if endTime.IsZero() {
		t.Error("EndTime should not be zero")
	}
	if !endTime.After(startTime) {
		t.Error("EndTime should be after StartTime")
	}
}

// 单元测试：未知角色消息
func TestChatParser_UnknownRole(t *testing.T) {
	parser := NewChatParser()

	messages := []types.ChatMessage{
		{Role: "human", Content: "test"},
		{Role: "unknown", Content: "test"}, // 未知角色
		{Role: "bot", Content: "test"},
	}

	human, bot, tool := parser.CountMessages(messages)

	if human != 1 {
		t.Errorf("Expected 1 human message, got %d", human)
	}
	if bot != 1 {
		t.Errorf("Expected 1 bot message, got %d", bot)
	}
	if tool != 0 {
		t.Errorf("Expected 0 tool messages, got %d", tool)
	}
	// 未知角色不计入任何类别，总和为 2，但消息数为 3
}
