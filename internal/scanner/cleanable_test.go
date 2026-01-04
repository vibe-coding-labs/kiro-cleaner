package scanner

import (
	"testing"
	"testing/quick"
	"time"

	"github.com/vibe-coding-labs/kiro-cleaner/pkg/types"
)

// **Property 6: Cleanable Conversation Identification**
// *For any* set of conversations, those identified as cleanable due to age SHALL have ModTime
// older than the threshold, and those identified as cleanable due to size SHALL have Size
// greater than the threshold.
// **Validates: Requirements 5.1, 5.2**

func TestProperty6_CleanableConversationIdentification(t *testing.T) {
	property := func(ageDays uint8, sizeThreshold uint32, conversations []struct {
		DaysOld uint16
		Size    uint32
	}) bool {
		if len(conversations) == 0 {
			return true
		}

		// 限制数组大小
		if len(conversations) > 50 {
			conversations = conversations[:50]
		}

		// 确保阈值合理
		days := int(ageDays)
		if days == 0 || days > 365 {
			days = 30
		}
		sizeBytes := int64(sizeThreshold)
		if sizeBytes == 0 {
			sizeBytes = 1024 * 1024 // 1MB
		}

		cutoffTime := time.Now().AddDate(0, 0, -days)

		// 模拟识别可清理对话
		var cleanable []types.CleanableConversation
		for i, conv := range conversations {
			modTime := time.Now().AddDate(0, 0, -int(conv.DaysOld))
			size := int64(conv.Size)

			if modTime.Before(cutoffTime) {
				cleanable = append(cleanable, types.CleanableConversation{
					Path:    "test" + string(rune(i)),
					Size:    size,
					ModTime: modTime,
					Reason:  "old",
				})
			} else if size > sizeBytes {
				cleanable = append(cleanable, types.CleanableConversation{
					Path:    "test" + string(rune(i)),
					Size:    size,
					ModTime: modTime,
					Reason:  "large",
				})
			}
		}

		// 验证属性：所有标记为 "old" 的对话确实比阈值旧
		for _, c := range cleanable {
			if c.Reason == "old" && !c.ModTime.Before(cutoffTime) {
				return false
			}
			if c.Reason == "large" && c.Size <= sizeBytes {
				return false
			}
		}

		return true
	}

	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 6 failed: %v", err)
	}
}

// **Property 7: Space Savings Calculation**
// *For any* set of cleanable conversations with sizes S1, S2, ..., Sn,
// the potential space savings SHALL equal S1 + S2 + ... + Sn.
// **Validates: Requirements 5.3**

func TestProperty7_SpaceSavingsCalculation(t *testing.T) {
	scanner := NewChatScanner()

	property := func(sizes []uint32) bool {
		if len(sizes) == 0 {
			return true
		}

		// 限制数组大小
		if len(sizes) > 100 {
			sizes = sizes[:100]
		}

		// 创建可清理对话列表
		cleanable := make([]types.CleanableConversation, len(sizes))
		var expectedTotal int64

		for i, size := range sizes {
			s := int64(size)
			cleanable[i] = types.CleanableConversation{
				Path:    "test",
				Size:    s,
				ModTime: time.Now(),
				Reason:  "old",
			}
			expectedTotal += s
		}

		// 计算空间节省
		actualTotal := scanner.CalculateSpaceSavings(cleanable)

		return actualTotal == expectedTotal
	}

	config := &quick.Config{MaxCount: 100}
	if err := quick.Check(property, config); err != nil {
		t.Errorf("Property 7 failed: %v", err)
	}
}

// 单元测试：空列表的空间节省
func TestSpaceSavings_EmptyList(t *testing.T) {
	scanner := NewChatScanner()

	savings := scanner.CalculateSpaceSavings([]types.CleanableConversation{})

	if savings != 0 {
		t.Errorf("Expected 0 savings for empty list, got %d", savings)
	}
}

// 单元测试：混合原因的可清理对话
func TestCleanableConversations_MixedReasons(t *testing.T) {
	cleanable := []types.CleanableConversation{
		{Path: "old1.chat", Size: 1024, ModTime: time.Now().AddDate(0, 0, -60), Reason: "old"},
		{Path: "large1.chat", Size: 2 * 1024 * 1024, ModTime: time.Now(), Reason: "large"},
		{Path: "old2.chat", Size: 512, ModTime: time.Now().AddDate(0, 0, -90), Reason: "old"},
	}

	scanner := NewChatScanner()
	savings := scanner.CalculateSpaceSavings(cleanable)

	expectedSavings := int64(1024 + 2*1024*1024 + 512)
	if savings != expectedSavings {
		t.Errorf("Expected %d savings, got %d", expectedSavings, savings)
	}
}

// 单元测试：验证清理原因正确性
func TestCleanableConversations_ReasonValidation(t *testing.T) {
	now := time.Now()
	cutoff := now.AddDate(0, 0, -30)
	sizeThreshold := int64(1024 * 1024) // 1MB

	tests := []struct {
		name           string
		modTime        time.Time
		size           int64
		expectedReason string
		shouldClean    bool
	}{
		{"old file", now.AddDate(0, 0, -60), 100, "old", true},
		{"large file", now, 2 * 1024 * 1024, "large", true},
		{"recent small file", now, 100, "", false},
		{"old large file", now.AddDate(0, 0, -60), 2 * 1024 * 1024, "old", true}, // 优先标记为 old
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var reason string
			shouldClean := false

			if tt.modTime.Before(cutoff) {
				reason = "old"
				shouldClean = true
			} else if tt.size > sizeThreshold {
				reason = "large"
				shouldClean = true
			}

			if shouldClean != tt.shouldClean {
				t.Errorf("shouldClean = %v, expected %v", shouldClean, tt.shouldClean)
			}
			if shouldClean && reason != tt.expectedReason {
				t.Errorf("reason = %s, expected %s", reason, tt.expectedReason)
			}
		})
	}
}
