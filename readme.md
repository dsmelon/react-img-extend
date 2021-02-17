# 欢迎使用react图片扩展组件

此组件并无跨域问题，任何图片都可以使用，请放心使用

安装
```nodejs
 npm install react-img-extend --save
```

例子演示: [https://dsmelon.github.io/react-img-extend/dist/index.html](https://dsmelon.github.io/react-img-extend/dist/index.html)

**api**

|参数名|类型|默认值|说明|值|
|:-|:-|:-|:-|:-|
|className|string|无|容器的类名||
|imgSrc|string|无|图片的链接||
|direction|string|bottom|扩展方向|left: 向左扩展<br/>right: 向右扩展<br/>top: 向上扩展<br/>bottom: 向下扩展<br/>grid9: 九宫格扩展|
|withReverse|boolean|false|扩展时是否伴随着翻转|九宫格无效|
|rowRepeat|number|1|扩展的像素行数|九宫格无效|
|split|number\[\]|\[8,8,8,8\]|九宫格切割断点|具体位置用法看下图|
|repeatType|string|stretch|九宫格填充类型|stretch: 拉伸<br/>tile: 平铺|

**九宫格断点和填充类型说明**

![](https://i.postimg.cc/D0DpJ65d/s.jpg)

使用方法
```jsx
<ImgExtend
    withReverse={true}
    rowRepeat="stretch"
    direction="bottom"
    imgSrc={src}
    ...其余配置
>
    你内部的内容
</ImgExtend>
```

github地址: [https://github.com/dsmelon/react-img-extend](https://github.com/dsmelon/react-img-extend)