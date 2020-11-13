import React, { CSSProperties, useRef, useEffect, useCallback, useState, MutableRefObject } from 'react';
import classnames from 'classnames';
import { Form, Row, Col } from 'antd';
import { FormInstance, FormItemProps, FormProps } from 'antd/lib/form';
import { ButtonProps } from 'antd/lib/button';
import ResizeObserver from 'rc-resize-observer';
import Container from '@/components/Table/container';
import Field from '@/components/Field';
import LabelIconTip from '@/components/LabelIconTip';
import Actions from '@/components/Table/Actions';
import useMergedState from '@/utils/hooks/useMergedState';
import { IntlType } from '@/typing';
import { AzColumns } from '../Table';

import './Query.scss';

/**
 * FormFilter组件是内置于AzTable组件内部的，是一个默认实现的表格条件查询功能
 * 功能点：
 * 1. 根据columns配置自动创建条件查询表单
 * 2. 支持antd类型表单
 * 3. 可支持自定义配置
 * 4. ui响应式，自适应布局
 * 5. 查询功能（调用table action.reload）
 * 6. 重置表单功能
 */

export type SpanConfig =
  | number
  | {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };

const CONFIG_SPAN_BREAKPOINTS: { [key: string]: number } = {
  xs: 513,
  sm: 513,
  md: 785,
  lg: 1057,
  xl: 1057,
  xxl: Infinity,
};

const BREAKPOINTS: { [key: string]: Array<any> } = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    [Infinity, 4, 'vertical'],
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal'],
  ],
};

interface FormFieldRenderProps {
  item: AzColumns<any>;
  value?: any;
  form?: FormInstance;
  intl?: IntlType;
  hidden?: boolean;
  onChange?: (value: any) => void;
  onSelect?: (value: any) => void;
  labelFlexStyle?: string;
  [key: string]: any;
}

// 表单输入项萱蕚
export const formFieldRender: React.FC<FormFieldRenderProps> = props => {
  const { item, form, formItemProps, label, labelFlexStyle, hidden, ...rest } = props;
  const { valueType: itemValueType = 'text', valueEnum, tooltip, initialValue } = item;

  const valueType = typeof itemValueType === 'function' ? itemValueType({}) : itemValueType || 'text';

  const { onChange, ...restFieldProps } = item.fieldProps || {};

  // 表单项组件 根据valueType 渲染不同的表单项，是一个复合组件
  return (
    <Form.Item
      // @ts-ignore
      title={label}
      label={label ? <LabelIconTip label={label} tooltip={tooltip} /> : undefined}
      valuePropName="value"
      labelCol={{
        flex: labelFlexStyle,
      }}
      hidden={hidden}
      name={item.key || item.dataIndex}
      initialValue={initialValue}
      key={`${item.dataIndex || ''}-${item.key || ''}-${item.index}`}
    >
      <Field
        valueEnum={valueEnum}
        valueType={valueType}
        onChange={onChange}
        fieldProps={restFieldProps || item.formItemProps}
        {...rest}
      />
    </Form.Item>
  );
};

interface FormItemRenderProps {
  item: AzColumns<any>;
  intl?: IntlType;
  formInstance?: FormInstance;
  [key: string]: any;
}

// 表单项渲染
export const formItemRender = (props: FormItemRenderProps): any => {
  const { item, formInstance, ...reset } = props;
  const { formItemProps } = item;

  const getTitle = () => {
    if (item.title && typeof item.title === 'function') {
      return item.title(item, 'form', '');
    }
    return item.title;
  };
  const dom = formFieldRender({
    item,
    form: formInstance,
    label: getTitle(),
    ...reset,
    ...formItemProps,
  });

  if (!dom) {
    return null;
  }

  return dom;
};

const getSpanConfig = (
  layout: FormProps['layout'],
  width: number,
  span?: SpanConfig,
): { span: number; layout: FormProps['layout'] } => {
  if (span && typeof span === 'number') {
    return {
      span,
      layout,
    };
  }
  const spanConfig = span
    ? Object.keys(span).map(key => [CONFIG_SPAN_BREAKPOINTS[key], 24 / (span as any)[key], 'horizontal'])
    : BREAKPOINTS[layout || 'default'];
  const breakPoint = (spanConfig || BREAKPOINTS.default).find(item => width < item[0] + 16);

  return {
    span: 24 / breakPoint[1],
    layout: breakPoint[2],
  };
};

export interface SearchProps<T> extends Omit<FormItemProps, 'children' | 'onReset'> {
  style?: CSSProperties;
  className?: string;
  onSubmit?: (value: T) => void;
  onReset?: (value: T) => void;
  span?: SpanConfig;
  form?: Omit<FormProps, 'form'>;
  layout?: FormProps['layout'];
  formRef?: MutableRefObject<FormInstance | undefined> | ((actionRef: FormInstance) => void);
  prefix?: string;
  submitter?: any | false;
  resetText?: string;
  submitText?: string;
  labelWidth?: number | 'auto';
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  // 暂时没用到
  defaultColsNumber?: number;
  onCollapse?: (collapsed: boolean) => void;
}

