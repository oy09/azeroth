## 关于Dialog组件的思考
1. 基于antd modal封装的业务组件
2. 没有modal footer组件，使用外部的定义的按钮组
3. Dialog组件中的props.children持有Dialog组件的confirm, cancel
4. Modal只有cancel行为

## 伪代码
```
<Dialog
  visible={boolean}
  onCancel={fn}
  title={string}
  destroyOnClose={boolean}
  ...
>
  <AzForm
    form={xx}
    rules={xx}
    confirm={xx}
    validate={xx}
  >
  </AzForm>
</Dialog>
```
