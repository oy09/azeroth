import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

/**
 * react-dnd封装
 * 实现拖拽功能
 */

type DragItem = {
  index: number;
  id: string;
  type: string;
};

const ItemTypes = {
  id: 'DndItem',
};

export interface DndItemProps {
  id: any;
  index: number;
  move?: (dragIndex: number, hoverIndex: number) => void;
  end?: (id: string, dragIndex: number) => void;
}

const DndItem: React.FC<DndItemProps> = props => {
  const { id, index, move, end, children } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.id,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      // 拖动元素碰见自己终止
      if (dragIndex === hoverIndex) {
        return;
      }

      // 拖动元素的形状信息
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // 拖动元素Y轴中间值
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 位移信息
      const clientOffset = monitor.getClientOffset() || { y: 0 };

      // 拖动元素y值
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 判断边界，拖动超出最上一个元素
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 判断边界，拖动超出最后一个元素
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      if (move) {
        move(dragIndex, hoverIndex);
      }

      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag<any, any, any>({
    item: { type: ItemTypes.id, id, index },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end(item: DragItem) {
      if (!item) {
        return;
      }
      end && end(item.id, item.index);
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }}>
      {children}
    </div>
  );
};

export default DndItem;
