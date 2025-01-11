// packages/react-reconciler/src/fiberFlags.ts
export type Flags = number;

export const NoFlags = 0b0000000; // 0
export const PerformedWork = 0b0000001; // 1
export const Placement = 0b0000010; // 2
export const Update = 0b0000100; // 4
export const ChildDeletion = 0b0001000; // 8

export const MutationMask = Placement | Update | ChildDeletion;
