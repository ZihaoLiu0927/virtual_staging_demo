import React, { useCallback } from 'react';
import { Table } from './Table';

export const Toolbar = ({ setIsDragging, setDraggedItem, isDragging }) => {
  const handleToolbarItemClick = useCallback((itemType) => {
    if (isDragging) return;
    
    setIsDragging(true);
    setDraggedItem(itemType);
  }, [isDragging, setIsDragging, setDraggedItem]);

  return (
    <div className="toolbar">
      <div 
        className="toolbar-item"
        onClick={() => handleToolbarItemClick('table')}
      >
        <div className="preview">
          <img src="/models/table/table.png" alt="Table" />
        </div>
      </div>

      <div 
        className="toolbar-item"
        onClick={() => handleToolbarItemClick('chair')}
      >
        <div className="preview">
          <img src="/models/chair/chair.png" alt="Chair" />
        </div>
      </div>
    </div>
  );
}; 