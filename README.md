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

点击链接复制导航数据库模板：[导航站模板](你的模板链接)
点击链接复制配置数据库模板：[配置模板](你的配置模板链接)

配置数据库包含以下字段：
- `type`（选择类型）：配置类型
  - `order`：分类排序
  - `url_order`：链接排序
- `title`（标题类型）：
  - 当 type 为 order 时填写分类名称
  - 当 type 为 url_order 时填写 "lasted"
- `value`（数字/复选框类型）：
  - 当 type 为 order 时填写排序权重（数字越小越靠前）
  - 当 type 为 url_order 时，true 表示按时间正序，false 表示按时间倒序
- `description`（富文本类型）：配置说明

### 2. 配置环境变量

需要配置两个数据库的 ID：
- `NOTION_DATABASE_ID`：导航数据库 ID
- `NOTION_CONFIG_DATABASE_ID`：配置数据库 ID

### 3. 配置 Notion API

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

### 4. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fnotion-nav)

1. 点击上方按钮，使用 GitHub 账号登录 Vercel
2. 导入项目后，配置环境变量：
   - `NOTION_API_KEY`：第 2 步获取的 Integration Token
   - `NOTION_DATABASE_ID`：第 2 步获取的数据库 ID
3. 点击 `Deploy` 开始部署

### 5. 本地开发（可选）

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
6. 通过设置 order 字段的数值来自定义网站排序（数字越小越靠前）

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