const Query = <T,>(props: SearchProps<T>) => {
  const {
    style,
    className,
    formRef,
    layout,
    span,
    onSubmit,
    onReset,
    submitter,
    labelWidth = '80',
    prefix = 'az',
    collapsed: controlCollapsed,
    defaultCollapsed = false,
    onCollapse,
    submitText: propsSubmitText,
    resetText: propsResetText,
    form: formConfig = {},
  } = props;

  const defaultWidth = (typeof style?.width === 'number' ? style.width : 1024) as number;

  const [form] = Form.useForm();
  const formInstnace = useRef<FormInstance | undefined>(form);
  const [spanSize, setSpanSize] = useState<{
    span: number;
    layout: FormProps['layout'];
  }>(() => getSpanConfig(layout, defaultWidth + 16, span));
  // 展开/收起 条件表单
  const [collapsed, setCollapsed] = useMergedState<boolean>(() => !defaultCollapsed, {
    value: controlCollapsed,
    onChange: onCollapse,
  });
  // table 全局状态缓存
  const counter = Container.useContainer();
  const valueTypeRef = useRef<any>({});
  // 这么做是为了在用户修改了输入的时候触发一下子节点的render
  const [, updateState] = useState<undefined>();
  const forceUpdate = useCallback(() => updateState(undefined), []);
  // 过滤条件搜索按钮状态
  const [loading, setLoading] = useState<ButtonProps['loading']>(false);

  // 表单显示数量限制
  const showLength = Math.max(1, 24 / spanSize.span - 1);

  let labelFlexStyle: string = '';
  if (labelWidth && spanSize.layout !== 'vertical' && labelWidth !== 'auto') {
    labelFlexStyle = `0 0 ${labelWidth}px`;
  }

  // 提交表单
  const submit = async () => {
    const value = form.getFieldsValue();
    if (onSubmit) {
      /**
       * 未来在这里对最终值的转换
       */
      const finalValue = value;
      onSubmit && onSubmit(finalValue);
    }
  };

  // 初始化 将组件内form ref 传递给外部props
  useEffect(() => {
    if (!formRef) {
      return;
    }
    if (typeof formRef === 'function') {
      formRef(form);
    }
    if (formRef && typeof formRef !== 'function') {
      formRef.current = {
        ...form,
        submit: () => {
          submit();
          form.submit();
        },
      };
    }
  }, []);

  const defaultName = `${prefix}-query`;
  const classNames = classnames(defaultName, className, 'clearfix');

  const columnList = counter.azColumns
    .filter(item => {
      if (item.hideInSearch) {
        return false;
      }

      const { valueType } = item;
      if (valueType !== 'index' && valueType !== 'option' && (item.key || item.dataIndex)) {
        return true;
      }

      return false;
    })
    .sort((a, b) => {
      if (a && b) {
        return (b.order || 0) - (a.order || 0);
      }
      if (a && a.order) {
        return -1;
      }
      if (b && b.order) {
        return 1;
      }
      return 0;
    });
  const itemList = columnList
    .map((item, index) =>
      formItemRender({
        item: {
          key: item.dataIndex?.toString() || index,
          index: index,
          ...item,
        },
        formInstance: formInstnace.current,
        labelFlexStyle: labelFlexStyle,
      }),
    )
    .filter(item => !!item);
  const itemWithInfo: Array<{
    span: number;
    hidden: boolean;
    element: React.ReactNode;
    key: string | number;
  }> = [];

  let totalSpan = 0;
  itemList.forEach((item, index) => {
    let hidden = item?.props.hidden || false;
    const colSize = React.isValidElement<any>(item) ? item?.props.colSize || 1 : 1;
    // 12
    const colSpan = Math.min(spanSize.span * colSize, 24);
    if ((collapsed && index >= showLength) || hidden) {
      hidden = true;
    } else {
      if (24 - (totalSpan % 24) < colSpan) {
        totalSpan += 24 - (totalSpan % 24);
      }
      totalSpan += colSpan;
    }

    itemWithInfo.push({
      span: colSpan,
      element: item,
      key: React.isValidElement<any>(item) ? item.key || `${item?.props.name || index}-${index}` : index,
      hidden,
    });
  });

  const resetText = propsSubmitText || '重置';
  const submitText = propsResetText || '搜索';

  // console.log('itemWithInfo:', itemList)
  // console.log('itemWithInfo:', spanSize)

  return (
    <div className={classNames} style={style}>
      <Form
        {...formConfig}
        layout={spanSize.layout}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            form.submit();
          }
        }}
        form={form}
        onValuesChange={(change, all) => {
          forceUpdate();
          if (formConfig.onValuesChange) {
            formConfig.onValuesChange(change, all);
          }
        }}
        onFinish={async () => {
          setLoading({
            delay: 140,
          });
          await submit();
          setLoading(false);
        }}
      >
        <ResizeObserver
          onResize={({ width }) => {
            setSpanSize(getSpanConfig(layout, width, span));
          }}
        >
          <Row gutter={16} justify="start">
            {itemWithInfo.map((item, index) => {
              if (React.isValidElement(item.element) && item.hidden) {
                return React.cloneElement(item.element, {
                  hidden: true,
                  key: item.key || index,
                });
              }
              return (
                <Col key={item.key} span={item.span}>
                  {item.element}
                </Col>
              );
            })}
            {submitter !== false && (
              <Col span={spanSize.span} offset={24 - spanSize.span - (totalSpan % 24)} style={{ textAlign: 'right' }}>
                <Actions
                  form={form}
                  collapsed={collapsed}
                  onCollapsed={setCollapsed}
                  resetText={resetText}
                  submitText={submitText}
                  onReset={() => {
                    if (onReset) {
                      const value = form.getFieldsValue();
                      onReset(value);
                    }
                  }}
                  submitButtonProps={{
                    loading,
                  }}
                />
              </Col>
            )}
          </Row>
        </ResizeObserver>
      </Form>
    </div>
  );
};

export default Query;
