import React, { useLayoutEffect, useRef, memo, useEffect } from 'react';
import './index.less';
const dpr = window.devicePixelRatio === 1 ? 2 : window.devicePixelRatio;
const canvasTemp = document.createElement("canvas");
const ctxt = canvasTemp.getContext("2d");
const MutationObserver = window.MutationObserver;

interface Props{
  className?: string;
  imgSrc?: string;
  children?: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom" | "grid9";
  rowRepeat?: number;
  split?: [number?, number?, number?, number?];
  repeatType?: "stretch" | "tile";
  withReverse?: boolean;
  [key:string]: any;
}

export default memo(({
  children,
  imgSrc,
  className,
  direction = "bottom",
  rowRepeat = 1,
  split: [s1, s2, s3, s4] = [],
  repeatType = "stretch",
  withReverse = false,
  ...other
}: Props) => {
  
  const canvasRef = useRef(document.createElement("canvas"));
  const wrapRef = useRef(document.createElement("div"));
  const innerRef = useRef(document.createElement("div"));
  let sp = useRef([s1 || 8, s2 || s1 && 12 - s1 / 2 || 8, s3 || 8, s4 || s3 && 12 - s3 / 2 || 8]);
  const imgRef = useRef(new Image());
  const timer = useRef(-1);
  const observer = useRef(new MutationObserver(() => null));
  const old = useRef({w: 0, h: 0});

  const draw = (force?: any): void => {
    const { current: wrap } = wrapRef;
    const { current: canvas } = canvasRef;
    const { current: img } = imgRef;
    const { current: [sp1, sp2, sp3, sp4] } = sp;
    const ctx = canvas.getContext("2d");
    const ww = wrap.clientWidth, wh = wrap.clientHeight;
    if(!imgSrc || !ww || !wh || !img.width || !img.height) return;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if(old.current.w === ww && old.current.h === wh && force !== true) return;
      old.current.w = ww;
      old.current.h = wh;
      const cw = ww * dpr, ch = wh * dpr, iw = img.width, ih = img.height;
      canvas.width = cw;
      canvas.height = ch;
      const ratioX = iw / cw;
      const ratioY = ih / ch;
      const rheight = Math.floor(ih / ratioX);
      const rwidth = Math.floor(iw / ratioY);
      switch(direction){
        case "top":
          ctx.drawImage(img, 0, 0, iw, ih, 0, ch - rheight, cw, rheight);
          if(!rowRepeat) return;
          canvasTemp.width = cw;
          canvasTemp.height = dpr * rowRepeat;
          if(withReverse){
            canvasTemp.height = 2 * dpr * rowRepeat;
            ctxt.save();
            ctxt.translate(0, dpr * rowRepeat);
            ctxt.scale(1, -1);
            ctxt.drawImage(img, 0, 0, iw, ratioX * dpr * rowRepeat, 0, 0, cw, dpr * rowRepeat);
            ctxt.restore();
          }
          ctxt.drawImage(img, 0, 0, iw, ratioX * dpr * rowRepeat, 0, withReverse ? dpr * rowRepeat : 0, cw, dpr * rowRepeat);
          ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-y');
          ctx.beginPath();
          ctx.rect(0, 0, cw, ch - rheight);
          ctx.closePath();
          ctx.save();
          ctx.translate(0, ch - rheight - dpr * rowRepeat);
          ctx.fill();
          ctx.restore();
        break;
        case "right":
          ctx.drawImage(img, 0, 0, iw, ih, 0, 0, rwidth, ch);
          if(!rowRepeat) return;
          canvasTemp.height = ch;
          canvasTemp.width = dpr * rowRepeat;
          if(withReverse){
            canvasTemp.width = 2 * dpr * rowRepeat;
            ctxt.save();
            ctxt.translate(dpr * rowRepeat, 0);
            ctxt.scale(-1, 1);
            ctxt.drawImage(img, iw - ratioY * dpr * rowRepeat, 0, ratioY * dpr * rowRepeat, ih, 0, 0, dpr * rowRepeat, canvasTemp.height);
            ctxt.restore();
          }
          ctxt.drawImage(img, iw - ratioY * dpr * rowRepeat, 0, ratioY * dpr * rowRepeat, ih, withReverse ? dpr * rowRepeat : 0, 0, dpr * rowRepeat, canvasTemp.height);
          ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-x');
          ctx.beginPath();
          ctx.rect(rwidth, 0, cw - rwidth, ch);
          ctx.closePath();
          ctx.save();
          ctx.translate(rwidth, 0);
          ctx.fill();
          ctx.restore();
        break;
        case "left":
          ctx.drawImage(img, 0, 0, iw, ih, cw - rwidth, 0, rwidth, ch);
          if(!rowRepeat) return;
          canvasTemp.height = ch;
          canvasTemp.width = dpr * rowRepeat;
          if(withReverse){
            canvasTemp.width = 2 * dpr * rowRepeat;
            ctxt.save();
            ctxt.translate(dpr * rowRepeat, 0);
            ctxt.scale(-1, 1);
            ctxt.drawImage(img, 0, 0, ratioY * dpr * rowRepeat, ih, 0, 0, dpr * rowRepeat, ch);
            ctxt.restore();
          }
          ctxt.drawImage(img, 0, 0, ratioY * dpr * rowRepeat, ih, withReverse ? dpr * rowRepeat : 0, 0, dpr * rowRepeat, ch);
          ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-x');
          ctx.beginPath();
          ctx.rect(0, 0, cw - rwidth, ch);
          ctx.closePath();
          ctx.save();
          ctx.translate(cw - rwidth - dpr * rowRepeat, 0);
          ctx.fill();
          ctx.restore();
        break;
        case "grid9":
          const isDx = cw * ratioY <= iw, isBig = isDx ? iw >= cw : ih >= ch;
          const spx1 = Math.floor(iw * sp1 / 24), spx2 = Math.floor(iw * (sp1 + sp2) / 24),
                spx3 = Math.floor(ih * sp3 / 24), spx4 = Math.floor(ih * (sp3 + sp4) / 24),
                scpx1 = Math.floor(spx1 / ratioY), scpx2 =  Math.floor(cw - iw * (24 - sp1 - sp2) / 24 / ratioY),
                scpx3 = Math.floor(spx3 / ratioX), scpx4 =  Math.floor(ch - ih * (24 - sp3 - sp4) / 24 / ratioX),
                sctpxw = Math.floor((spx2 - spx1) / ratioY), sctpxh = Math.floor((spx4 - spx3) / ratioX);
          if(isBig){
            if(isDx){
              ctx.drawImage(img, 0, 0, iw, spx3, 0, 0, cw, scpx3);
              ctx.drawImage(img, 0, spx4, iw, ih - spx4, 0, scpx4, cw, ch - scpx4);
              if(repeatType === "tile"){
                canvasTemp.height = sctpxh;
                canvasTemp.width = cw;
                ctxt.drawImage(img, 0, spx3, iw, spx4 - spx3, 0, 0, cw, sctpxh);
                ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-y');
                ctx.rect(0, scpx3, cw, scpx4 - scpx3);
                ctx.save();
                ctx.translate(0, scpx3 + ((scpx4 - scpx3) % ((spx4 - spx3) / ratioX)) / 2);
                ctx.fill();
                ctx.restore();
              }else{
                ctx.drawImage(img, 0, spx3, iw, spx4 - spx3, 0, scpx3, cw, scpx4 - scpx3);
              }
            }else{
              ctx.drawImage(img, 0, 0, spx1, ih, 0, 0, scpx1, ch);
              ctx.drawImage(img, spx2, 0, iw - spx2, ih, scpx2, 0, cw - scpx2, ch);
              if(repeatType === "tile"){
                canvasTemp.width = sctpxw;
                canvasTemp.height = ch;
                ctxt.drawImage(img, spx1, 0, spx2 - spx1, ih, 0, 0, scpx2 - scpx1, ch);
                ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-x');
                ctx.rect(scpx1, 0, scpx2 - scpx1, ch);
                ctx.save();
                ctx.translate(scpx1 + ((scpx2 - scpx1) % ((spx2 - spx1) / ratioY)) / 2, 0);
                ctx.fill();
                ctx.restore();
              }else{
                ctx.drawImage(img, spx1, 0, spx2 - spx1, ih, scpx1, 0, scpx2 - scpx1, ch);
              }
            }
          }else{
            ctx.drawImage(img, 0, 0, spx1, spx3, 0, 0, spx1, spx3);
            ctx.drawImage(img, spx2, 0, iw - spx2, spx3, cw - iw + spx2, 0, iw - spx2, spx3);
            ctx.drawImage(img, 0, spx4, spx1, ih - spx4, 0, ch - ih + spx4, spx1, ih - spx4);
            ctx.drawImage(img, spx2, spx4, iw - spx2, ih - spx4, cw - iw + spx2, ch - ih + spx4, iw - spx2, ih - spx4);
            if(repeatType === "tile"){
              canvasTemp.width = spx2 - spx1;
              canvasTemp.height = spx3;
              ctxt.drawImage(img, spx1, 0, spx2 - spx1, spx3, 0, 0, spx2 - spx1, spx3);
              ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-x');
              ctx.beginPath();
              ctx.rect(spx1, 0, cw - iw + spx2 - spx1, spx3);
              ctx.closePath();
              ctx.save();
              ctx.translate(spx1 + ((cw - iw + spx2 - spx1) % (spx2 - spx1)) / 2, 0);
              ctx.fill();
              ctx.restore();
              canvasTemp.height = ih - spx4;
              ctxt.drawImage(img, spx1, spx4, spx2 - spx1, ih - spx4, 0, 0, spx2 - spx1, ih - spx4);
              ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-x');
              ctx.beginPath();
              ctx.rect(spx1, ch - ih + spx4, cw - iw + spx2 - spx1, ih - spx4);
              ctx.closePath();
              ctx.save();
              ctx.translate(spx1 + ((cw - iw + spx2 - spx1) % (spx2 - spx1)) / 2, ch - ih + spx4);
              ctx.fill();
              ctx.restore();
              canvasTemp.width = spx1;
              canvasTemp.height = spx4 - spx3;
              ctxt.drawImage(img, 0, spx3, spx1, spx4 - spx3, 0, 0, spx1, spx4 - spx3);
              ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-y');
              ctx.beginPath();
              ctx.rect(0, spx3, spx1, ch - ih + spx4 - spx3);
              ctx.closePath();
              ctx.save();
              ctx.translate(0, spx3 + ((ch - ih + spx4 - spx3) % (spx4 - spx3)) / 2);
              ctx.fill();
              ctx.restore();
              canvasTemp.width = iw - spx2;
              ctxt.drawImage(img, spx2, spx3, iw - spx2, spx4 - spx3, 0, 0, iw - spx2, spx4 - spx3);
              ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-y');
              ctx.beginPath();
              ctx.rect(cw - iw + spx2, spx3, iw - spx2, ch - ih + spx4 - spx3);
              ctx.closePath();
              ctx.save();
              ctx.translate(cw - iw + spx2, spx3 + ((ch - ih + spx4 - spx3) % (spx4 - spx3)) / 2);
              ctx.fill();
              ctx.restore();
              canvasTemp.width = spx2 - spx1;
              canvasTemp.height = spx4 - spx3;
              ctxt.drawImage(img, spx1, spx3, spx2 - spx1, spx4 - spx3, 0, 0, spx2 - spx1, spx4 - spx3);
              ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat');
              ctx.beginPath();
              ctx.rect(spx1, spx3, cw - iw + spx2 - spx1, ch - ih + spx4 - spx3);
              ctx.closePath();
              ctx.save();
              ctx.translate(spx1 + ((cw - iw + spx2 - spx1) % (spx2 - spx1)) / 2, spx3 + ((ch - ih + spx4 - spx3) % (spx4 - spx3)) / 2);
              ctx.fill();
              ctx.restore();
            }else{
              ctx.drawImage(img, spx1, 0, spx2 - spx1, spx3, spx1, 0, cw - iw + spx2 - spx1, spx3);
              ctx.drawImage(img, 0, spx3, spx1, spx4 - spx3, 0, spx3, spx1, ch - ih + spx4 - spx3);
              ctx.drawImage(img, spx1, spx3, spx2 - spx1, spx4 - spx3, spx1, spx3, cw - iw + spx2 - spx1, ch - ih + spx4 - spx3);
              ctx.drawImage(img, spx2, spx3, iw - spx2, spx4 - spx3, cw - iw + spx2, spx3, iw - spx2, ch - ih + spx4 - spx3);
              ctx.drawImage(img, spx1, spx4, spx2 - spx1, ih - spx4, spx1, ch - ih + spx4, cw - iw + spx2 - spx1, ih - spx4);
            }
          }
        break;
        default:
          ctx.drawImage(img, 0, 0, iw, ih, 0, 0, cw, rheight);
          if(!rowRepeat) return;
          canvasTemp.width = cw;
          canvasTemp.height = dpr * rowRepeat;
          if(withReverse){
            canvasTemp.height = 2 * dpr * rowRepeat;
            ctxt.save();
            ctxt.translate(0, dpr * rowRepeat);
            ctxt.scale(1, -1);
            ctxt.drawImage(img, 0, ih - ratioX * dpr * rowRepeat, iw, ratioX * dpr * rowRepeat, 0, 0, cw, dpr * rowRepeat);
            ctxt.restore();
          }
          ctxt.drawImage(img, 0, ih - ratioX * dpr * rowRepeat, iw, ratioX * dpr * rowRepeat, 0, withReverse ? dpr * rowRepeat : 0, cw, dpr * rowRepeat);
          ctx.fillStyle = ctx.createPattern(canvasTemp, 'repeat-y');
          ctx.beginPath();
          ctx.rect(0, rheight, cw, ch - rheight);
          ctx.closePath();
          ctx.save();
          ctx.translate(0, rheight);
          ctx.fill();
          ctx.restore();
        break;
      }
    }, 1000 / 24)
  }

  const listener = () => {
    observer.current = new MutationObserver(draw);
    observer.current.observe(wrapRef.current, { attributes: true });
    observer.current.observe(innerRef.current, { attributes: true, childList: true });
    const imgs = innerRef.current.getElementsByTagName("img");
    if(!!imgs.length){
      for(let item in imgs){
        imgs[item].removeEventListener("load", draw, false);
        imgs[item].addEventListener("load", draw, false);
      }
    }
  }

  const clearListener = () => {
    observer.current.disconnect()
    observer.current.takeRecords()
    observer.current = null
  }

  useLayoutEffect(() => {
    listener();
    draw();
    return clearListener
  }, [])

  useEffect(() => {
    clearListener();
    listener();
    imgRef.current.onload = () => draw(true);
    imgRef.current.src = imgSrc;
  }, [imgSrc])

  useEffect(() => {
    clearListener();
    listener();
    sp.current = [s1 || 8, s2 || s1 && 12 - s1 / 2 || 8, s3 || 8, s4 || s3 && 12 - s3 / 2 || 8];
    draw(true);
  }, [s1, s2, s3, s4])

  useEffect(() => {
    clearListener();
    listener();
    draw(true);
  }, [direction, rowRepeat, repeatType, withReverse, children])
  
  return <div className={`__imgExtend_wrap ${className}`} ref={wrapRef}>
    <canvas ref={canvasRef} className="__imgExtend_canvas"></canvas>
    <div className="__imgExtend_inner" {...other} ref={innerRef}>{children}</div>
  </div>
})