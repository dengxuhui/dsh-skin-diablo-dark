# dsh-skin-diablo-dark · 暗黑 · 熔火

DeepSeek Harness Web GUI 的暗黑哥特风皮肤插件。沥青黑底、血晶红与熔火金点缀、骨白正文，半透明磨砂面板透出程序化余烬背景。

- 纯呈现层：不注入服务、不发事件、不触碰模型请求，只操作 DOM 与 CSS token。
- 素材全部内联、**不携带任何静态资源文件**：favicon 徽记（48px PNG）、石纹（256px JPEG）、圣所插画（640×480 JPEG）为 AI 生成且可商用授权的位图，已降采样压缩后内联 data URI；裂纹符文为自绘内联 SVG；余烬 / 暗角为程序化 CSS 渐变。不含 Blizzard / Diablo 商标资产，不含任何第三方版权素材。
- 亮/暗两套配色同源：亮面是「日晒骨白 parchment」变体，暗面是「沥青黑 + 余烬熔火」，跟随系统 `light/dark/system` 自动切换。

## 安装

```sh
# 从本地目录
dsh plugin --profile web add /path/to/dsh-skin-diablo-dark

# 或从 git 仓库（安装时会在 clone 内执行 prepare 自动构建 lib/，需要能联网拉取 npm 依赖）
dsh plugin --profile web add github:<owner>/dsh-skin-diablo-dark
```

> 若 pnpm 拦截了构建脚本（pnpm 10 的安全门禁），会打印提示，把提示里给出的包名加到 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 下，再重跑一次即可。

装完重启 `dsh web` 生效。皮肤会在 Web 壳里设置 `body[data-dsh-diablo-dark]`，样式全部挂在该属性下，卸载即还原。

## 开发

```sh
npm install            # 安装依赖（会触发 prepare 构建）
npm run build          # tsdown：node half lib/index.js + client bundle lib/client.js
npm test               # vitest：apply/dispose 契约测试
```

产物说明：

- `lib/index.js` — node 半区（宿主加载入口，无宿主行为）
- `lib/client.js` — 浏览器 bundle，调用 `window.__ModuleLoader__.load({ id, factory })` 导出 `apply`
- CSS Modules 由 bundle 内的 lightningcss 处理，类名 hash 化、样式文本自动注入 `<style data-plugin>`，卸载时由 loader 移除

## 结构

```
src/
  index.ts                   # 宿主加载入口（no-op）
  css-modules.d.ts           # *.module.css 类型声明
  client/
    index.ts                 # apply(ctx)：body 属性 + favicon + dispose 收回
    diablo-dark.module.css   # 作用域样式 + --dsw-* alias token 重映射
shared/
  tsdown.client.ts           # 官方独立构建预设（vendor 自 dsh-web-ui）
  web-platform.ts            # 平台模块表
skin.json                    # 皮肤中心 / gallery 元数据契约
cordis.patch.yml             # bundle patch：插入 ui-skin-diablo-dark 行
tests/apply.spec.ts          # apply/dispose 契约测试
```

## 皮肤契约要点

- 所有样式作用域在 `body[data-dsh-diablo-dark]` 下，暗色变体加 `[data-ds-dark-theme]`，不外漏裸类名/全局选择器。
- `apply(ctx)` 只写自己会收回的东西；`ctx.effect` 的 disposer 里全部还原。
- 换肤机制 = 覆盖 `--dsw-*` 语义 alias token（`--dsw-alias-bg-*` / `--dsw-alias-label-*` / `--dsw-alias-brand-primary` …），不动底层 `--dsw-static-*` 色板。
- 刻意不用 `backdrop-filter`：祖先元素一旦有 backdrop-filter 就会成为 fixed 后代的包含块，把浮层困在侧栏里。

## 试穿与截图

本仓库暂未带 gallery 模拟器。可挂进 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) 的皮肤中心试穿，或直接 `dsh web` 里切主题看效果。皮肤中心预览图已就位：`preview/dark.png`（暗黑风皮肤只出 dark 预览，不做 light）。

## License

[MIT](./LICENSE)。本皮肤为原创程序化配色，不含 Blizzard / Diablo 商标资产；如自行加入背景图，请确保素材可商用或自绘。
