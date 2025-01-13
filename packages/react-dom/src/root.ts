import {
  createContainer,
  updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElementType } from 'shared/ReactTypes';
import { initEvent } from './SyntheticEvent';

/**
 * 实现 ReactDOM.createRoot(root).render(<App />);
 * createContainer 函数: 用于创建一个新的容器（container），该容器包含了 React 应用的根节点以及与之相关的一些配置信息。
 * updateContainer 函数: 用于更新已经存在的容器中的内容，将新的 React 元素（element）渲染到容器中，并更新整个应用的状态。
 * @param container
 * @returns
 */
export function createRoot(container: Container) {
  const root = createContainer(container);
  return {
    render(element: ReactElementType) {
      initEvent(container, 'click');
      return updateContainer(element, root);
    }
  };
}
