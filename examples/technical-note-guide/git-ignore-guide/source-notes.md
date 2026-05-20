# Git Ignore 机制指南来源说明

## 日期

- 创建日期：2026-05-20
- 最终指南生成日期：2026-05-20
- 用户时区：Asia/Shanghai

## 主要来源

- 用户在当前会话中确认的内容范围、示例和讲解重点。
- Git 官方 `gitignore` 文档：`https://git-scm.com/docs/gitignore`
- Git 官方 `git-check-ignore` 文档：`https://git-scm.com/docs/git-check-ignore`
- Git 官方 `git-rm` 文档：`https://git-scm.com/docs/git-rm`
- Git 官方 `git-config` 文档：`https://git-scm.com/docs/git-config`

## 已核对事实

- Git ignore 机制包括 `.gitignore`、`.git/info/exclude` 和全局 ignore，例如 `core.excludesFile`。
- Git 官方 `gitignore` 文档说明，ignore 文件用于指定 Git 应忽略的 intentionally untracked files；已经 tracked 的文件不受 ignore 规则影响。
- `.gitignore` 适合提交到仓库，分发给其他 clone，用于团队共同希望忽略的文件。
- `.git/info/exclude` 适合当前仓库本地、但不需要共享给其他相关仓库的规则。
- `core.excludesFile` 指向用户级 ignore 文件，适合同一用户跨仓库通用的忽略规则；默认位置和 XDG 配置有关。
- `git rm --cached <path>` 会从索引中移除路径，但保留工作区文件。
- `git rm <path>` 会从索引和工作区移除文件。
- `git check-ignore -v <path>` 可以输出命中的 ignore 来源、行号、规则和路径。

## 用户确认事实

- 如果 `foo.log` 已经被 Git 跟踪，把 `foo.log` 写入 `.gitignore` 或 `.git/info/exclude` 后，修改 `foo.log` 仍会让 `git status` 显示它被修改。
- 如果希望已 tracked 文件以后不再被 Git 跟踪，需要执行 `git rm --cached foo.log`，再配合 ignore 规则。
- 需要向初学者解释 `--cached` 的含义，明确执行者本地物理文件会保留。
- 需要说明其他成员 pull 后，仓库层面的删除可能同步到他们工作区，导致 tracked 版本文件从他们本地消失。
- 需要区分“停止跟踪但本地保留”和“仓库与本地都删除”两种目标。
- 需要加入 `debug.log` 完整排查案例。
- 最佳实践章节采用“工程清单 + 决策树”结构。

## Caveat

- Git 文档和命令行为总体稳定，但不同 Git 版本的文档页面可能有细节差异。读者可以用 `git --version` 查看本机版本。
- 本指南不提供敏感信息泄露后的完整历史清理方案；如果密钥已经提交，应按团队安全流程轮换密钥并处理历史。
- 本指南输出为可滚动 HTML guide，不是 PPT 或 slides。
