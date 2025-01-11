/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/react/src/jsx.ts
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
  Type,
  Ref,
  Key,
  Props,
  ReactElementType,
  ElementType
} from 'shared/ReactTypes';

const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'mini'
  };
  return element;
};

/* 
输入示例:
jsx('div', { key: 'uniqueKey', ref: someRef }, 'Child 1', 'Child 2')

输出示例:
{
	$$typeof: REACT_ELEMENT_TYPE,
	type: 'div',
	key: 'uniqueKey',
	ref: someRef,
	props: {
		children: ['Child 1', 'Child 2']
		__mark: 'mini'
	}
}
*/
export const jsx = (type: ElementType, config: any, ...children: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  const childrenLength = children.length;
  if (childrenLength) {
    if (childrenLength === 1) {
      props.children = children[0];
    } else {
      props.children = children;
    }
  }
  return ReactElement(type, key, ref, props);
};

/* 
输入示例:
jsxDEV('div', { key: 'uniqueKey', ref: someRef, className: 'my-class' })

输出示例:
{
	$$typeof: REACT_ELEMENT_TYPE,
	type: 'div',
	key: 'uniqueKey',
	ref: someRef,
	props: {
		className: 'my-class'
	}
}
*/
/** 开发环境不处理 children 参数，方便多做一些额外的检查 */
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  return ReactElement(type, key, ref, props);
};
