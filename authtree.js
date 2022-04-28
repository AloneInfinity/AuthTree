/*
/================ 权限控制树 ================/
    版本: v1.0.0
    作者: AloneInfinity
*/
var $_def = function () {
    return {
        ele: "",//挂载容器
        data: [],//授权树数据
        bind: {//属性名绑定
            title: "title",//节点名称
            child: "child",//子节点
            primary: "id"//节点主键字段（默认选中等一些功能需要依靠此项）
        },
        callback: {//元素事件回调函数：key => 元素的prop，value => 事件
            onchecked: null,//发生选中时
            onunchecked: null,//发生取消选中时
            onopen: null,//发生展开时
            onclose: null//发生关闭时
        },
        half: true,//是否包含半选状态（使用getCheckedData 方法时会 包含 或 不包含 半选状态的数据）
        default: {
            open: true,
            checkbox: false
        }
    }
};
function AuthTree(input = $_def) {
    let option = Object.assign($_def(), input), tree = document.querySelector(option.ele), tk = option.bind.title, ck = option.bind.child;//[获取挂载容器],[获取title的键],[获取child的键]
    let style = 'CiAgICBbYXQtYXJyb3ddIHsKICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBRUFZQUFBRDYrYTJkQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQm1KTFIwUUFBQUFBQUFENVE3dC9BQUFBQ1hCSVdYTUFBQVo0QUFBR2VBRDZxQlBvQUFBQUIzUkpUVVVINFFJR0R3b0tYd0Vva2dBQUJTSkpSRUZVZU5ydDEyMXNVMVVZQi9EL3VYY2Q0dzU1dXd3S21BVzlrR0RNQWpZRUVnT0dpWGVMSUlKbU1zY1lreDdHUUkxK01GRm5kSWt4S2dFVFl2d3dacWhrNDNXaWJvcUxtWVZFUXd3eFlWUU1idzY0cGd3eEFTNWJSVmZXcnZmNDRiWWRxeTY4T0x6dDh2dyszanp0L1ovem5KNXpDaEJDQ0NHRUVFSUlJWVFRUWdnaGhCQkNDQ0dFRUVJSUlZUVFRZ2doaEF3eFZYMHN5dDhkYWFnVDlmbDgzWlB6bk01eisvbjFRcjUyeVM0MVgxL01hMGU5NUhTZXdjaE9CMGdWYjN3bkdGdUlDL3M3WUVGQlg4MVZKVXU3MzFOd2NYdzRZaGlCWTBjTnAzTU9tbC9SbDNCZVVZOXNDSWltejlHSEdIb2UyYVJNMEdaNmx1d1Q0WkJ4SnZCOTVMRFRPUk1rcHdQOE14RmJpRXRWV3lHZ0lMSkl0eCt5ZW93QWc2dStVNTJxUDhyWDh1ZWRqcGxLbmFRWDhmWGxaNUdEQ01SMkRnR0FTZnRoZ1NHMndJMWV5TGo0UXRvMFBpSDlGb0NLVVZqODBUaElBSExxemVSekFRRHNGSzVEQmo3K1FCMm5GL09xTldzY2p6dEpMK2JWWmFjUWcwQzBvUU1NQUpQN2QxWUpPWWcxTkdFRVNtQnU5anFkTjFYYUhRSGhLOGE1d0U1OHEwelRabmcydFVZUmhrQ0h1d0FDUU4rY2Urd3E1Z0lnSUpaMkthTTB6VE12dUN6Y1l4aUJJOGUrL0w5eXF1TjBuVmMrV3dBTEF0alpIcC9PdDVJRmR1TWJvYUFVM2Q0ejVubi9hbCtMOVlyVDg1c3EvWGFBT1BPa3Y4MVhLTFpBaFl6bEc3YkZkNFRma3dVTUFLVG43SVh4U1l1YXJ5L2tHeW9PM08xY3FrdGZ4RmV0S0FFRGc3empPenVIM0pJc3NCdS9Bd3FlUWNqYlpRYjlxM3d0MXR0T3orZGdtTk1CYnBVNlV5L21iZXg5bUxEd1ZaMFhGb0RyMVJNSFZsbTU2SU9FNk9yRFpzamY1bXZjTld2STNwK25GL0hLa3ZkZ1FVRGVrMnZQWGxiLzdkNXUvQzZNUkFsQzNqL004LzVLWDdPVmRuZVZWR203QTZReVQvdmJmTVdpQm5tUVVicWhOcjRqaEZLRzh4ZGNpQ0c3NGJRNlJpL2tsU3NuLzlmM3FtUDFJbDcrOUhFSUNMajJiQVB3YjQzL0RBcktFUEwrbkNtTlQwaTdPOEROaEM4Ylp3UGIwYTdrYXpNODc3U3F1QTRCd3owOWZrZklCY0FBNlVFQUV0anlka1hWcG50bWQ0andOZU5jNEtmamwyLzFQV3FlcnZPcTViMFFBT1NtRS9aZTZmb3dXV0EzZnZjTnYvZ0tYN1AxdXRQemM3c3k1Z2dZalBxQVhzd1BzdGRnUXNhT09vNFlvcENyWnd3WUlldUx3SUtGclBJM3phditnNzZ0bjI0ZTlQdkc2SS96cW1YbHlFSU0xcjV1QUFKd2ZaMHNzQnZmQUFXbENIa3Zta0gvS2wrejlZYlQ4M0NuTW00SFNCVytZcHdMTk9JSFpiWlc1ZWxwSFkwdVhNQVVkejRFWXBEbmpMZXJKQmtTR0t5bmppaFoybjJlT2FkZURQY2F2d2FPbm14S2ZJK2FweGR4dm5RdkpGZ1Erd3J0cDlrMXlSZlpqZDhKQlNzUThsNHlnNW41aTArVjhUdEFLdlZoZlNPZnlUYmlMQTVoYmwwcFlvakFWVDN0aGhFelNIMEZHSTBJV0dramdzakJ0ZDVjakVVTXloZTFkbEgyM21TOTNmaTlVRkNDa0Rka0J2MlZ2bVpydmRQakhDckRiZ0VrcUF2MExWeGo2L0FML0poZlY0c1lvc2lxbmpwZzVDejZJeXd3Q1BFRUdBU1EzWDlIU0p6eENzclE3VDFtQnYwcmZTM1dKcWZITmRReS9nZ1lUUGk4MFJib1Fyc3lTK09lM3RhSjZNWnZtT3gyRHp3YTVIdmovK05mVFg2d2Y2c3ZRY2o3cHhuMFYvaGFySm83Q3BFQmh1MENTQWgzR2djQ1YzQkFtYTFWZWNMSk84TFUrRUtZa0N6c3Y5d2x6dmpWdm1iclphZnozMjNEZmdFa2hEc05mOERFSWVVaGJaMm5wMVZCRnpveHhhMkJ3UVdjK0NaK3E3OHdYQzUzNUNiVThYb2xuODQycW5rNjUzT2xNcWZ6RUVJSUlZUVFRZ2doaEJCQ0NDR0VFRUlJSVlRUVFnZ2hoQkJDQ0NGMzRHK1F6dEovYTZ1aWlnQUFBQzU2VkZoMFpHRjBaVHBqY21WaGRHVUFBSGphTXpJd05OYzFNTkkxTUFzeE5MVXlOTEF5c05RMk1MQXlNQUFBUVlRRkNqNGRKN29BQUFBdWVsUllkR1JoZEdVNmJXOWthV1o1QUFCNDJqTXlNRFRYTlREU05UQUxNVFMxTWpTd01yRFVOakN3TWpBQUFFR0VCUW9YSW84eUFBQUFhbnBVV0hSemRtYzZZbUZ6WlMxMWNta0FBSGphQmNFQkRnSWhEQVRBRitFYU5WSDhUZUY2cElsUVVucjArODZjOHVNdmdFMkdpSUJVSGF2cTVWaXVSbzFCYzJLYWJIS0dWQjJZeGwydWpyVWJ5RXdqRlhYWG5nNk5rWjc4eWU5SE9YTEovQ3JuL2JaMit3T0FBU1RYTXREQkNRQUFBQUJKUlU1RXJrSmdnZz09KTsKICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IDEyNSUgMTI1JTsKICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7CiAgICAgICAgd2lkdGg6IDIwcHg7CiAgICAgICAgaGVpZ2h0OiAyMHB4OwogICAgfQoKICAgIFthdC1ub3QtY2hpbGRdID4gW2F0LWhlYWRlcl0gW2F0LWFycm93XSB7CiAgICAgICAgb3BhY2l0eTogMDsKICAgIH0KCiAgICBbYXQtc3RhdGU9ImNsb3NlIl0gPiBbYXQtaGVhZGVyXSBbYXQtYXJyb3ddIHsKICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtOTBkZWcpOwogICAgfQoKICAgIFthdC1ib2R5XSB7CiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjsKICAgIH0KCiAgICBbYXQtYXV0aC10cmVlXSA+IFthdC1ub2RlXSB7CiAgICAgICAgbWFyZ2luOiAwcHg7CiAgICB9CgogICAgW2F0LWF1dGgtdHJlZV0gKiB7CiAgICAgICAgdHJhbnNpdGlvbjogMC40cyBhbGw7CiAgICB9CgogICAgW2F0LW5vZGVdIHsKICAgICAgICBtYXJnaW46IDBweCAwcHggMHB4IDE2cHg7CiAgICB9CgogICAgW2F0LXN0YXRlPSJjbG9zZSJdID4gW2F0LWJvZHldIHsKICAgICAgICBoZWlnaHQ6IDBweDsKICAgIH0KCiAgICBbYXQtaGVhZGVyXSB7CiAgICAgICAgZGlzcGxheTogZmxleDsKICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOwogICAgICAgIHBhZGRpbmc6IDZweDsKICAgIH0KCiAgICBbYXQtY2hlY2tib3hdIHsKICAgICAgICB3aWR0aDogMTRweDsKICAgICAgICBoZWlnaHQ6IDE0cHg7CiAgICAgICAgZGlzcGxheTogZmxleDsKICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsKICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOwogICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsKICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7CiAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7CiAgICAgICAgYm9yZGVyLXJhZGl1czogMi41cHg7CiAgICAgICAgbWFyZ2luLXJpZ2h0OiA4cHg7CiAgICB9CgogICAgW2F0LWNoZWNrYm94PSJjaGVja2VkIl0sIFthdC1jaGVja2JveD0iaGFsZiJdIHsKICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjNWZiODc4OwogICAgICAgIGJhY2tncm91bmQ6IHJnYmEoOTUsIDE4NCwgMTIwLCAxKTsKICAgIH0KCiAgICAgICAgW2F0LWNoZWNrYm94PSJoYWxmIl0gPiBbYXQtY2hlY2stYm94LXRpY2tdIHsKICAgICAgICAgICAgdHJhbnNmb3JtOiB1bnNldDsKICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDBweDsKICAgICAgICAgICAgaGVpZ2h0OiAwcHg7CiAgICAgICAgICAgIHRvcDogMHB4OwogICAgICAgIH0KCiAgICBbYXQtY2hlY2stYm94LXRpY2tdIHsKICAgICAgICBib3JkZXI6IDEuNnB4IHNvbGlkIHdoaXRlOwogICAgICAgIGJvcmRlci10b3A6IDBweDsKICAgICAgICBib3JkZXItcmlnaHQ6IDBweDsKICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpOwogICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsKICAgICAgICB3aWR0aDogOHB4OwogICAgICAgIGhlaWdodDogNXB4OwogICAgICAgIHRvcDogLTJweDsKICAgIH0K';
    let state = {//状态字典映射
        checkbox: ["checked", "unchecked"],//选中，半选，未选
        state: ["open", "close"]
    };
    let store = {};
    let primay = new Map();//主键与node映射
    let area = new Map([
        ["header", ["checkbox", "arrow"]]
    ]);
    let trigger = function (type, e) {
        action[type].call(this, e);
    };
    let action = {//默认事件
        checkbox: function (e, isDefault = true, defaultVal = null) {
            let next = lib.next(this, "checkbox");//获取即将应用的状态
            if (isDefault) this['parent-node']['parent-node']['child-nodes']?.map(node => node.method.ischecked(defaultVal || next));//向下传播
            this.dispatchEvent(event["checkbox"](this, defaultVal || next));//向上传播
        },
        arrow: function (e) {
            lib.switch(this["parent-node"]["parent-node"], "state");//默认行为（切换状态）
            this.dispatchEvent(event["arrow"](this));
        }
    };
    let active = {//主动激活事件 [handle]
        node: {
            event: function (e) {//node事件处理方法（用于集中判断各种处理事件）
                let eventDetail = e.detail;
                area.forEach(((value, key) => {
                    if (value.includes(eventDetail.type)) this["child-list"][key]?.handle?.call(this["child-list"][key], e);//把事件传递给对应区域的主动激活处理方法
                }).bind(this));
            },
            check: function () {//检查子节点状态
                let state = this['child-nodes']?.map(node => lib.attr(node["child-list"].header['child-list'].checkbox, "checkbox"));//获取当前 node 下直接子集的状态是否是全选
                return state ? state.filter(i => i === "checked").length === state.length ? 1 : (state.filter(i => i === "unchecked").length === state.length ? -1 : 0) : null;
            },
            ischecked: function (ischecked) {//子节点是否勾选
                lib.switch(this['child-list'].header['child-list'].checkbox, "checkbox", ischecked);
                this['child-nodes']?.map(node => node.method.ischecked(ischecked));
            }
        },
        header: {
            event: function (e) {//处理node中，头部部分事件的处理方法
                let eventDetail = e.detail;
                this['child-list'][eventDetail.type].handle.call(this['child-list'][eventDetail.type], e);
            }
        },
        checkbox: {
            event: function (e) {
                switch (this['parent-node']['parent-node'].method ? this['parent-node']['parent-node'].method.check() : "") {//检查当前 node 的子 node 的状态
                    case 1:
                        lib.switch(this, "checkbox", e.detail.state);//默认行为（切换状态）
                        break;
                    case 0:
                        lib.switch(this, "checkbox", "half");//默认行为（切换状态，但值为 half 表示为半选择）
                        break;
                    case -1:
                        lib.switch(this, "checkbox", e.detail.state);//默认行为（切换状态）
                        break;
                    case null://当不存在child-node
                        lib.switch(this, "checkbox", e.detail.state);//默认行为（切换状态）
                        break;
                }
            }
        }
    };
    let model = {
        eventData: {
            target: null
        }
    };
    let event = {//事件
        base: function (eventName, data = model.eventData) {
            return new CustomEvent(eventName, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
        },
        checkbox: function (ele, state) {
            return this.base("checkbox-change", {
                target: ele,
                state: state,
                type: "checkbox"
            });
        },
        arrow: function (ele) {
            return this.base("arrow-change", {
                target: ele,
                state: lib.attr(ele, "arrow"),
                type: "arrow"
            });
        }
    }
    let lib = {
        append: function (target, ...eles) {
            eles.forEach((ele) => {
                if (ele.constructor === Array) {//如果等于对象
                    if (!target["child-list"]) target["child-list"] = {};
                    if (!ele[1]["child-list"]) ele[1]["parent-node"] = null;
                    target["child-list"][ele[0]] = ele[1];
                    ele[1]["parent-node"] = target;//向子级内存入父级元素
                    target.append(ele[1]);
                }
                else {
                    target["child-list"] = eles;
                    target.append(ele);
                }
            });
            return target;
        },
        switch: function (ele, prop, value = undefined) {
            if (value) {
                ele.setAttribute("at-" + prop, value);
            }
            else {
                if (state[prop][0] === ele.getAttribute("at-" + prop)) {
                    ele.setAttribute("at-" + prop, state[prop][1]);
                }
                else {
                    ele.setAttribute("at-" + prop, state[prop][0]);
                }
            }
        },
        next: function (ele, prop) {//返回下一个状态（switch是设置并返回下一个状态）
            if (state[prop][0] === ele.getAttribute("at-" + prop)) {
                return state[prop][1];
            }
            else {
                return state[prop][0];
            }
        },
        attr: function (ele, prop) {
            return ele.getAttribute("at-" + prop);
        },
        check: function (ele) {//获取选中状态
            let cn = ele["parent-node"]["parent-node"]['child-nodes'];
            if (cn) {
                let check = ele["parent-node"]["parent-node"]['child-nodes'].map(nodes => lib.attr(nodes["child-list"]["header"]["child-list"]["checkbox"], "checkbox") === "checked");//获取子项目选择状态
                if (check.length !== check.filter(i => i).length && check.filter(i => i).length !== 0) {//半选中(部分选中部分未选中)
                    lib.switch(ele, "checkbox", "half");
                }
            }
        }
    }
    let factory = {
        unit: document.createElement("div"),
        base: function (ele, ...props) {
            let _ = ele || this.unit.cloneNode(true);//如果有传入元素则使用传入元素，如果为null则使用默认单元创建
            if (props)
                props.forEach(prop => {
                    let pk = prop.constructor === String ? prop : prop[0];
                    if (!store[pk]) store[pk] = [];
                    store[pk].push(_);
                    if (prop.constructor === String) {//无值的属性
                        _.setAttribute("at-" + prop, "");
                    }
                    else if (prop.constructor === Array) {//有值的属性
                        _.setAttribute("at-" + prop[0], prop[1]);
                    }
                    if ((Object.keys(action).includes(prop) || Object.keys(action).includes(prop[0])) && !_.onclick) {//注册基本事件(必须为未注册的)
                        _.onclick = trigger.bind(_, prop.constructor === Array ? prop[0] : prop);
                    }
                    if ((Object.keys(active).includes(prop) || Object.keys(active).includes(prop[0])) && !_["handle"]) {//注册基本事件(必须为未注册的)
                        _["handle"] = active[prop]?.event || active[prop[0]]?.event;
                        _["method"] = (function (ele) {
                            let method = {};
                            Object.keys(active[prop] || {}).forEach(function (k) {
                                if (k !== "event") {
                                    method[k] = active[prop][k].bind(ele);//绑定 this 为自身
                                }
                            });
                            return method;
                        })(_);
                    }
                })
            return _;
        }
    };
    let render = {
        node: function (data, parentNode, parentNodes = []) {
            let node = template.node(), child = node["child-list"], headerEles = child.header["child-list"];
            parentNodes.push(node);
            node["nodes"] = [...parentNodes];//记录当前所在分支的节点集合
            node["parent-node"] = parentNode;//记录当前 node 的父级 node
            node["data"] = data;
            primay.set(data[option.bind.primary], node);//数据主键与 node 绑定
            headerEles.text.innerText = data[tk];
            if (data[ck] && data[ck].length !== 0) {
                data[ck].forEach((childData) => {
                    let childNodes = this.node(childData, node, parentNodes);
                    node["child-nodes"] ? node["child-nodes"].push(childNodes) : (node["child-nodes"] = [childNodes]);
                    lib.append(child.body, childNodes)
                });
            }
            else {//如果当前node下child项为空
                factory.base(node, "not-child");//标记为无子级菜单
            }
            return node;
        }
    };
    let styleBuild = function () {
        if (!document.querySelector("#auth-tree")) {
            let styleElement = document.createElement("style");
            styleElement.id = "auth-tree";
            styleElement.innerHTML = atob(style);
            document.querySelector("body").appendChild(styleElement);
        }
    }
    let init = function () {
        let childs = [];
        styleBuild();
        factory.base(tree, "auth-tree");
        option.data.forEach(top => {
            childs.push(render.node(top, tree));
        });
        lib.append(tree, ...childs);
    }
    let template = {
        node: function () {//节点构造
            return lib.append(factory.base(null, "node", ["state", option.default.open ? "open" : "close"]), ["header", this.header()], ["body", factory.base(null, "body")]);
        },
        header: function () {
            return lib.append(factory.base(null, "header"), ["arrow", factory.base(null, "arrow")], ["checkbox", lib.append(factory.base(null, ["checkbox", option.default.checkbox ? "checked" : "unchecked"]), factory.base(null, "check-box-tick"))], ["text", factory.base(null, "text")], ["tool", factory.base(null, "tools")]);
        }
    }
    tree.addEventListener("checkbox-change", function (e) {
        let nodes = e.path.filter(ele => ele.hasAttribute ? ele.hasAttribute("at-node") : false);//获取所有树节点（触发目标的父级）
        nodes.map(node => node.handle(e));//把事件通知给所有node（触发主动事件）
    });
    tree.addEventListener("arrow-change", function (e) {
        e.target?.handle?.call(this, e);
    });
    let observer = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {

        })
    });
    observer.observe(tree, {
        attributes: true, // 观察属性变动
        attributeOldValue: true,
        attributeFilter: Object.keys(action).map(prop => "at-" + prop),
        subtree: true     // 观察后代节点，默认为 false
    })
    init();//初始化
    this.store = store;//获取组件元素集合
    this.getCheckedData = function () {//获取所有选中的数据
        return store.checkbox.filter(checkbox => lib.attr(checkbox, "checkbox") === "checked" || (option.half ? (lib.attr(checkbox, "checkbox") === "half") : true)).map(checkbox => checkbox['parent-node']['parent-node'].data);
    }
    this.setCheckedData = function (defaultData = []) {//设置选中项目（输入主键字段即可）
        defaultData.forEach(id => {
            let node = primay.get(id);
            if (node) {
                action["checkbox"].call(node['child-list'].header['child-list'].checkbox, event.checkbox(node), false, "checked");//关闭向下传播（避免某个节点选中后选中下面的子节点）
            }
        });
    }
}
