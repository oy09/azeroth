import React, { useEffect, useRef } from 'react';
import { Select } from 'antd';
import { findDOMNode } from 'react-dom';
import { SelectProps, SelectValue } from 'antd/lib/select';
import Sortable from 'sortablejs';

export interface DragSelect extends SelectProps<SelectValue> {}

const DragSelect: React.FC<DragSelect> = props => {
  const elementRef = useRef<any>();
  const sortable = useRef<Sortable>();
  const itemElementList = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const selectElement = findDOMNode(elementRef.current) as HTMLElement;
    const selectorElement = selectElement.querySelector('.ant-select-selector') as HTMLElement;
    sortable.current = Sortable.create(selectorElement, {
      ghostClass: 'oy',
      onStart: event => console.log('start:', event),
      onEnd: event => console.log('end:', event),
    });

    return () => {
      sortable.current = undefined;
    };
  }, []);

  useEffect(() => {
    const selectElement = findDOMNode(elementRef.current) as HTMLElement;
    itemElementList.current = selectElement.querySelectorAll('.ant-select-selector .ant-select-selection-item') as any;
    itemElementList.current.forEach(item => {
      item.removeEventListener('mousedown', handleItemMousedownEvent);
    });
    itemElementList.current.forEach(item => {
      item.addEventListener('mousedown', handleItemMousedownEvent);
    });

    return () => {
      itemElementList.current.forEach(item => {
        item.removeEventListener('mousedown', handleItemMousedownEvent);
      });
    };
  }, [props.value]);

  const handleItemMousedownEvent = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Select {...props} ref={elementRef}>
      {props.children}
    </Select>
  );
};

export default DragSelect;
