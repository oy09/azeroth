const fieldProps = ['valueType', 'request', 'plain', 'renderFormItem', 'render', 'text', 'formItemProps', 'valueEnum'];

const formProps = ['fieldProps', 'isDefaultDom', 'groupProps', 'contentRender', 'submitterProps', 'submitter'];

const pickProps = (props: any) => {
  const propList = fieldProps.concat(formProps);

  const attrs: any = {};
  Object.keys(props || {}).forEach(key => {
    if (propList.includes(key)) {
      return;
    }
    attrs[key] = props[key];
  });

  return attrs;
};

export default pickProps;
