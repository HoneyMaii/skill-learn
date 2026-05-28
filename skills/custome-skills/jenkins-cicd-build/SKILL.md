---
name: jenkins-cicd-build
description: Use when a developer asks to trigger, inspect, or resolve an internal Jenkins CICD package build through the configured jenkins-cicd-local MCP server, including Jenkins打包, CICD编译打包, beginbuild, repo/branch/version builds, build status, or SVN RAR package address. Do not use for local code compilation, IDE build settings, MSBuild/npm build errors, or generic Jenkins work.
---

# Jenkins CICD Build

## Overview

这是内部 Jenkins CICD 打包的中文工作流 Skill。它只负责理解开发者意图、调用 `jenkins-cicd-local` MCP tools、展示计划、等待确认和表达结果；Jenkins/SVN 的读取、校验、触发和包解析都必须交给 MCP。

前置条件：本机已接入 `jenkins-cicd-local` MCP，并按 `mcp/README.md` 配好 repo/job 白名单和个人凭据。MCP 不可用时，提示用户检查 MCP 配置；不要自己实现 Jenkins HTTP、SVN 读取或凭据处理。

## When to Use

使用本 Skill：

- 用户明确要做内部 Jenkins/CICD 打包、构建、编译打包、`beginbuild`
- 用户给出或准备给出 `repo`、`branch`、`version` 来触发 Jenkins 打包
- 用户要列可打包 repo/job/branch，查询 Jenkins build 状态
- 用户要查已完成 build 的完整版本、SVN RAR 包名或包地址

不要使用本 Skill：

- 本地代码编译、IDE build configuration、MSBuild、`npm build`、语言工具链错误
- 泛 Jenkins 管理、任意 Jenkins URL、console 日志分析、job/Jenkinsfile/GitLab CI 修改
- 用户只说“上线”“发一下”“最新版”“当前分支”等模糊表达且未指向内部打包

`构建`、`编译` 不能单独触发本 Skill；必须有 Jenkins/CICD/打包/repo+branch+version/beginbuild/Harbor/RAR 包等内部打包语境。

## MCP Tool Map

| 意图 | Tool |
| --- | --- |
| 列 repo | `list_repos()` |
| 列 job | `list_jobs(repo)` |
| 查分支 | `list_branches(repo, job?, query?, limit?)` |
| 生成计划 | `plan_build(repo, job?, branch, version, arch?, push_harbor?)` |
| 触发构建 | `trigger_build(plan_id)` |
| 查 build | `get_build_info(repo, job?, build_id)` |
| 查包地址 | `resolve_built_package(repo, job?, build_id, arch?)` |

不要在日常流程中使用 `find_svn_rar_package`。

## Build Workflow

1. 提取 `repo`、`branch`、`version`；可选提取 `job`、`arch`、`push_harbor`。
2. 缺 `repo`、`branch` 或 `version` 时，只问缺失字段。不要推断 version 或当前分支。
3. Harbor 默认：除非用户明确说“不推 harbor / 只打包不推送”，否则调用 `plan_build` 时显式传 `push_harbor=true`。
4. 调用 `plan_build`。若返回 `MULTI_ARCH_UNSPECIFIED`，问：“这个 job 默认打 x86_64，也支持同时打 arm64。是否一起打 arm64？”
5. `plan_build` 成功后展示业务摘要和必要 Jenkins 参数。不要突出 `plan_id`。
6. 停下等待用户下一条消息确认。即使用户原请求说“直接打”，第一版也必须先计划、再确认。
7. 用户确认后才调用 `trigger_build(plan_id)`。
8. 只说“已触发 Jenkins 构建”，不要说“打包成功/构建成功”。

确认语可接受：`确认`、`执行`、`开始构建`、`yes`。如果用户修改任何构建参数，废弃旧 plan，重新 `plan_build` 并重新确认。

## Context Isolation

同一对话可连续构建多个项目或版本。每个新构建请求都必须生成新 plan 并使用本次 `trigger_build` 的结果更新最近构建上下文。

- 新请求不能复用上一轮 `build_id`、`version`、`branch`、`build_url`、`package_version` 或 `svn_url`。
- 只有用户明确说“刚才 / 上一次 / 这个 build”且上下文未被新构建覆盖时，才可复用最近 `build_id`。
- 如果多个 build 都可能被指代，用户只说“查包地址”时必须追问 `build_id` 或 Jenkins build URL。
- 本次 tracking 为 `timeout/untracked` 时，不能沿用上一次成功追踪到的 `build_id`。

## Package Resolution

触发后不自动等待构建完成。用户要求查完整版本、RAR 包或 SVN 包地址时，优先调用 `resolve_built_package(repo, job?, build_id, arch?)`。

- `unique`：返回 `package_version`、`package_name`、`svn_url`。
- `build_not_completed`：说明构建未完成，返回 Jenkins build URL。
- `BUILD_RESULT_NOT_SUCCESS`：说明 build 非 `SUCCESS`，不能报告有效包地址。
- `SVN_RAR_CONFIG_MISSING` / `SVN_RAR_BASE_URL_MISSING`：调用 `get_build_info` 兜底；构建成功时返回 Jenkins build URL。
- `SVN_READ_FAILED` / `SVN_READ_TIMEOUT`：说明 SVN_RAR 读取失败或凭据问题，返回 Jenkins build URL。
- `ambiguous` / `BUILD_ARCH_AMBIGUOUS`：展示候选或架构选项，不要猜。

## Response and Errors

优先使用简短中文，保留 MCP `code`、tool name、JSON field name 等机器契约英文。固定选项问题在宿主支持时用选项式交互；否则用短文本追问。

模板和错误映射见 [REFERENCE.md](REFERENCE.md)。输出完整 JSON 只在用户要求 debug 时使用。

## Safety Rules

永远不要：

- 接收、读取、打印或索要 Jenkins/SVN token、password、cookie、crumb、Authorization header
- 接受任意 Jenkins URL 或 SVN URL 作为工具参数
- 自己拼 Jenkins job URL、解析 Jenkins HTML/`consoleText`、解析 SVN 目录或包名
- 未展示 plan 且未收到用户下一条明确确认时调用 `trigger_build`
- 复用过期、已消费、参数已变化的 `plan_id`
- 新构建请求复用上一轮 `build_id`、`version`、`build_url`、`package_version` 或 `svn_url`
- 修改 Jenkins job、Jenkinsfile、GitLab CI、SVN 或发布状态
