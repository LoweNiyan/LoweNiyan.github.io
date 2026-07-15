---
title: '测试文章'
summary: '对，就是测试文章。'
pubDate: '2026-07-09'
time: '15:30'
tags: ['技术', '随笔']
author: '洛濔'
image: '../../assets/img/test_image.jpg'
---

Lorem ipsum dolor sit amet, Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Ut enim ad minim veniam

quis nostrud *exercitation* **ullamco** laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Markdown 渲染器功能测试

> 这份文档旨在全面测试 Markdown 渲染器对各种语法和扩展样式的支持情况。  
> 请使用支持 GFM（GitHub Flavored Markdown）、数学公式、脚注等扩展的渲染器查看最佳效果。

---

## 1. 标题层级

# 一级标题 H1
## 二级标题 H2
### 三级标题 H3
#### 四级标题 H4
##### 五级标题 H5
###### 六级标题 H6

---

## 2. 文本强调

- **加粗文本** （双星号）
- __加粗文本__ （双下划线）
- *斜体文本* （单星号）
- _斜体文本_ （单下划线）
- ***粗斜体文本*** （三星号）
- ___粗斜体文本___ （三下划线）
- ~~删除线文本~~
- `行内代码`
- ==高亮文本== （需渲染器支持，如 Typora、MarkText）

---

## 3. 链接与图片

- 普通链接：[百度一下](https://www.baidu.com "百度")
- 自动链接：<https://www.example.com>
- 自动邮件：<user@example.com>
- 引用式链接：[引用链接][1]

[1]: https://www.example.com "示例网站"

- 图片示例：
  ![示例图片](https://via.placeholder.com/600x200/09f/fff.png?text=Markdown+Render+Test "Markdown 测试图片")

---

## 4. 列表

### 无序列表
- 项目 1
- 项目 2
  - 嵌套子项 2.1
  - 嵌套子项 2.2
    - 更深层级
- 项目 3

### 有序列表
1. 第一项
2. 第二项
   1. 子项 2.1
   2. 子项 2.2
3. 第三项

### 混合列表
1. 有序第一项
   - 混入无序
   - 混入无序 2
2. 有序第二项

---

## 5. 任务列表 (GFM)

- [ ] 未完成的任务
- [x] 已完成的任务
- [ ] 又一个待办
  - [x] 嵌套已完成

---

## 6. 引用块

> 这是一级引用。  
> 可以包含 **加粗**、*斜体* 等格式。
>
>> 这是嵌套的二级引用。
>>
>> - 引用中的列表
>> - 项目 2
>>
>> ```python
>> print("代码块可以在引用中")
>> ```

---

## 7. 代码

### 行内代码
使用 `printf("Hello, World!");` 输出。

### 围栏代码块（指定语言）
```python
def fibonacci(n):
    """生成斐波那契数列"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num)
```

### 无语言标识的代码块
```
这是一个普通的代码块
可以包含 <html> 标签
```

### 包含反引号的代码块
````markdown
```markdown
这里是一个嵌套的 Markdown 代码块
```
````

---

## 8. 表格

| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 单元格 | 单元格 | 100 |
| 内容可以 **加粗** | `code` | ~~删除~~ |
| 长内容测试 | 中 | 短 |

---

## 9. 分割线

三种写法均可生成水平分割线：

---

***

___

---

## 10. 脚注

这是一个带脚注的句子。[^1]  
这是第二个脚注引用。[^note]

[^1]: 第一个脚注的详细内容。
[^note]: 第二个脚注，支持 **加粗** 和 `代码`。

---

## 11. 定义列表（部分渲染器支持，如 Pandoc、PHP Markdown Extra）

术语 Markdown
: 一种轻量级标记语言，用于格式化纯文本。

术语 渲染器
: 将 Markdown 转换为 HTML 或其他格式的工具。

---

## 12. 数学公式（LaTeX，需 MathJax 或 KaTeX 支持）

行内公式：$E = mc^2$，以及 $\alpha + \beta = \gamma$。

块级公式：

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

---

## 13. 上标与下标（扩展语法）

- 水分子：H~2~O
- 平方：x^2^ + y^2^ = z^2^
- 同时使用：a~i~^2^

（需要渲染器或插件支持，如 GitLab、Redcarpet、Markdown-it 插件等）

---

## 14. 表情符号 (Emoji)

:smile: :rocket: :+1: :tada: :heart: :book: :memo:

（需要渲染器支持 Emoji 短代码）

---

## 15. HTML 标签嵌入

- 键盘输入：<kbd>Ctrl</kbd> + <kbd>C</kbd>
- 缩写：<abbr title="HyperText Markup Language">HTML</abbr>
- 标记/高亮：<mark>这是用 HTML 标签实现的高亮</mark>
- 下划线：<ins>下划线文本</ins>
- 删除线：<del>另一种删除线</del>
- 上标下标：X<sup>2</sup>  H<sub>2</sub>O
- 折叠详情：
  <details>
    <summary>点击展开详情</summary>

    这里是被隐藏的内容，可以包含 **Markdown**，但注意部分渲染器在 HTML 块内不解析 Markdown。

  </details>
- 黑幕/防剧透 <spoiler-text>你好~</spoiler-text>
---

## 16. 转义字符

\*这不是斜体\*  
\`这不是代码\`  
\_这不是强调\_  
\# 这不是标题  
\\ 这是一个反斜杠

---

## 17. 字符实体

- 版权符号：&copy;
- 注册商标：&reg;
- 商标：&trade;
- 与号：&amp;
- 小于号：&lt;
- 大于号：&gt;
- 双引号：&quot;
- 非断空格：&nbsp;&nbsp;这里有空格

---

## 18. 特殊测试

### 长代码行
`这是一段非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的行内代码，用于测试渲染器的换行处理。`

### 大量嵌套列表
1. 第一层
   1. 第二层
      1. 第三层
         - 第四层无序
           - 第五层
2. 回到第一层

### 表格中的特殊字符
| 管道 | 转义 \| 表格内 |
|------|----------------|
| `|`  | 在代码中显示    |
| \|   | 转义后的管道    |

---

> **测试结束**  
> 感谢你使用这份 Markdown 渲染器测试文件。如果所有样式都能正确显示，说明你的渲染器功能非常强大！