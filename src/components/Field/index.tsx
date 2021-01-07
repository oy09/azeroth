import React, { ComponentType, ForwardRefExoticComponent } from 'react';
import { Input, Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { omitUndefined } from '@/utils/stringUtils';
import { AzSchema } from '@/typing';
import LabelIconTip from '@/components/LabelIconTip';
import pickProps from './pickProps';

/**
 * 复合组件
 * 多表单组件集合
 */

export type FieldValueType =
  | 'textarea'
  | 'date'
  | 'option'
  | 'text'
  | 'index'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'code';

export type FieldValueObjectType = {
  type: 'progress' | 'money' | 'percent';
  status: 'normal' | 'active' | 'success' | 'exception' | undefined;
};

export type FieldMode = 'read' | 'update';

export type FieldTextType = string | number | React.ReactText[] | null;

export type AzFormFieldProps = AzSchema<string, FieldValueType | FieldValueObjectType, AzFormItemProps>;

export interface AzFormItemProps extends FormItemProps {
  placeholder?: string;
  disabled?: boolean;
  width?: number;
  fieldProps?: any;
  tooltip?: string;
  bordered?: boolean;
  label?: string;
  ref?: any;
  name?: React.ReactText[] | string | number;
  onChange?: (args?: any[]) => void;
}

/**
 * 包装标准Form类型组件，例如Input, Select, Radio, Checkbox
 * 返回的组件包含一层Form.Item 组件
 * @param Field Form 表单项组件
 * @param config
 */
export const createField = <P extends AzFormItemProps = any>(
  Field: ComponentType<P> | ForwardRefExoticComponent<P>,
  config?: any,
) => {
  const FieldWithContext: React.FC<P> = props => {
    const { label, tooltip, placeholder, width, fieldProps, bordered, ...rest } = props;
    return (
      <Form.Item
        {...rest}
        // @ts-ignore
        title={label}
        label={label ? <LabelIconTip label={label} tooltip={tooltip} /> : undefined}
        valuePropName="value"
      >
        <Field {...(rest as P)} fieldProps={fieldProps} />
      </Form.Item>
    );
  };

  return FieldWithContext;
};

export type RenderProps = {
  emptyText?: React.ReactNode;
  mode?: any;
  value?: any;
  onChange?: (value?: any) => void;
  render?: any;
  renderFormItem?: any;
  fieldProps?: any;
  ref?: any;
  placeholder?: string;
  [key: string]: any;
};

export const defaultRenderNode = (text: FieldTextType, valueType: FieldValueType, props: RenderProps): React.ReactNode => {
  const { fieldProps } = props;

  return <Input {...fieldProps} />;
};

export interface AzFieldProps {
  text?: FieldTextType;
  valueType?: FieldValueType;
}

const AzField: React.ForwardRefRenderFunction<any, AzFieldProps & RenderProps> = (props, ref) => {
  const { text = '', valueType = 'text', onChange, value, ...rest } = props;

  const fieldProps = (value || onChange || rest?.fieldProps) && {
    value,
    onChange,
    ...omitUndefined(rest?.fieldProps),
  };

  return (
    <React.Fragment>
      {defaultRenderNode(text, valueType, {
        ...rest,
        mode: rest.mode || 'read',
        ref,
        placeholder: '请输入',
        fieldProps: pickProps(fieldProps),
      })}
    </React.Fragment>
  );
};

export default AzField;
