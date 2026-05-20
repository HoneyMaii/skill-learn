# Codex AGENTS.md 与 Rules 教程来源说明

## 日期

- 编写日期：2026-05-19
- 用户时区：Asia/Shanghai

## 主要来源

- OpenAI Codex AGENTS.md 官方指南：`https://developers.openai.com/codex/guides/agents-md`
- OpenAI Codex Rules 官方页面：`https://developers.openai.com/codex/rules`
- AGENTS.md 社区说明站点：`https://agents.md/`
- 当前工作区用户提供的 AGENTS.md 指令：`C:\Users\220700398\Documents\EdwardProjects\skill-learn`

## 已确认事实

- `AGENTS.md` 是给 coding agent 阅读的项目说明文件，可用于描述构建命令、测试命令、代码风格、安全边界、PR 说明和项目约定。
- Codex 会在任务开始前读取仓库根目录及相关子目录中的 `AGENTS.md`，更深层目录中的文件对该目录范围内的文件生效。
- Codex Rules 是 Codex 的命令审批规则，用于控制哪些命令可以在沙箱外自动运行，哪些命令必须被阻止或要求确认。
- `AGENTS.md` 和 Rules 不是同一种机制：前者表达项目协作语义，后者表达执行权限策略。

## 假设

- 本教程面向中文读者。
- 本教程输出为可滚动 HTML guide，不是 PPT、slides 或演示文稿。
- 页面不依赖构建工具和第三方前端框架，直接打开 `guide.html` 即可阅读。

## Caveat

- Codex 产品行为可能随版本更新。涉及当前规则、审批 UI、托管环境行为时，应以 OpenAI 官方文档为准。
- 不同运行环境的沙箱、审批和网络权限可能不同。团队模板应结合本地安全策略调整。

