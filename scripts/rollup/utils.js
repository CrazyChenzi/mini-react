// scripts/rollup/utils.js
import path from 'path';
import fs from 'fs';
import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');
/**
 * 解析包路径
 * @param {string} pkgName - 包名称
 * @param {boolean} [isDist=false] - 是否为dist路径
 * @returns {string} 解析后的包路径
 */
export function resolvePkgPath(pkgName, isDist) {
  // 如果是dist路径，返回dist目录下的包路径
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  // 返回packages目录下的包路径
  return `${pkgPath}/${pkgName}`;
}

/**
 * 获取包的package.json文件内容
 * @param {string} pkgName - 包名称
 * @returns {Object} 解析后的package.json对象
 */
export function getPackageJSON(pkgName) {
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
}

/**
 * 获取 Rollup 的基础插件配置
 * @param {Object} [options={}] - 配置选项
 * @param {Object} [options.typescript={}] - TypeScript 插件的配置选项
 * @returns {Array} 包含 Rollup 插件的数组
 */
export function getBaseRollupPlugins({
  alias = { __DEV__: true },
  typescript = {}
} = {}) {
  return [
    replace({
      ...alias,
      preventAssignment: true
    }),
    json(),
    cjs(),
    ts(typescript)
  ];
}
