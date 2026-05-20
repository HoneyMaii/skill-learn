# 01 核心心智模型

## 一句话版本

Git ignore 的作用不是“让 Git 忘掉某个文件”，而是“让 Git 不再主动发现某些未跟踪文件”。

更精确地说：

Git ignore 只影响 untracked files，不影响 tracked files。

## 需要讲清楚的三个状态

为了避免误解，指南需要先区分三种状态：

- 未跟踪文件：Git 还没有纳入版本控制的文件。
- 已跟踪文件：已经被 `git add` 并提交过，或已经在索引中的文件。
- 被忽略文件：符合 ignore 规则，并且当前没有被 Git 跟踪的文件。

一个文件只有在“未跟踪”的前提下，ignore 规则才会让它从普通 `git status` 视野里消失。

## `foo.log` 示例

假设 `foo.log` 已经被 Git 跟踪：

```bash
git add foo.log
git commit -m "track foo log"
```

此后你把它写进 `.gitignore`：

```gitignore
foo.log
```

或者写进 `.git/info/exclude`：

```gitignore
foo.log
```

再修改它：

```bash
echo "new line" >> foo.log
git status
```

`git status` 仍然会显示 `foo.log` 被修改。原因是：它已经是 tracked file，Git 必须继续追踪它的变化。

## 正确结论

如果一个文件已经被 Git 跟踪，ignore 规则不会让它停止出现在 `git status` 里。

如果想让它以后不再被 Git 跟踪，需要先从索引里移除：

```bash
git rm --cached foo.log
```

然后保留 ignore 规则。这样 `foo.log` 仍留在工作区，但 Git 不再把它当作 tracked file。

## 用户确认状态

已确认。最终指南中可以把这节放在最前面，用一个短例子建立正确心智模型，重点纠正“写进 `.gitignore` 就会被 Git 忽略”的误解。
