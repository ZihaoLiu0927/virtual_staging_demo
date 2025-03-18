import React from 'react';

export const Loading = ({ progress }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 1000
    }}>
      <h2>Loading...</h2>
      <div style={{
        width: '200px',
        height: '20px',
        background: '#1a1a1a',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '20px 0'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#4CAF50',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <p>{Math.round(progress)}%</p>
    </div>
  );
}; 