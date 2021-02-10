import React, { useState } from 'react';
import ReactDom from 'react-dom';
import ImgExtend from '../src/index';
import './index.scss';
export default function App(){

  const [src, setSrc] = useState('');
  const [rowRepeat, setRowRepeat] = useState();
  const [withReverse, setWithReverse] = useState();
  const [repeatType, setRepeatType] = useState();
  const [split, setSplit] = useState();

  const change = e => {
    const key = e.currentTarget.getAttribute("prop");
    const val = e.currentTarget.value;
    switch(key){
      case "file":
        e.currentTarget.files[0] && setSrc(window.URL.createObjectURL(e.currentTarget.files[0]));
      break;
      case "fileURL":
        setSrc(val);
      break;
      case "rowRepeat":
        setRowRepeat(+val);
      break;
      case "withReverse":
        setWithReverse(e.currentTarget.checked);
      break;
      case "repeatType":
        setRepeatType(val);
      break;
      case "split":
        setSplit(val.split(",").map(_ => +_))
      break;
    }
  }

  return <div className="wrap">
    <div className="flex flex1">
      <ImgExtend className="ie ie1" withReverse={withReverse} rowRepeat={rowRepeat} direction="left" imgSrc={src}>向左扩展</ImgExtend>
      <ImgExtend className="ie ie2" withReverse={withReverse} rowRepeat={rowRepeat} direction="right" imgSrc={src}>向右扩展</ImgExtend>
    </div>
    <div className="flex flex2">
      <ImgExtend className="ie ie3" withReverse={withReverse} rowRepeat={rowRepeat} direction="top" imgSrc={src}>向上扩展</ImgExtend>
      <ImgExtend className="ie ie4" withReverse={withReverse} rowRepeat={rowRepeat} direction="bottom" imgSrc={src}>向下扩展</ImgExtend>
    </div>
    <div className="flex flex3">
      <div className="ie ie5">
        <ImgExtend className="drag" split={split} repeatType={repeatType} direction="grid9" imgSrc={src}>九宫格扩展</ImgExtend>
      </div>
    </div>
    <div className="flex flex4">
      <h1>请输入你的测试参数</h1>
      <div>请输入图片链接：<input type="text" value={src} onChange={change} prop="fileURL" placeholder="请输入链接地址" /></div>
      <div>可以从此处上传：<input type="file" onChange={change} prop="file" accept="image/*"/></div>
      <div>重复的像素行数：<input type="text" onChange={change} prop="rowRepeat" placeholder="请输入正整数" /></div>
      <span>（对九宫格无效）</span>
      <div>是否伴随着翻转：<input type="checkbox" onChange={change} prop="withReverse"/></div>
      <span>（排布纹理不会有明显断层，对九宫格无效）</span>
      <div>九宫格排布方式：
        <select onChange={change} prop="repeatType" placeholder="除固定四个角以外的剩下五个区块">
          <option label="拉伸">stretch</option>
          <option label="平铺">tile</option>
        </select>
      </div>
      <div>九宫格切割断点：<input onChange={change} prop="split" placeholder="请输入0~4个正整数，用英文逗号隔开"/></div>
      <span className="tip">小提示：九宫格可以从右下角拖拽改变大小看效果</span>
    </div>
  </div>
}

ReactDom.render(<App />, document.getElementById("root"));