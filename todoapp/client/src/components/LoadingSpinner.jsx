import React from 'react';

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
}

export default LoadingSpinner;