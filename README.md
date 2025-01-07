# Notion 导航站

基于 Notion 数据库的现代化导航网站，使用 Next.js 14 + Tailwind CSS 构建。轻松管理和分享你的网站收藏。

## ✨ 特性

- 📝 使用 Notion 数据库管理网站链接
- 🎯 实时搜索功能
- 📱 响应式设计，支持移动端
- 🌓 自适应深色/浅色模式
- 🎨 支持 Notion 数据库封面和图标
- ⚡️ 基于 Next.js 14，性能优秀
- 🔄 自动同步 Notion 数据更新

## 🚀 快速开始

### 1. 复制 Notion 模板

点击链接复制 Notion 模板：[导航站模板](https://desert-bangle-ff2.notion.site/1693b0c7bd71801ab9fcffc61e97872b?v=1693b0c7bd71810d9870000c99238fd4)

模板包含以下字段：
- `title`：网站名称
- `desp`：网站描述
- `cat`：网站分类
- `icon`：网站图标
- `link`：网站链接

### 2. 配置 Notion API

1. 访问 [Notion Developers](https://developers.notion.com/docs) 创建一个集成
2. 点击 `New integration` 创建新的集成
3. 填写名称（如：My Nav Integration）并保存
4. 复制生成的 `Internal Integration Token`（这就是你的 `NOTION_API_KEY`）
5. 回到你的 Notion 数据库页面
6. 点击右上角的 `Share` 按钮，在 `Connections` 中添加你刚创建的集成
7. 从数据库 URL 复制数据库 ID：
   ```
   https://notion.so/myworkspace/{DATABASE_ID}?v=...
                                 ↑
                        复制这一段作为 NOTION_DATABASE_ID
   ```

### 3. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fnotion-nav)

1. 点击上方按钮，使用 GitHub 账号登录 Vercel
2. 导入项目后，配置环境变量：
   - `NOTION_API_KEY`：第 2 步获取的 Integration Token
   - `NOTION_DATABASE_ID`：第 2 步获取的数据库 ID
3. 点击 `Deploy` 开始部署

### 4. 本地开发（可选）

```bash
# 克隆项目
git clone https://github.com/TWO-ICE/notionnav
cd notion-nav

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的环境变量

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看效果

## 📝 使用说明

1. 在 Notion 数据库中添加或修改内容，网站会自动同步更新
2. 可以通过搜索框搜索网站标题、描述或分类
3. 点击左侧分类可快速跳转到对应区域
4. 支持自定义数据库封面图和图标
5. 移动端可通过左上角按钮打开分类菜单

## 🛠️ 技术栈

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Notion API](https://developers.notion.com/)

## 📄 License

MIT License © 2024

## 🙏 致谢

- [Notion API](https://developers.notion.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com)

---

如果这个项目对你有帮助，欢迎 Star ⭐️
