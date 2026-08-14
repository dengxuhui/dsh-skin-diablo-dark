# OpenDesign 交接位

用户会在 OpenDesign 里设计暗黑皮肤，导出一个 web 原型文件放到本目录，然后回到仓库开新对话，由 Agent 照原型把 `src/client/diablo-dark.module.css` + `src/client/index.ts` 补成「完整整体」的皮肤。

## 交接协议

1. 原型文件放进 `design/prototype/`（HTML/CSS/图片，任意结构，但**图片素材须自绘或可商用授权**，不用 Blizzard/Diablo 商标资产）。
2. 原型里明确三样东西：
   - **配色**：映射到 `--dsw-static-*` + `--dsw-alias-*`（见 docs/SKIN-DEV.md）
   - **字体**：正文 + 代码字体栈（或 webfont，注明授权）
   - **图标 / 结构**：标题栏、背景层、侧栏、控件形状等 chrome，落到 `apply()` 注入的 DOM 或 CSS 覆盖
3. Agent 的转换产出 = 改 `src/client/diablo-dark.module.css`（作用域 `body[data-dsh-diablo-dark]`）+ `src/client/index.ts`（apply/dispose 契约），构建 `npm run build`、契约测试 `npm test`、软链挂载试穿。

## 现状快照（v0.1）

- 已有：双层 token 配色（沥青黑 + 血晶红 + 熔火金 + 骨白，亮/暗两套）、火焰 favicon。
- 缺：字体、图标、结构——也就是「整体感」的部分。
