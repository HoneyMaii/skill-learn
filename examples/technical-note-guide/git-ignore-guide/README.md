# Git Ignore 机制完整指南

这个目录用于沉淀一份中文 Git ignore 机制指南。项目采用两层结构：

- `notes/`：保存多轮会话确认稿和章节草稿。
- `guide.html`：内容确认后生成的最终静态教程页面。

当前阶段先维护笔记与内容决策，不一次性定稿最终页面。

## 已确认主题

- `.gitignore`
- `.git/info/exclude`
- 全局 ignore，例如 `core.excludesfile`
- ignore 只影响未跟踪文件，不影响已经 tracked 的文件
- `git rm --cached <path>` 与 ignore 规则配合使用
- ignore 机制的排查命令和最佳工程实践

## 目录约定

```text
notes/
  00-content-decisions.md
  01-core-model.md
  02-ignore-mechanisms.md
  03-tracked-files.md
  04-debugging-ignore.md
  05-engineering-practices.md
```

## 后续产物

内容确认完成后，再生成：

- `guide.html`
- `verify-guide.js`
- `guide-preview.png`
