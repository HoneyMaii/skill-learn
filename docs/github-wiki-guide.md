# GitHub Wiki 快速上手（给每个 SKILL 写文档/手册）

## 一次性初始化
1. 进入仓库主页：`https://github.com/HoneyMaii/skill-learn`
2. 点击 **Wiki** 标签页；
3. 首次进入时，点击 **Create the first page**；
4. 创建 `Home` 页面，作为 SKILL 文档总目录。

## 为每个 SKILL 建立页面
1. 在 Wiki 点击 **New Page**；
2. 页面名建议与仓库记录保持一致（例如：`create-release-notes`）；
3. 按下面模板填写并保存：

```markdown
# SKILL: <name>

## 目标

## 适用场景

## 输入

## 使用步骤

## 示例

## 注意事项
```

## 维护建议
- 在 `Home` 页面维护目录，例如：
  - `- [create-release-notes](create-release-notes)`
- 每新增一个仓库内 SKILL 文档（`/skills/*.md`），同步新增一个 Wiki 页面；
- 结构尽量统一，后续检索和复用会更容易。
