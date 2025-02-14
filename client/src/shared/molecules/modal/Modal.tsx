import React from 'react'
import classNames from 'classnames'
import { Modal as RsuiteModal, ModalProps } from 'rsuite'
import './modal.scss'

interface ReusableModalProps extends ModalProps {
  title: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  secondary?: boolean;
}

const Modal: React.FC<ReusableModalProps> = ({
  secondary,
  title,
  body,
  footer,
  size = 'sm',
  overflow = true,
  backdrop = 'static',
  keyboard = false,
  dialogClassName,
  ...rest
}) => {
  return (
    <RsuiteModal
      size={size}
      overflow={overflow}
      backdrop={backdrop}
      keyboard={keyboard}
      dialogClassName={classNames(dialogClassName, {
        'modal--secondary': secondary
      })}
      {...rest}
    >
      <RsuiteModal.Header>
        <RsuiteModal.Title>{title}</RsuiteModal.Title>
      </RsuiteModal.Header>
      <RsuiteModal.Body>{body}</RsuiteModal.Body>
      {footer && <RsuiteModal.Footer>{footer}</RsuiteModal.Footer>}
    </RsuiteModal>
  )
}

export default Modal
