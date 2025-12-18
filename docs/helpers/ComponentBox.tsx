import React from 'react';

// A box where to render the component inside
export const ComponentBox = ({ children }: { children: any }) => {
  return (
    <div style={{
      border: '1px solid #E0E0E0',
      borderRadius: '4px',
      padding: '16px',
      marginBottom: '16px',
      marginTop: '20px',
      backgroundColor: '#fff'
    }}>
      {children}
    </div>
  );
}
