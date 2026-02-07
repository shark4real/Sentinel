import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err: any) {
    rootEl.innerHTML = `<div style="padding:40px;color:#ff6b6b;background:#0d1117;min-height:100vh;font-family:monospace"><h1>Sentinel Fatal Error</h1><pre>${err?.message || err}</pre></div>`;
  }
}
