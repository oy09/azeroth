## 关于自动表单组件思考

1. 基于AzColumnType类型配置，自动渲染表单组件
    - 配置有组件类型 valueType
    - 配置有表单组件属性 透传 fieldProps，应用于各种类型组件 select, input, radio, checkbox, ...
    - 配置有表单项属性 透传 formItemProps, 应用于Form.Item
    - 配置有可见状态 hideXX，这里的`可见状态`是指在UI上不显示，最终表单提交时该字段存在，例如XXID，不需要编辑，但提交时需要有
2. 表单有3个事件接口
    - onCancel(取消)
    - onSubmit(确认)
    - onReset(重置)
3. 表单有props
    - initialValue(初始值)
4. 表单渲染 从上到下渲染，位置没有指定，则按列表顺序


## 伪代码
```
<SchemaForm
  initialValue={xxx}
  fields={columns}
  onCancel={xx}
  onSubmit={xx}
  onReset={xx}
/>
```
