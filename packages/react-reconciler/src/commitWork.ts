// packages/react-reconciler/src/commitWork.ts
import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import {
  ChildDeletion,
  MutationMask,
  NoFlags,
  Placement,
  Update
} from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

/**
 * 负责深度优先遍历 Fiber 树，递归地向下寻找子节点是否存在 Mutation 阶段需要执行的 flags，
 * 如果遍历到某个节点，其所有子节点都不存在 flags（即 subtreeFlags == NoFlags），
 * 则停止向下，调用 commitMutationEffectsOnFiber 处理该节点的 flags，并且开始遍历其兄弟节点和父节点。
 *
 * commitMutationEffectsOnFiber 会根据每个节点的 flags 和更新计划中的信息执行相应的 DOM 操作。
 *
 * 以 Placement 为例：如果 Fiber 节点的标志中包含 Placement，表示需要在 DOM 中插入新元素，
 * 此时就需要取到该 Fiber 节点对应的 DOM，并将其插入对应的父 DOM 节点中。
 */
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;

  // 深度优先遍历 Fiber 树，寻找更新 flags
  while (nextEffect !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child;
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      // 子节点存在 mutation 阶段需要执行的 flags
      nextEffect = child;
    } else {
      // 子节点不存在 mutation 阶段需要执行的 flags 或没有子节点
      // 向上遍历
      up: while (nextEffect !== null) {
        // 处理 flags
        commitMutationEffectsOnFiber(nextEffect);

        const sibling: FiberNode | null = nextEffect.sibling;
        // 遍历兄弟节点
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }
        // 遍历父节点
        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
  if ((flags & Update) !== NoFlags) {
    // TODO Update
    finishedWork.flags &= ~Update;
  }
  if ((flags & ChildDeletion) !== NoFlags) {
    // TODO ChildDeletion
    finishedWork.flags &= ~ChildDeletion;
  }
};

// 执行 DOM 插入操作，将 FiberNode 对应的 DOM 插入 parent DOM 中
const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.log('执行 Placement 操作', finishedWork);
  }
  const hostParent = getHostParent(finishedWork);
  if (hostParent !== null) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent);
  }
};

// 获取 parent DOM
const getHostParent = (fiber: FiberNode): Container | null => {
  let parent = fiber.return;
  while (parent !== null) {
    const parentTag = parent.tag;
    // 处理 Root 节点
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    // 处理原生 DOM 元素节点
    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    } else {
      parent = parent.return;
    }
  }
  if (__DEV__) {
    console.warn('未找到 host parent', fiber);
  }
  return null;
};

const appendPlacementNodeIntoContainer = (
  finishedWork: FiberNode,
  hostParent: Container
) => {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
  } else {
    const child = finishedWork.child;
    if (child !== null) {
      appendPlacementNodeIntoContainer(child, hostParent);
      let sibling = child.sibling;
      while (sibling !== null) {
        appendPlacementNodeIntoContainer(sibling, hostParent);
        sibling = sibling.sibling;
      }
    }
  }
};
