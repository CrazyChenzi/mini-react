/* eslint-disable @typescript-eslint/no-explicit-any */

import { FiberNode } from 'react-reconciler/src/fiber';
import { HostComponent, HostText } from 'react-reconciler/src/workTags';
import { DOMElement, updateFiberProps } from './SyntheticEvent';

// packages/react-dom/scr/hostConfig.ts
export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

export const createInstance = (type: string, porps: any): Instance => {
  const element = document.createElement(type);
  updateFiberProps(element as unknown as DOMElement, porps);
  return element;
};

export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.appendChild(child);
};

export const insertChildToContainer = (
  child: Instance,
  container: Container,
  before: Instance
) => {
  container.insertBefore(child, before);
};

export const createTextInstance = (content: string) => {
  const element = document.createTextNode(content);
  return element;
};

export const appendChildToContainer = (
  child: Instance,
  parent: Instance | Container
) => {
  parent.appendChild(child);
};

export const commitUpdate = (fiber: FiberNode) => {
  if (__DEV__) {
    console.log('执行 Update 操作', fiber);
  }
  switch (fiber.tag) {
    case HostComponent:
      return updateFiberProps(fiber.stateNode, fiber.memoizedProps);
    case HostText:
      const text = fiber.memoizedProps.content;
      commitTextUpdate(fiber.stateNode, text);
      break;
    default:
      if (__DEV__) {
        console.warn('未实现的 commitUpdate 类型', fiber);
      }
  }
};

export const commitTextUpdate = (
  textInstance: TextInstance,
  content: string
) => {
  textInstance.textContent = content;
};

export const removeChild = (
  child: Instance | TextInstance,
  container: Container
) => {
  container.removeChild(child);
};

export const scheduleMicroTask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof Promise === 'function'
      ? (callback: (...args: any) => void) =>
          Promise.resolve(null).then(callback)
      : setTimeout;
