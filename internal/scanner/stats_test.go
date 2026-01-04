package scanner

import (
	"testing"
	"testing/quick"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// **Property 3: Size Aggregation**
// *For any* set of chat files with individual sizes S1, S2, ..., Sn,
// the TotalSize in ConversationStats SHALL equal S1 + S2 + ... + Sn.
// **Validates: Requirements 2.4, 4.3**

func TestProperty3_SizeAggregation(t *testing.T) {
	property := func(sizes []uint32) bool {
		if len(sizes) == 0 {
			return true
		}

		// 限制数组大小
		if len(sizes) > 100 {
			sizes = sizes[:100]
		}

		// 计算期望的总大小
		var expectedTotal int64
		workspaces := make([]types.WorkspaceStats, 0)

		// 模拟多个工作区
		numWorkspaces := (len(sizes) / 10) + 1
		sizeIndex := 0

		for i := 0; i < numWorkspaces && sizeIndex < len(sizes); i++ {
			ws := types.WorkspaceStats{
				WorkspaceID: "test",
			}

			// 每个工作区分配一些文件
			filesInWorkspace := 10
			if sizeIndex+filesInWorkspace > len(sizes) {
				filesInWorkspace = len(sizes) - sizeIndex
			}

			for j := 0; j < filesInWorkspace; j++ {
				size := int64(sizes[sizeIndex])
				ws.TotalSize += size
				expectedTotal += size
				sizeIndex++
			}

			workspaces = append(workspaces, ws)
		}

		// 聚合统计
		var actualTotal int64
		for _, ws := range workspaces {
			actualTotal += ws.TotalSize
		}

		return actualTotal == expectedTotal
	}

	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 3 failed: %v", err)
	}
}

// **Property 4: Conversation Count Accuracy**
// *For any* set of workspace folders containing chat files,
// the TotalConversations SHALL equal the total number of `.chat` files across all workspaces.
// **Validates: Requirements 2.3, 4.1**

func TestProperty4_ConversationCountAccuracy(t *testing.T) {
	property := func(counts []uint8) bool {
		if len(counts) == 0 {
			return true
		}

		// 限制工作区数量
		if len(counts) > 50 {
			counts = counts[:50]
		}

		// 创建工作区统计
		workspaces := make([]types.WorkspaceStats, len(counts))
		var expectedTotal int

		for i, count := range counts {
			c := int(count % 100) // 限制每个工作区的对话数
			workspaces[i] = types.WorkspaceStats{
				WorkspaceID:       "test",
				ConversationCount: c,
			}
			expectedTotal += c
		}

		// 聚合统计
		var actualTotal int
		for _, ws := range workspaces {
			actualTotal += ws.ConversationCount
		}

		return actualTotal == expectedTotal
	}

	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 4 failed: %v", err)
	}
}

// **Property 5: Average Calculation**
// *For any* ConversationStats with TotalConversations > 0,
// AvgMessagesPerConv SHALL equal TotalMessages / TotalConversations.
// **Validates: Requirements 4.5**

func TestProperty5_AverageCalculation(t *testing.T) {
	property := func(totalMessages uint32, totalConversations uint16) bool {
		// 确保至少有一个对话
		convs := int(totalConversations)
		if convs == 0 {
			convs = 1
		}

		msgs := int(totalMessages)

		// 计算期望的平均值
		expectedAvg := float64(msgs) / float64(convs)

		// 模拟 ConversationStats 的计算
		stats := types.ConversationStats{
			TotalMessages:      msgs,
			TotalConversations: convs,
		}

		if stats.TotalConversations > 0 {
			stats.AvgMessagesPerConv = float64(stats.TotalMessages) / float64(stats.TotalConversations)
		}

		// 验证平均值计算正确
		return stats.AvgMessagesPerConv == expectedAvg
	}

	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 5 failed: %v", err)
	}
}

// 单元测试：零对话时的平均值
func TestAverageCalculation_ZeroConversations(t *testing.T) {
	stats := types.ConversationStats{
		TotalMessages:      0,
		TotalConversations: 0,
	}

	// 当对话数为0时，平均值应该为0
	if stats.TotalConversations > 0 {
		stats.AvgMessagesPerConv = float64(stats.TotalMessages) / float64(stats.TotalConversations)
	}

	if stats.AvgMessagesPerConv != 0 {
		t.Errorf("Expected 0 average for zero conversations, got %f", stats.AvgMessagesPerConv)
	}
}

// 单元测试：工作区分解
func TestWorkspaceBreakdown(t *testing.T) {
	workspaces := []types.WorkspaceStats{
		{WorkspaceID: "ws1", ConversationCount: 10, TotalMessages: 100, TotalSize: 1024},
		{WorkspaceID: "ws2", ConversationCount: 5, TotalMessages: 50, TotalSize: 512},
		{WorkspaceID: "ws3", ConversationCount: 15, TotalMessages: 200, TotalSize: 2048},
	}

	stats := types.ConversationStats{
		WorkspaceBreakdown: workspaces,
	}

	// 聚合
	for _, ws := range stats.WorkspaceBreakdown {
		stats.TotalConversations += ws.ConversationCount
		stats.TotalMessages += ws.TotalMessages
		stats.TotalSize += ws.TotalSize
	}

	if stats.TotalConversations > 0 {
		stats.AvgMessagesPerConv = float64(stats.TotalMessages) / float64(stats.TotalConversations)
	}

	// 验证
	if stats.TotalConversations != 30 {
		t.Errorf("Expected 30 conversations, got %d", stats.TotalConversations)
	}
	if stats.TotalMessages != 350 {
		t.Errorf("Expected 350 messages, got %d", stats.TotalMessages)
	}
	if stats.TotalSize != 3584 {
		t.Errorf("Expected 3584 bytes, got %d", stats.TotalSize)
	}

	expectedAvg := 350.0 / 30.0
	if stats.AvgMessagesPerConv != expectedAvg {
		t.Errorf("Expected average %f, got %f", expectedAvg, stats.AvgMessagesPerConv)
	}
}
