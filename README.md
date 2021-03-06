# AuthTree
简易的授权树组件。

# 开门见山：
## 1、首先定义一个测试数据，基础结构如下：
``` 
var data = [
  {
    id:"1",
    name:"节点 A",
    children:[
      {
        id:"2",
        name:"节点 A-1",
        children:[]
      },
      {
        id:"3",
        name:"节点 A-2",
        children:[]
      }
    ]
  }
];
```

## 以上部分对应组件结构如下
```
[复选框] [节点标题(此处对应的为 name)]
  [复选框] [节点标题(此处对应的为 name)]-\
  [复选框] [节点标题(此处对应的为 name)] |
  [复选框] [节点标题(此处对应的为 name)]  > 这部分为子节点数据(此处对应为 children)
  [复选框] [节点标题(此处对应的为 name)] |
  [复选框] [节点标题(此处对应的为 name)]-/
 ...
 ```
 
## 2、初始化部分:
※本组件的css代码由js直接生成插入，所以直接引入 authtree.js 即可放心食用。
```
var authtree = new AuthTree({
    ele: "#at", //组件挂载的容器元素的选择器（id，attribute，class 都行）
    data: data, //组件所需的数据
    bind: {
        title: "name",//title 为内置数据获取属性，对应前面结构中的 [节点标题]，name 为当前数据中对应的字段。
        child: "children",//child 同上。
        primary: "id" //primary 为组件中识别数据的重要字段，必须唯一。
    },
    default: {
        open: false, //默认是展开树还是关闭树。
    }
});
```
