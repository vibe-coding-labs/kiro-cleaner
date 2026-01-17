# Design Document: Replace Hero Video

## Overview

本设计文档描述了如何将 Hero Section 中的演示视频从 scan 命令替换为 clean 命令。这是一个简单的内容更新任务，只需要修改视频源文件路径。

## Design Decisions

### 1. Video File Selection

**Decision:** 使用 `demo-clean-command.mov` 和 `demo-clean-command-3x.mov` 作为视频源

**Rationale:**
- 这些文件已经存在于 `website/public/assets/` 目录中
- .mov 格式在 macOS 和现代浏览器中有良好的支持
- 提供两个版本可以让浏览器选择最合适的版本

### 2. Video Element Configuration

**Decision:** 保持现有的视频元素配置（autoplay, loop, muted, playsInline）

**Rationale:**
- 这些属性确保视频能够自动播放而不需要用户交互
- muted 属性是自动播放的必要条件
- playsInline 确保在移动设备上正确播放

### 3. Fallback Message

**Decision:** 保持中文的回退消息

**Rationale:**
- 网站主要面向中文用户
- 保持一致的用户体验

## Implementation Details

### File to Modify

- `website/src/components/HeroSection.tsx`

### Changes Required

在 HeroSection 组件的视频元素中：

**Current:**
```tsx
<source src="/assets/demo-scan-command-hq.mp4" type="video/mp4" />
<source src="/assets/demo-scan-command.mov" type="video/quicktime" />
```

**New:**
```tsx
<source src="/assets/demo-clean-command.mov" type="video/quicktime" />
<source src="/assets/demo-clean-command-3x.mov" type="video/quicktime" />
```

## Testing Strategy

### Manual Testing

1. 在浏览器中打开网站
2. 验证 Hero Section 显示 clean 命令的视频
3. 验证视频自动播放、循环播放
4. 在不同浏览器中测试（Chrome, Firefox, Safari）
5. 在移动设备上测试响应式行为

### Visual Verification

- 确认视频内容展示的是 clean 命令而不是 scan 命令
- 确认视频质量清晰
- 确认视频尺寸和容器匹配

## Correctness Properties

### Property 1: Video Source Correctness

**Property:** The video element SHALL reference the clean command video files

**Test Strategy:** 
- Render the HeroSection component
- Query the video element
- Verify that source elements contain the correct file paths
- Verify that no scan command video paths remain

**Validates:** Requirements 1.1, 1.2, 1.3

### Property 2: Video Playback Configuration

**Property:** The video element SHALL have correct playback attributes

**Test Strategy:**
- Render the HeroSection component
- Query the video element
- Verify autoplay, loop, muted, and playsInline attributes are present
- Verify the attributes maintain their boolean values

**Validates:** Requirements 1.4, 2.4

## Risk Assessment

**Risk Level:** Low

**Risks:**
1. Video file might not exist or be corrupted
   - Mitigation: Verify file existence before deployment
2. Video format might not be supported in some browsers
   - Mitigation: Provide multiple source formats
3. Video file size might be too large
   - Mitigation: Check file size and optimize if needed

## Rollback Plan

If issues occur:
1. Revert the change to use the original scan command video
2. The change is isolated to a single component, making rollback simple
