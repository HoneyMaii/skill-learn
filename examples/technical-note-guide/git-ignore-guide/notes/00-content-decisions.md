# 内容决策记录

## 已确认输出形态

采用“多轮确认笔记 + 最终静态 HTML 指南”的双层结构：

- `notes/` 保存会话确认稿、章节草稿和内容决策。
- `guide.html` 在内容确认完成后生成，作为最终可阅读教程。

## 已确认主题范围

本指南覆盖所有常用 Git ignore 机制：

- `.gitignore`
- `.git/info/exclude`
- 全局 ignore，例如 `core.excludesfile`

共同主线是：

Git ignore 只影响未跟踪文件，不影响已经 tracked 的文件。

## 已确认关键示例

示例围绕 `foo.log` 展开：

1. `foo.log` 已经被 Git 跟踪。
2. 把 `foo.log` 写进 `.gitignore` 或 `.git/info/exclude`。
3. 修改 `foo.log` 后，`git status` 仍然会显示它被修改。
4. 如果希望它以后不再被 Git 跟踪，需要执行 `git rm --cached foo.log`。
5. 再配合 ignore 规则，Git 才会把它当成本地未跟踪且被忽略的文件。

## 已确认讲解方向

采用“原理先行 + 场景对比 + 可执行清单”的结构。

章节顺序：

1. 核心心智模型。
2. 三种 ignore 机制对比。
3. tracked 文件处理。
4. ignore 排查命令。
5. 最佳工程实践。

## 后续确认轮次

后续按章节逐轮确认：

1. 已确认：核心心智模型和 `foo.log` 示例足够清楚。
2. 已确认：三类 ignore 机制的区别和适用场景，并补充短小 pattern 语法速查。
3. 已确认：已 tracked 文件的处理流程，需要解释 `--cached`，提供已提交文件移除跟踪实践案例，说明执行者本地物理文件和其他成员 pull 后的物理文件状态，区分“停止跟踪但本地保留”和“仓库与本地都删除”，并加入目录批量停止跟踪的谨慎示例。
4. 已确认：排查命令和常见误区，需要加入 `debug.log` 完整排查案例，从 `git ls-files`、`git check-ignore -v` 到 `git rm --cached` 或 `git rm` 走完一遍。
5. 已确认：最佳工程实践清单，采用“工程清单 + 决策树”结构。
6. 待执行：生成最终 `guide.html` 并验证。
