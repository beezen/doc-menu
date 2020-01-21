# 页面文档锚点生成

通过引入一个 `js`,可帮助文章页面立刻生成对应的索引列表信息。

## 使用

在页面最顶端引入`css`和`js`,注意：等页面内容加载完成后，执行`DOC_MENU.init()`初始化后，立即就会在页面右侧出现索引列表。

资源引用两种方式：1.直接引用在线cdn地址。2.将编译后的源码目录 `lib`, 拷贝到项目中。具体如下：

```html
<html>
<head>

<link rel="stylesheet" href="https://unpkg.com/doc-menu@0.0.1/lib/doc-menu.css">
<script src="https://unpkg.com/doc-menu@0.0.1/lib/doc-menu.js"></script>

<!-- <link rel="stylesheet" href="./lib/doc-menu.css">
<script src="./lib/doc-menu.js"></script> -->

</head>

<body>

    <script>
        DOC_MENU.init(); // 初始化
    </script>
</body>
</html>
```

## 原理和效果

`js` 自动获取 `HTML` 中的 `h1`|`h2`|`h3` 标签中的信息，生成对应的信息列表。（需要完全自定义的可下载源码直接修改哦）

`效果如下`：

<img src="http://img.dongbizhen.com/blog/anchorlist.png" />

## 可配置参数

```javascript
DOC_MENU.title = "目录"; // 标题
DOC_MENU.hashPrefix = "hash"; // hash 前缀
DOC_MENU._menuList = []; // 菜单列表信息
DOC_MENU._menuTreeList = []; // 菜单列表树状信息

/**
 * 初始化
 * @param isRender 是否直接渲染，默认true
 * @return 菜单列表信息
 */
DOC_MENU.init(isRender) // 可以不直接渲染，配合`render`函数可自定义操作

/**
 * 菜单模块渲染
 * @param menuList 菜单列表信息
 * [{tag:'h1',content:'标题一',hash:'页面中的锚点id',children:[{tag:'h1',content:'标题一',hash:'页面中的锚点id'}]}]
 */
DOC_MENU.render(menuList) // 可以单独渲染索引列表
```
