import React from 'react';
import { createRoot } from 'react-dom/client';

const element = (
  <h1>
    Hello, <span>, world!</span>
  </h1>
);

/**
 * 创建一个Dom根节点
 */
const app = createRoot(document.getElementById('root') as Element);

app.render(element);

console.log('element', element);
console.log('app', app);
