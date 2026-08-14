# 皮肤开发技术契约（dsh-skin-diablo-dark）

本文件是给「把 OpenDesign 原型转成完整皮肤」用的技术参考。来源：dsh-web-ui 的
`.dsh/skills/skin-developer/SKILL.md` + 对 qq98 / dragon-heir / blue-fantasy 三个成熟皮肤的实测。

## 一个皮肤 = 一个自包含插件包（官方四件套）

1. `package.json` 声明 `dsh.bundle.patch` → `cordis.patch.yml`（安装时自动插入 `ui-skin-*` 行）；
   另有 `dsh.client: { inject: [], platform: 'web' }`、`prepare` 脚本 = `tsdown`。
2. `cordis.patch.yml` — bundle patch 层，插入自己的 loader 行：
   ```yaml
   - insert:
       - id: ui-skin-diablo-dark
         name: '@dengxuhui/dsh-client-ui-skin-diablo-dark'
   ```
3. `prepare`/`build` = `tsdown`（`shared/tsdown.client.ts` 是独立构建预设，产出
   `lib/index.js` node 半区 + `lib/client.js` 浏览器 bundle，CSS Modules 由 lightningcss 内联）。
4. devDependencies 只用真实发布版本（tsdown / lightningcss / vitest / jsdom / vite-tsconfig-paths / @deepseek-ai/cordis）；
   `@deepseek-ai/dsh-*` 未发布到 npm，构建时 external、运行时由宿主 module table 提供。

## apply/dispose 契约

```ts
import type { Context } from '@deepseek-ai/cordis'
import './diablo-dark.module.css'   // 副作用导入：bundle 自动注入 <style data-plugin>

export function apply(ctx: Context): void {
  const body = document.body
  body.dataset.dshDiabloDark = ''          // 作用域钩子 → data-dsh-diablo-dark

  // 注入 favicon / 背景层 / chrome DOM（内联 SVG，不携带静态文件）
  // ...

  ctx.effect(() => () => {
    delete body.dataset.dshDiabloDark
    // 逐个移除自己注入的节点 / favicon / 还原 title（仅当仍是皮肤自己的标题）
  }, 'ui-skin-diablo-dark: ...')
}
```

- 只写自己会收回的东西；dispose 必须全还原。
- CSS Modules 类名经 `css[name]` 取值；样式文本由 loader 管理，卸载自动移除。

## CSS 作用域与双层重映射

所有规则挂在自己的 body 属性下：

```css
body[data-dsh-diablo-dark] { ... }                     /* 亮面 */
body[data-dsh-diablo-dark][data-ds-dark-theme] { ... } /* 暗面 */
```

**换肤核心是覆盖 `--dsw-*` CSS 变量，且两层都要**：

- `--dsw-static-*`（底层色板，73 个）：amber / blue / deepseek / green / neutral /
  neutral-bluish / red 六个家族，亮/暗各一套。外壳很多表面**直接消费 static**，只改 alias 会「只变一点颜色」。
- `--dsw-alias-*`（语义层，约 90 个）：bg / border / brand / button / interactive /
  label / markdown / scrollbar / state / specific 等，是组件实际读取的那层。
- 另有一个 `--dsh-accent` 变量可设。

用 `body[data-dsh-<name>]`（specificity 0,1,1）覆盖官方 `body`（0,0,1）、
`body[data-dsh-<name>][data-ds-dark-theme]`（0,2,1）覆盖官方 `body[data-ds-dark-theme]`（0,1,1），
两层都稳赢。

## 字体 / 图标 / 结构（「整体感」的来源）

- **字体**：`--dsw-font-family`（正文）、`--ds-font-family-code`（代码）。想更有哥特感可换衬线/书法栈，或引入自托管 webfont（@font-face + data URI 或同仓字体文件——但字体文件要注意授权）。
- **图标**：外壳图标是内联 SVG。要换图标 = 注入自己的 chrome 元素（如 qq98 的标题栏按钮），或在 CSS 里用 `mask`/`background-image` 覆盖；不要直接改官方 SVG 源。
- **结构**：注入固定层（背景层 `z-index:-1`、标题栏、状态栏、侧栏装饰），参考 qq98（标题栏+状态栏+企鹅）与 dragon-heir（全屏背景层 + favicon + 亮暗实时切换的 MutationObserver）。

## 禁忌清单

- 不用 `backdrop-filter`：祖先一旦有它，fixed 后代会被困进祖先盒（设置面板会卡在侧栏里）。磨砂 = 半透明填充。
- 不携带静态资源文件（内联 SVG / data URI）。
- 不注入服务、不发事件、不碰模型请求（纯呈现层）。
- 作用域不外漏：不得用裸类名/全局选择器污染其它皮肤。
- 不用 Blizzard / Diablo 商标资产；背景图须自绘或可商用授权。
