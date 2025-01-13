import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [count, setCount] = useState(1210);
  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
