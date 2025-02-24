import React from 'react';
import { Table } from './Table';

export const Toolbar = () => {
  const onDragStart = (e, type) => {
    console.log('drag start', type);
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
    // 设置拖动图像（可选）
    const img = new Image();
    img.src = '/models/table/table.png';
    e.dataTransfer.setDragImage(img, 25, 25);
  };

  return (
    <div className="toolbar">
      <div 
        className="toolbar-item"
        draggable="true"
        onDragStart={(e) => onDragStart(e, 'table')}
        onDragEnd={() => console.log('drag end')}
      >
        <div className="preview">
          <img src="/models/table/table.png" alt="Table" />
        </div>
        <span>Table</span>
      </div>
    </div>
  );
}; 