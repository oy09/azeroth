import React from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal';

export interface DialogProps extends ModalProps {}

const Dialog: React.FC<DialogProps> = props => {
  const { title, visible, onCancel, width } = props;

  return (
    <Modal destroyOnClose title={title} width={width || '70%'} visible={visible} onCancel={onCancel} footer={null} {...props}>
      {props.children}
    </Modal>
  );
};

export default Dialog;
