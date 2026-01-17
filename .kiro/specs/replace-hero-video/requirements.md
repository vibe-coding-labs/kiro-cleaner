# Requirements Document: Replace Hero Video

## Introduction

本文档定义了将 Kiro Cleaner 官网 Hero Section 中的演示视频从 scan 命令替换为 clean 命令的需求。

## Glossary

- **Hero Section**: 网站首屏的主要展示区域
- **Demo Video**: 展示产品功能的演示视频
- **Clean Command**: Kiro Cleaner 的清理命令，用于删除不需要的文件

## Requirements

### Requirement 1

**User Story:** 作为访问者，我希望在 Hero Section 看到 clean 命令的演示视频，以便了解产品的核心清理功能

#### Acceptance Criteria

1. WHEN the Hero Section loads THEN it SHALL display the clean command demo video instead of the scan command video
2. WHEN the video is displayed THEN it SHALL use the `/assets/demo-clean-command.mov` file as the primary source
3. WHEN the video is displayed THEN it SHALL use the `/assets/demo-clean-command-3x.mov` file as an alternative source
4. WHEN the video plays THEN it SHALL autoplay, loop, and be muted for better user experience
5. WHEN the video is not supported THEN it SHALL display a fallback message in Chinese

### Requirement 2

**User Story:** 作为开发者，我希望视频文件格式正确，以便在不同浏览器中都能正常播放

#### Acceptance Criteria

1. WHEN the video element is rendered THEN it SHALL include multiple source formats for browser compatibility
2. WHEN the video is loaded THEN it SHALL use the `video/quicktime` MIME type for .mov files
3. WHEN the video fails to load THEN it SHALL gracefully handle the error without breaking the page
4. WHEN the video is displayed THEN it SHALL maintain responsive sizing and proper aspect ratio
