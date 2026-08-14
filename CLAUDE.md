# CLAUDE.md

本仓库是 DeepSeek Harness Web GUI 的一个**皮肤插件**：`dsh-skin-diablo-dark`（暗黑·熔火，Diablo 暗黑哥特风）。

目标是把皮肤做成「一整个整体」——**字体、图标、结构、配色全换**，像社区里的二次元皮肤那样完整，而不是只改颜色。

## 当前状态（重要）

**v0.1 只完成了「配色」这一层。字体、图标、结构都没动——这是下一步。**

- `src/client/diablo-dark.module.css` — 双层 token 重映射（`--dsw-static-*` 底层色板 + `--dsw-alias-*` 语义层，亮/暗各一套）：沥青黑 + 血晶红 + 熔火金 + 骨白。**只改 alias 只变一点颜色（踩过的坑），两层缺一不可。**
- `src/client/index.ts` — `apply(ctx)` 只写 body 属性 `data-dsh-diablo-dark` + 内联火焰 favicon，`ctx.effect` 的 disposer 全收回。
- `shared/tsdown.client.ts` + `web-platform.ts` — vendor 自 dsh-web-ui 的官方独立构建预设。
- 已通过 `dsh plugin --profile web add link:<本仓库路径>` 软链挂进本机 DSH（未 push GitHub 前是纯本地）。

**下一步（OpenDesign 协作）**：用户去 OpenDesign 设计，输出一个 web 原型文件（HTML/CSS），
放进 `design/prototype/`，然后照着原型把皮肤补成完整整体：字体、图标、结构（标题栏 / 背景层 / 侧栏 / 控件形状等）。

## 皮肤技术契约（硬约束，详见 docs/SKIN-DEV.md）

1. **纯呈现层**：不注入服务、不发 cordis 事件、不触碰模型请求。
2. **`apply(ctx)` 只写自己会收回的东西**，dispose 全还原（body 属性、注入的 DOM、favicon、title）。
3. 所有样式作用域在 `body[data-dsh-diablo-dark]` 下，暗色变体加 `[data-ds-dark-theme]`；不污染其它皮肤与官方 UI。
4. **双层重映射**：`--dsw-static-*` + `--dsw-alias-*` 都要覆盖。
5. **不用 `backdrop-filter`**（会让 fixed 浮层被困进祖先盒）；磨砂用半透明填充模拟。
6. **不携带静态资源**（内联 SVG / data URI）；**不用任何 Blizzard / Diablo 商标资产**（背景、logo 都要程序化或自绘）。
7. 换字体走 `--dsw-font-family` / `--ds-font-family-code`；换图标 / 加结构要注入 DOM chrome（参考 qq98 的标题栏/状态栏、dragon-heir 的背景层）。

## 构建 / 测试 / 安装

```sh
npm install           # 报 EPERM 就先 sudo chown -R $(whoami) ~/.npm
npm run build         # tsdown → lib/index.js（node 半区）+ lib/client.js（浏览器 bundle，CSS 内联）
npm test              # vitest：apply/dispose 契约测试

# 安装到本机 DSH（软链，改完 npm run build 后刷新即生效）
dsh plugin --profile web add link:/Users/dengxuhui/Work/Personal/Github/dsh-skin-diablo-dark
# 移除
dsh plugin --profile web remove @dengxuhui/dsh-client-ui-skin-diablo-dark
```

试穿：`dsh web` 后切 Appearance → Dark/Light；或 dsh-web-ui 的 `gallery/preview.html?skin=<name>&theme=dark`。

## 参考样例（在 github.com/zhu1090093659/dsh-web-ui 里）

- `packages/skins/qq98/` — 注入标题栏/状态栏 chrome + favicon 的成熟样例
- `packages/skins/dragon-heir/` — 背景层 + 双层 token 重映射样例
- `scripts/dsh-skin-new` — 官方脚手架（生成 packages/skins/<name>/）

## Git 约定

- 直接提交到 `main`，不建分支（单人仓库）。
- commit 用中文，说明**为什么**改。
- push 单独执行（提交 ≠ 推送）。
