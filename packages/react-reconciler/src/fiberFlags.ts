// packages/react-reconciler/src/fiberFlags.ts
export type Flags = number;

export const NoFlags = 0b0000000; // 0
export const PerformedWork = 0b0000001; // 1
export const Placement = 0b0000010; // 2
export const Update = 0b0000100; // 4
export const ChildDeletion = 0b0001000; // 8
export const PassiveEffect = 0b0010000; // 16 Fiber 节点本次更新存在副作用

export const MutationMask = Placement | Update | ChildDeletion;

// useEffect 的依赖变化时，或函数组件卸载时，执行回调
export const PassiveMask = PassiveEffect | ChildDeletion;
