// packages/react-reconciler/src/completeWork.ts
import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags';
import { NoFlags, Update } from './fiberFlags';
import { updateFiberProps } from 'react-dom/src/SyntheticEvent';

// 生成更新计划，计算和收集更新 flags
export const completeWork = (workInProgress: FiberNode) => {
  const newProps = workInProgress.pendingProps;
  const current = workInProgress.alternate;
  switch (workInProgress.tag) {
    case HostRoot:
    case FunctionComponent:
    case Fragment:
      bubbleProperties(workInProgress);
      return null;

    case HostComponent:
      if (current !== null && workInProgress.stateNode !== null) {
        // 组件的更新阶段
        updateHostComponent(current, workInProgress);
      } else {
        // 首屏渲染阶段
        // 构建 DOM
        const instance = createInstance(workInProgress.type, newProps);
        // 将 DOM 插入到 DOM 树中
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      // 收集更新 flags
      bubbleProperties(workInProgress);
      return null;

    case HostText:
      if (current !== null && workInProgress.stateNode !== null) {
        // 组件的更新阶段
        updateHostText(current, workInProgress);
      } else {
        // 首屏渲染阶段
        // 构建 DOM
        const instance = createTextInstance(newProps.content);
        workInProgress.stateNode = instance;
      }
      // 收集更新 flags
      bubbleProperties(workInProgress);
      return null;

    default:
      if (__DEV__) {
        console.warn('completeWork 未实现的类型', workInProgress);
      }
      return null;
  }
};

function updateHostText(current: FiberNode, workInProgress: FiberNode) {
  const oldText = current.memoizedProps.content;
  const newText = workInProgress.pendingProps.content;
  if (oldText !== newText) {
    markUpdate(workInProgress);
  }
}

function updateHostComponent(current: FiberNode, workInProgress: FiberNode) {
  const oldProps = current.memoizedProps;
  const newProps = workInProgress.pendingProps;

  if (oldProps !== newProps) {
    markUpdate(workInProgress);
  }
  updateFiberProps(workInProgress.stateNode, newProps);
}

// 为 Fiber 节点增加 Update flags
function markUpdate(workInProgress: FiberNode) {
  workInProgress.flags |= Update;
}

/**
 * 负责递归地将组件的子节点添加到指定的 parent 中，
 * 它通过深度优先遍历 workInProgress 的子节点链表，处理每个子节点的类型。
 * 先处理当前节点的所有子节点，再处理兄弟节点。
 *
 * 如果它是原生 DOM 元素节点或文本节点，则将其添加到父节点中；如果是其他类型的组件节点并且有子节点，则递归处理其子节点。
 */
function appendAllChildren(parent: Container, workInProgress: FiberNode) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag == HostComponent || node.tag == HostText) {
      // 处理原生 DOM 元素节点或文本节点
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 递归处理其他类型的组件节点的子节点
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node == workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    // 处理下一个兄弟节点
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

/**
 * 负责在 completeWork 函数向上遍历的过程中，通过向上冒泡子节点的 flags，将所有更新 flags 收集到根节点。
 * 从当前需要冒泡属性的 Fiber 节点开始，检查是否有需要冒泡的属性。
 * 如果当前节点有需要冒泡的属性，将这些属性冒泡到父节点的 subtreeFlags 或其他适当的属性中。
 * 递归调用 bubbleProperties 函数，处理父节点，将属性继续冒泡到更上层的祖先节点，直至达到根节点。
 */
function bubbleProperties(workInProgress: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = workInProgress.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = workInProgress;
    child = child.sibling;
  }

  workInProgress.subtreeFlags |= subtreeFlags;
}
