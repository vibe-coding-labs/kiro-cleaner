# Kiro Cleaner 官方网站

这是一个使用 React、TypeScript 和 Material-UI 构建的 Kiro Cleaner 工具官方网站。

## 项目结构

```
website/
├── public/                 # 静态资源
│   ├── assets/            # 演示视频和图像
│   └── logo.svg          # 网站 logo
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   │   ├── DemoVideo.tsx # 演示视频组件
│   │   ├── Features.tsx  # 特性展示组件
│   │   └── Installation.tsx # 安装说明组件
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口点
│   └── index.css         # 全局样式
├── package.json          # 项目依赖和脚本
└── README.md            # 项目说明
```

## 功能特点

- **响应式设计**: 适配桌面、平板和手机设备
- **演示视频**: 展示 Kiro Cleaner 的实际运行效果
- **特性介绍**: 清晰展示工具的主要功能
- **安装指南**: 提供多种安装方式的详细说明
- **现代化 UI**: 使用 Material-UI 组件库构建美观界面

## 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   # 或
   npm start
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 依赖项

- React & ReactDOM (v18+)
- TypeScript
- Vite (构建工具)
- Material-UI (@mui/material)
- Emotion (CSS-in-JS)
- Material-UI Icons

## 自定义

您可以轻松自定义：

- 修改主题颜色：编辑 `App.tsx` 中的 `createTheme` 函数
- 添加新页面：在 `App.tsx` 中添加新的路由或部分
- 更改内容：更新各组件中的文本和数据
- 替换资源：在 `public/` 目录中替换 logo 和演示视频

## 部署

该网站可以部署到任何支持静态网站托管的服务，如 Netlify、Vercel、GitHub Pages 等。