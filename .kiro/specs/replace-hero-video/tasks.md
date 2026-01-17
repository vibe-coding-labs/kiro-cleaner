# Implementation Plan: Replace Hero Video

## Overview

将 Hero Section 中的演示视频从 scan 命令替换为 clean 命令。

## Tasks

- [x] 1. Update video sources in HeroSection component
  - Modify `website/src/components/HeroSection.tsx`
  - Replace scan command video sources with clean command video sources
  - Update primary source to `/assets/demo-clean-command.mov`
  - Update secondary source to `/assets/demo-clean-command-3x.mov`
  - Ensure MIME types are correct (`video/quicktime`)
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [x] 1.1 Write property test for video source correctness
  - **Property 1: Video Source Correctness**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Verify video file exists and is accessible
  - Check that `/assets/demo-clean-command.mov` exists in `website/public/assets/`
  - Check that `/assets/demo-clean-command-3x.mov` exists in `website/public/assets/`
  - Verify file sizes are reasonable (not corrupted)
  - _Requirements: 2.3_

- [x] 3. Test video playback
  - Start the development server
  - Navigate to the Hero Section
  - Verify the clean command video plays automatically
  - Verify the video loops continuously
  - Verify the video is muted
  - Test in multiple browsers (Chrome, Firefox, Safari)
  - _Requirements: 1.4, 1.5, 2.4_

- [x] 4. Final verification
  - Confirm no references to scan command video remain in HeroSection
  - Verify responsive behavior on mobile devices
  - Verify fallback message displays correctly if video fails
  - _Requirements: 1.5, 2.3, 2.4_

## Notes

- This is a simple content update task
- Only one file needs to be modified: `website/src/components/HeroSection.tsx`
- The video files already exist in the assets directory
- No new dependencies or configurations required
