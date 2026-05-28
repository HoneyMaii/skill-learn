# Jenkins CICD Build Reference

本文件补充 `SKILL.md` 中不适合放太长的模板、错误映射和验收场景。MCP README 仍是安装和配置的 source of truth。

## Plan Confirmation Template

```text
将触发 Jenkins 构建：

repo: fusion
job: beginbuild
branch: origin/develop_qfc
version: 3.4.04
arch: x86_64
push_harbor: true

确认后我会触发 Jenkins 构建。回复“确认”继续。
```

可选参数核对：

```text
Jenkins 参数：number=3.4.04, branch=origin/develop_qfc, x86_64=true, arm64=false
```

如果支持选项控件：

```text
确认触发 Jenkins 构建？
- 确认触发
- 取消
```

## Trigger Result Template

```text
已触发 Jenkins 构建。

repo: fusion
job: beginbuild
branch: origin/develop_qfc
version: 3.4.04
arch: x86_64
push_harbor: true
build_id: 348
build: http://jenkins/.../348/
queue: http://jenkins/.../queue/item/123/
tracking: build_found
```

`timeout`：

```text
Jenkins 已接受触发请求，但 120 秒内还没拿到 build URL。
queue: ...
```

`untracked`：

```text
Jenkins 已接受触发请求，但这次无法可靠追踪到 build URL。
job: ...
reason: ...
```

## Package Result Templates

`resolution_status: unique`：

```text
已找到研发 SVN RAR 包。

repo: fusion
job: beginbuild
build_id: 348
package_version: v3.3.04.a8e1f8a.sichuan2-arm64
package_name: commandcenter.vcs.incident.v3.3.04.a8e1f8a.sichuan2-arm64.rar
svn_url: http://svn.../commandcenter.vcs.incident.v3.3.04.a8e1f8a.sichuan2-arm64.rar
```

SVN_RAR 未配置但 build 成功：

```text
构建已成功，但该 repo 未配置 SVN_RAR 包解析，无法返回研发包地址。（SVN_RAR_CONFIG_MISSING）

Jenkins build:
http://jenkins/.../348/
```

## Fixed Choice Prompts

多架构：

```text
这个 job 默认打 x86_64，也支持同时打 arm64。是否一起打 arm64？
- 是，同时构建 x86_64 + arm64
- 否，只构建 x86_64
- 只构建 arm64
```

回答映射：

| 用户回答 | `arch` |
| --- | --- |
| `是` / `一起` / `双架构` / `都打` | `["x86_64", "arm64"]` |
| `否` / `不用` / `只 x86` | `["x86_64"]` |
| `只 arm` / `arm64` | `["arm64"]` |

repo/job 歧义：

```text
项目名匹配多个配置。（REPO_AMBIGUOUS）
- fusion
- fusion-net7

选哪个？
```

## Error Mapping

| MCP code | 用户提示 |
| --- | --- |
| `CONFIG_NOT_FOUND`, `CONFIG_INVALID` | 本机 CICD 配置不可用。（CODE）请按 MCP README 检查配置。 |
| `CREDENTIALS_MISSING` | 本机 Jenkins/SVN 凭据未配置。（CODE）请按 MCP README 检查凭据。 |
| `REPO_NOT_FOUND` | 没有找到这个 repo 配置。（REPO_NOT_FOUND） |
| `REPO_AMBIGUOUS` | 项目名匹配多个配置。（REPO_AMBIGUOUS）展示 candidates。 |
| `JOB_REQUIRED`, `JOB_AMBIGUOUS` | 该 repo 需要指定 job。（CODE）展示 candidates。 |
| `BRANCH_REQUIRED` | 需要提供分支名。（BRANCH_REQUIRED） |
| `BRANCH_NOT_FOUND` | 没有找到该分支。（BRANCH_NOT_FOUND）展示 suggestions。 |
| `VERSION_REQUIRED`, `VERSION_INVALID` | 需要提供有效版本号。（CODE） |
| `MULTI_ARCH_UNSPECIFIED` | 追问是否同时构建 arm64。 |
| `PARAM_MISMATCH`, `PARAMETER_MISMATCH`, `BUILD_FORM_NOT_FOUND` | Jenkins 页面参数和本地 YAML 配置不一致。（CODE）请维护配置后重试。 |
| `JENKINS_AUTH_FAILED` | Jenkins 凭据、权限或 crumb 可能有问题。（JENKINS_AUTH_FAILED） |
| `BUILD_TRIGGER_FAILED`, `BUILD_TRIGGER_TIMEOUT` | Jenkins 触发失败，不能确认构建已触发。（CODE） |
| `PLAN_EXPIRED`, `PLAN_CONSUMED`, `PLAN_NOT_FOUND` | 构建计划已失效，需要重新生成计划并确认。（CODE） |
| `BUILD_NOT_COMPLETED` | 构建还没完成，稍后再查完整包版本。（BUILD_NOT_COMPLETED） |
| `BUILD_RESULT_NOT_SUCCESS` | Jenkins build 不是 SUCCESS，不能解析有效研发包。（BUILD_RESULT_NOT_SUCCESS） |
| `SVN_RAR_CONFIG_MISSING`, `SVN_RAR_BASE_URL_MISSING` | SVN_RAR 未配置，返回 Jenkins build URL 兜底。 |
| `SVN_READ_FAILED`, `SVN_READ_TIMEOUT` | SVN_RAR 读取失败，返回 Jenkins build URL 兜底。 |
| `PACKAGE_NOT_FOUND` | 构建成功，但研发 SVN RAR 目录没有找到匹配包。（PACKAGE_NOT_FOUND） |
| `PACKAGE_AMBIGUOUS`, `BUILD_ARCH_AMBIGUOUS` | 找到多个候选或架构不明确，展示候选或架构选项让用户选择。 |

## Acceptance Scenarios

后续安装前至少用这些场景压力检查：

1. 用户说“给 fusion develop_qfc 分支打包，版本 3.4.04”。
   - 应调用 `plan_build`，显式 `push_harbor=true`，展示计划，等待下一条确认。
2. 用户说“这个 .NET 项目怎么编译？”。
   - 不应触发本 Skill，不应调用 Jenkins CICD MCP tools。
3. 用户说“直接给 fusion develop_qfc 打包，版本 3.4.04，确认打”。
   - 仍应先展示 plan，等待下一条确认。
4. 用户连续触发两个 build，随后说“查包地址”。
   - 若指代不明确，应追问 `build_id`，不能返回上一轮 build 的 SVN 地址。
5. `trigger_build` 本次 tracking 为 `timeout/untracked`。
   - 不能沿用上次 build_id；只能报告本次 tracking 状态。
6. `resolve_built_package` 返回 `SVN_RAR_CONFIG_MISSING`。
   - 应调用或建议 `get_build_info` 兜底，并返回 Jenkins build URL。

