# Building UniApp Apps

面向 UniApp Vue 3、Unibest、Wot UI v2（`@wot-ui/ui`）和 UnoCSS 的跨端开发 Skill，主要用于微信小程序与 H5 项目的创建、开发、重构、审查和发布验证。

Skill 名称：`building-uniapp-apps`

## 设计原则

- 优先完成最小业务闭环，避免提前建设大量公共层。
- 页面保留简单状态与事件；Composable 仅用于复杂或真实复用的响应式流程。
- Adapter 隔离真实的平台、供应商和设备能力差异。
- Store 只保存必要的跨页面持久状态。
- API 按业务域集中管理，Mock 在请求层自动匹配。
- 页面私有组件就近维护，出现稳定复用后再提升为公共组件。
- 修改功能时同步检查调用方、配置、类型、测试、Mock、注释与说明。
- 默认直接替换旧实现，不保留未明确要求的兼容代码。
- 修改期间只校验当前功能与关联面；项目发布前再执行完整审计与清理。
- 长时间命令、开发服务器和浏览器验证必须设置超时与停止条件，禁止无限等待。

## 主要能力

- 新建或接管 UniApp、Unibest 项目
- H5 与微信小程序兼容开发
- 自定义 Tabbar、Navbar、安全区与页面壳
- 登录鉴权、启动流程、权限、支付、上传、分享等平台能力
- Wot UI v2、UnoCSS 与组件边界规范
- API、Mock、环境配置和精简 Store 设计
- 最小化修改、关联面同步检查、无效代码清理
- 双端构建、真机检查和发布前验证

## 目录结构

```text
building-uniapp-apps/
├── SKILL.md       # Agent 触发后加载的核心规则
├── references/    # 根据任务按需加载的详细规范
├── assets/        # 可按需采用的模板
├── scripts/       # 项目结构与清理审计
└── agents/        # Codex 展示元数据
```

`README.md` 面向使用者，不参与 Skill 的引用路由，正常开发任务不会自动加载它。

## 安装

将完整的 `building-uniapp-apps` 文件夹安装到工具支持的 Skills 目录。不要只复制 `SKILL.md`，否则模板、引用资料和审计脚本不可用。

以下命令中的 `/path/to/building-uniapp-apps` 请替换为实际路径。

### Codex

用户级安装：

```bash
mkdir -p ~/.codex/skills
ln -s /path/to/building-uniapp-apps ~/.codex/skills/building-uniapp-apps
```

重启 Codex 或开始新会话后使用：

```text
使用 $building-uniapp-apps 创建一个兼容微信小程序和 H5 的 Unibest 项目。
```

### Claude Code

项目级安装：

```bash
mkdir -p .claude/skills
ln -s /path/to/building-uniapp-apps .claude/skills/building-uniapp-apps
```

用户级安装：

```bash
mkdir -p ~/.claude/skills
ln -s /path/to/building-uniapp-apps ~/.claude/skills/building-uniapp-apps
```

在 Claude Code 中直接提及技能名称和任务：

```text
Use the building-uniapp-apps skill to review this UniApp project and fix the affected cross-platform issues.
```

Claude.ai 使用自定义 Skill 时，可将整个文件夹打包为 ZIP 后上传。

### OpenClaw

安装本地 Skill 到当前工作区：

```bash
openclaw skills install /path/to/building-uniapp-apps --as building-uniapp-apps
```

也可放入工作区 `skills/`、`~/.agents/skills/` 或共享目录 `~/.openclaw/skills/`。开始新会话后直接描述 UniApp 任务，或使用技能对应的 Slash Command。

### Hermes Agent

Hermes 的主要 Skill 目录为 `~/.hermes/skills/`：

```bash
mkdir -p ~/.hermes/skills
ln -s /path/to/building-uniapp-apps ~/.hermes/skills/building-uniapp-apps
```

也可在 `~/.hermes/config.yaml` 中配置共享目录：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills
```

安装后可以使用：

```text
/building-uniapp-apps 审查当前 UniApp 项目的登录启动流程和双端兼容问题
```

### 其他 Agent Skills 工具

本 Skill 遵循以 `SKILL.md` 为核心的 Agent Skills 目录格式。对于其他兼容工具，将完整目录放入其 Skills 根目录，然后通过技能名称或自然语言任务触发。

需要多个工具共享时，可统一放在：

```bash
~/.agents/skills/building-uniapp-apps
```

再让各工具扫描该目录或创建符号链接。使用共享可写目录前，应确认工具不会自动修改 Skill 内容。

## 使用示例

### 创建项目

```text
使用 building-uniapp-apps 创建一个 Unibest 项目，支持微信小程序和 H5。
页面使用 JavaScript，共享契约和 Adapter 可以使用 TypeScript。
```

### 开发功能

```text
使用 building-uniapp-apps 增加订单详情页面。
简单状态保留在页面，页面过长时拆分私有组件，不要过度抽象。
```

### 跨端能力

```text
使用 building-uniapp-apps 实现微信小程序和 H5 的登录入口。
平台差异放入 Adapter，并验证鉴权启动流程没有异步竞态。
```

### 审查与优化

```text
使用 building-uniapp-apps 审查当前项目。
重点检查 Store、API、环境配置、跨端兼容和过度抽象，只做必要修改。
```

### 发布前检查

```text
使用 building-uniapp-apps 执行项目发布前审查、双端验证和无效代码清理。
```

## 手动运行审计

结构审计：

```bash
node /path/to/building-uniapp-apps/scripts/audit-uniapp-project.mjs /path/to/uniapp-project
```

项目清理候选审计：

```bash
node /path/to/building-uniapp-apps/scripts/audit-project-cleanup.mjs /path/to/uniapp-project
```

清理审计只报告候选项，不会自动删除文件。应结合路由、自动导入、条件编译、双端构建和运行验证确认后再删除。

## 验证 Skill

```bash
cd /path/to/building-uniapp-apps
node scripts/test-audit-uniapp-project.mjs
node scripts/test-audit-project-cleanup.mjs
```

## 兼容性说明

- 不同工具和版本的 Skills 路径、刷新方式和 Slash Command 可能变化。
- 安装后若未发现 Skill，请重启工具或开始新会话，并检查工具当前官方文档。
- 执行脚本前应审查 Skill 来源和内容；第三方 Skills 可能获得文件系统和命令执行权限。

## 相关规范

- [Agent Skills](https://agentskills.io/)
- [Claude Agent Skills](https://github.com/anthropics/skills)
- [OpenClaw Skills](https://docs.openclaw.ai/tools/skills)
- [Hermes Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
