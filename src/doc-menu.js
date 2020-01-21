import "./doc-menu.less"
/**
 * 自动生成页面内容索引
 * 只提取 h1,h2,h3 生成一二三级标题索引
 * 使用方式：直接引用 js 和 css;当页面内容加载完成后执行 `DOC_MENU.init()`。
 */

window.DOC_MENU = window.DOC_MENU || {};
DOC_MENU.title = "目录"; // 标题
DOC_MENU.hashPrefix = "hash"; // hash 前缀
DOC_MENU._menuList = []; // 菜单列表信息
DOC_MENU._menuTreeList = []; // 菜单列表树状信息
/**
 * @param isRender 是否直接渲染，默认true
 * @return 菜单列表信息
 */
DOC_MENU.init = function (isRender = true) {
    const htmlStr = document.documentElement.outerHTML || "";
    const result = htmlStr.match(/<\s*h(1|2|3).*?>.+?<\s*\/h(1|2|3)\s*>/g);

    if (result == null) {
        console.log("未匹配到菜单内容")
        return null;
    }

    // 获取菜单索引信息
    let menuList = result.map((e) => {
        const tag = 'h' + e.match(/<\s*h(1|2|3)/)[1];
        const content = e.match(/>.*?</g).map(e => e.replace(/>(.*?)</, '$1')).join(""); // 获取节点内容信息

        return {
            tag,
            content,
        }
    })

    const h1List = menuList.filter(e => e.tag == "h1"); // h1 标签信息列表
    const h2List = menuList.filter(e => e.tag == "h2"); // h2 标签信息列表
    const h3List = menuList.filter(e => e.tag == "h3"); // h3 标签信息列表

    menuList = menuList.map((e) => {
        let list = e.tag == "h1" ? h1List : e.tag == "h2" ? h2List : h3List;
        let index = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].content == e.content) {
                index = i;
                break;
            }
        }
        const hash = `${DOC_MENU.hashPrefix}_${e.tag}_${index}`;
        e.hash = hash;
        e.index = index;
        return e;
    })

    // html 锚点添加
    menuList = menuList.map(e => {
        let node = document.getElementsByTagName(e.tag)[e.index];
        if (!node) {
            return e;
        }
        if (!node.getAttribute("id")) {
            node.setAttribute("id", e.hash);
        } else {
            e.hash = node.getAttribute("id");
        }
        return e;
    })
    DOC_MENU._menuList = menuList.concat();
    menuList = DOC_MENU.parseToTreeData(menuList) // 解析为树状列表信息
    DOC_MENU._menuTreeList = menuList;
    isRender && DOC_MENU.render(menuList);
    return menuList;
}

/** 
 * 格式化为树状结构
 * @param menuList 菜单列表信息
 * @return 树状结构数据
 */
DOC_MENU.parseToTreeData = function (menuList) {
    let arr = [];
    menuList.map(e => {
        if (e.tag == "h1") {
            arr.push(e)
        } else if (e.tag == "h2") {
            if (arr.length > 0) { // 判断 h1 是否存在
                if (!arr[arr.length - 1].children) {
                    arr[arr.length - 1].children = []
                }
                arr[arr.length - 1].children.push(e)
            }
        } else if (e.tag == "h3") {
            if (arr.length > 0) { // 判断 h1 是否存在
                if (arr[arr.length - 1].children) { // 判断 h2 是否存在
                    let h2 = arr[arr.length - 1].children;
                    if (!h2[h2.length - 1].children) {
                        h2[h2.length - 1].children = []
                    }
                    h2[h2.length - 1].children.push(e)
                }
            }
        }
    })
    return arr;
}

/**
 * 菜单模块渲染
 * @param menuList 菜单列表信息
 */
DOC_MENU.render = function (menuList) {
    let renderLevel3 = function (item) {
        return `<li class="d3 item"><a href="#${item.hash}" title="${item.content}">${item.content}</a></li>`
    }
    let renderLevel2 = function (item) {
        return `<li class="d2 item"><a href="#${item.hash}" title="${item.content}">${item.content}</a>
            ${item.children ? `<ul class="doc_menu_leaf_list">${item.children.map(e => renderLevel3(e)).join("")}</ul>` : ''}
            </li>`
    }
    let renderLevel1 = function (item) {
        return `<li class="d1 item"><a href="#${item.hash}" title="${item.content}">${item.content}</a>
            ${item.children ? `<ul class="doc_menu_sub_list">${item.children.map(e => renderLevel2(e)).join("")}</ul>` : ''}
            </li>`
    }
    let listStr = `<ul class="doc_menu_list">${menuList.map(e => renderLevel1(e)).join("")}</ul>`
    let str = `<div class="doc_menu_body">
        <div class="doc_menu_title">${DOC_MENU.title}</div>
        ${listStr}</div>`;
    let div = document.createElement("div");
    div.setAttribute("class", "doc_menu_block");
    div.innerHTML = str;
    document.body.appendChild(div);
}

