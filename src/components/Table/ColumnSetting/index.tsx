import React, { CSSProperties, useRef } from 'react';
import classnames from 'classnames';
import { Popover, Checkbox } from 'antd';
import Icon, { SettingOutlined } from '@ant-design/icons';
import { AzColumns } from '@/components/Table/Table';
import { getColumnKey } from '@/components/Table/utils';
import Container, { ColumnState } from '@/components/Table/container';
import { ReactComponent as DragSvg } from '@/assets/svg/drag.svg';
import './ColumnSetting.scss';

/**
 * 管理Table Column 组件
 * 功能：
 * 1. 管理Column的可见状态
 * 2. 管理Column的显示顺序
 * 3. 管理Column 固有属性，例如固定列首，列尾
 */

export interface CheckboxListItemProps {
  className?: string;
  style?: CSSProperties;
  columnKey?: string | number;
  title?: React.ReactNode;
  columnsMap: {
    [key: string]: ColumnState;
  };
  setColumnsMap: (map: { [key: string]: ColumnState }) => void;
}

const CheckboxListItem: React.FC<CheckboxListItemProps> = props => {
  const { className, columnsMap, setColumnsMap, columnKey, title } = props;
  const config = columnsMap[columnKey || ''] || { show: true };

  return (
    <span className={`${className}-list-item`} key={columnKey}>
      <Icon component={DragSvg} style={{ paddingRight: 6, cursor: 'move', color: 'rgba(0, 0, 0, 0.45)' }} />
      <Checkbox
        onChange={e => {
          if (columnKey) {
            const tempConfig = columnsMap[columnKey] || {};
            const newSetting = { ...tempConfig };
            if (e.target.checked) {
              newSetting.show = true;
            } else {
              newSetting.show = false;
            }
            const columnsKeyMap = {
              ...columnsMap,
              [columnKey]: newSetting,
            };
            setColumnsMap(columnsKeyMap);
          }
        }}
        checked={config.show !== false}
      >
        {title}
      </Checkbox>
    </span>
  );
};

export interface CheckboxListProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  showTitle?: boolean;
  data?: AzColumns<any>[];
}

const CheckboxList: React.FC<CheckboxListProps> = props => {
  const { data, className } = props;
  const { columnsMap, setColumnsMap, sortKeyColumns, setSortKeyColumns } = Container.useContainer();

  const show = data && data.length > 0;
  if (!show) {
    return null;
  }

  const move = () => {
    //
  };

  const listDom = data?.map((item, index) => {
    const columnkey = getColumnKey(item.key, item.index);

    return (
      <div className="drag-wrap" key={columnkey}>
        <CheckboxListItem
          columnsMap={columnsMap}
          setColumnsMap={setColumnsMap}
          title={item.title}
          columnKey={columnkey}
          className={className}
        />
      </div>
    );
  });

  return <div className="drag-list">{listDom}</div>;
};

export interface GroupCheckboxListProps {
  columns: AzColumns<any>[];
  className?: string;
  style?: CSSProperties;
}

const GroupCheckboxList: React.FC<GroupCheckboxListProps> = props => {
  const { className, columns } = props;

  const classNames = classnames(`${className}-list`);

  return (
    <div className={classNames}>
      <CheckboxList data={columns} className={className} />
    </div>
  );
};

export interface ColumnSettingProps<T> {
  style?: CSSProperties;
  className?: string;
  columns?: AzColumns<T>[];
  prefix?: string;
}

const ColumnSetting = <T,>(props: ColumnSettingProps<T>) => {
  const { className, prefix = 'az' } = props;

  const columnRef = useRef({});
  const counter = Container.useContainer();
  // 申明类型中 'ellipsis' 不匹配
  const columns: Omit<AzColumns<any>, 'ellipsis'>[] = props.columns || counter.columns || [];

  const { columnsMap, setColumnsMap } = counter;

  const selectedKeys = Object.values(columnsMap).filter(item => !item || item.show === false);
  const indeterminate = selectedKeys.length > 0 && selectedKeys.length !== columns.length;

  const defaultName = `${prefix}-column-setting`;
  const classNames = classnames(defaultName, className);

  // 全选/取消全选
  const setAllSelectAction = (show: boolean = true) => {
    const columnKeyMap: { [key: string]: { show: boolean; fixed?: any } } = {};
    columns.forEach(item => {
      const columnKey = getColumnKey(item.key, item.index);
      if (columnKey) {
        columnKeyMap[columnKey] = {
          show,
        };
      }
    });
    setColumnsMap(columnKeyMap);
  };

  console.log('columnsMap:', columnsMap);

  return (
    <Popover
      arrowPointAtCenter
      title={
        <div className={`${defaultName}-title`}>
          <Checkbox
            indeterminate={indeterminate}
            checked={selectedKeys.length === 0 && selectedKeys.length !== columns.length}
            onChange={e => {
              if (e.target.checked) {
                // 全选
                setAllSelectAction();
              } else {
                // 取消全选
                setAllSelectAction(false);
              }
              // console.log('title check:', e)
            }}
          >
            列展示
          </Checkbox>
          <a>重置</a>
        </div>
      }
      overlayClassName={`${defaultName}-overlay`}
      trigger="click"
      placement="bottomRight"
      content={<GroupCheckboxList className={classNames} columns={columns} />}
    >
      <span>
        <SettingOutlined />
      </span>
    </Popover>
  );
};

export default ColumnSetting;
