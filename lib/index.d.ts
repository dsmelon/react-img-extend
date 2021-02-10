import React from 'react';
import './index.less';
interface Props {
    className?: string;
    imgSrc?: string;
    children?: React.ReactNode;
    direction?: "left" | "right" | "top" | "bottom" | "grid9";
    rowRepeat?: number;
    split?: [number?, number?, number?, number?];
    repeatType?: "stretch" | "tile";
    withReverse?: boolean;
    [key: string]: any;
}
declare const _default: React.MemoExoticComponent<({ children, imgSrc, className, direction, rowRepeat, split: [s1, s2, s3, s4], repeatType, withReverse, ...other }: Props) => JSX.Element>;
export default _default;
