# 04 排查 Ignore 是否生效

## 常见问题

排查 ignore 时，常见问题有三类：

1. 文件已经 tracked，所以 ignore 不生效。
2. ignore 规则没有匹配到目标路径。
3. 规则匹配了，但被后面的反向规则覆盖。

## 查看被忽略文件

普通 `git status` 默认不会展示被忽略文件。可以使用：

```bash
git status --ignored
```

适合确认：

- 某个未跟踪文件是否已经被 ignore。
- 当前仓库中有哪些 ignored files。
- ignore 后文件是否仍然出现在 untracked 列表中。

## 查看哪条规则生效

使用：

```bash
git check-ignore -v <path>
```

示例：

```bash
git check-ignore -v foo.log
```

它适合回答：

- `foo.log` 是否被 ignore。
- 是哪个 ignore 文件里的哪一行规则命中了它。
- 命中的是 `.gitignore`、`.git/info/exclude`，还是全局 ignore。

## 排查顺序

建议最终指南给出这个排查顺序：

1. 先看文件是否 tracked：

```bash
git ls-files -- foo.log
```

如果有输出，说明文件已经被 Git 跟踪，ignore 不会让它消失。

2. 再看 ignore 规则是否命中：

```bash
git check-ignore -v foo.log
```

如果有输出，说明某条 ignore 规则命中了。

3. 最后看 ignored 列表：

```bash
git status --ignored
```

确认文件是否作为 ignored file 出现在状态中。

## 常见误区

- 误区一：写进 `.gitignore` 就能让已 tracked 文件消失。
- 误区二：`.git/info/exclude` 比 `.gitignore` 更强，可以覆盖 tracked 状态。
- 误区三：全局 ignore 会影响团队其他成员。
- 误区四：ignore 等于安全删除敏感信息。

## 完整排查案例：`debug.log` 为什么仍然显示 modified

场景：

你已经把 `debug.log` 写进 `.gitignore`：

```gitignore
debug.log
```

但修改 `debug.log` 后，`git status` 仍然显示：

```text
modified: debug.log
```

排查流程如下。

### 第一步：判断它是否已经 tracked

```bash
git ls-files -- debug.log
```

如果有输出：

```text
debug.log
```

说明 `debug.log` 已经被 Git 跟踪。此时 `.gitignore` 不会让它从 `git status` 中消失。

如果没有输出，说明它不是 tracked file，可以继续看 ignore 规则是否命中。

### 第二步：查看 ignore 规则是否命中

```bash
git check-ignore -v debug.log
```

如果有输出，通常会类似：

```text
.gitignore:1:debug.log	debug.log
```

含义是：

- 命中来自 `.gitignore`。
- 命中第 1 行。
- 命中的规则是 `debug.log`。
- 被检查的路径是 `debug.log`。

如果没有输出，说明当前 ignore 规则没有匹配到它，需要检查规则写法或文件路径。

### 第三步：根据目标选择处理方式

如果目标是“仓库不再跟踪，但本地保留 `debug.log`”：

```bash
git rm --cached debug.log
git status
```

然后确认 `.gitignore` 中已有：

```gitignore
debug.log
```

再提交：

```bash
git add .gitignore
git commit -m "stop tracking debug log"
```

如果目标是“仓库和本地都删除这个误追踪文件”：

```bash
git rm debug.log
git add .gitignore
git commit -m "remove debug log"
```

### 第四步：验证结果

提交后，如果本地重新生成 `debug.log`，普通状态检查不应该再显示它：

```bash
git status
```

如果想确认它确实被忽略，可以运行：

```bash
git status --ignored
git check-ignore -v debug.log
```

## 用户确认状态

已确认：最终指南需要加入 `debug.log` 完整排查案例，从 `git ls-files`、`git check-ignore -v` 到 `git rm --cached` 或 `git rm` 走完一遍。
