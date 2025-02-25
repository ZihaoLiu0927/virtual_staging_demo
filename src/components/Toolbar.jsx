import React from 'react';
import { Table } from './Table';

export const Toolbar = ({ setIsDragging, setDraggedItem }) => {
  return (
    <div className="toolbar">
      <div 
        className="toolbar-item"
        onClick={() => {
          setIsDragging(true);
          setDraggedItem('table');
        }}
      >
        <div className="preview">
          <img src="/models/table/table.png" alt="Table" />
        </div>
      </div>

      <div 
        className="toolbar-item"
        onClick={() => {
          setIsDragging(true);
          setDraggedItem('chair');
        }}
      >
        <div className="preview">
          <img src="/models/chair/chair.png" alt="Chair" />
        </div>
      </div>
    </div>
  );
}; 