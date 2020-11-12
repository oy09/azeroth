import React, { useEffect } from 'react';

export interface ResizeObserverProps {
  onResize?: (width?: number) => void;
}

const ResizeObserver: React.FC<ResizeObserverProps> = props => {
  const { children } = props;

  useEffect(() => {
    window.addEventListener('resize', target => {
      console.log('resize:', target);
    });
  }, []);

  const childNodes = React.Children.toArray(children);

  if (childNodes.length > 1) {
    console.warn(`observer 组件 只能存在一个元素`);
  } else if (childNodes.length === 0) {
    console.warn(`observer组件没有子元素`);
    return null;
  }

  const childNode = childNodes[0];

  const dom =
    childNodes.length === 1
      ? childNode
      : childNodes.map((item: any, index) => {
          if (React.isValidElement(item) || ('key' in item && item.key != null)) {
            return item;
          }
          return React.cloneElement(item, { key: `az-observer-key-${index}` });
        });

  return <React.Fragment>{dom}</React.Fragment>;
};

export default ResizeObserver;
