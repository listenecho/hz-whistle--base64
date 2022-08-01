import React, { useState } from 'react';
import './style.css';

export default function ResizeLayout() {
  const [siderWidth, setSiderWidth] = useState(
    parseInt(localStorage.getItem('siderWidth')) || 150,
  );
  const [dragging, setDragging] = useState(false);
  const [startPageX, setStartPageX] = useState(0);
  const pxWidth = `${siderWidth}px`;
  const handleMouseDown = (event: { pageX: React.SetStateAction<number>; }) => {
    setStartPageX(event.pageX);
    setDragging(true);
  };
  const handleMouseMove = (event: { pageX: React.SetStateAction<number>; }) => {
    //@
    const currentSiderWidth = siderWidth + event.pageX - startPageX;
    setSiderWidth(currentSiderWidth);
    setStartPageX(event.pageX);
  };
  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem('siderWidth', siderWidth);
  };
  return (
    <div className="layout" style={{ paddingLeft: pxWidth }}>
      <div className="sider" style={{ width: pxWidth }}>
        sider
      </div>
      <div className="header">header</div>
      <div className="content">content</div>
      <div
        className="sider-resizer"
        style={{ left: pxWidth }}
        onMouseDown={handleMouseDown}
      >
        {dragging && (
          <div
            className="resize-mask"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        )}
      </div>
    </div>
  );
}

作者：荷包蛋卷
链接：https://juejin.cn/post/6992833914104463367
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。