import './pvcModal.scss';

import { Modal } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { PvcContent } from './pvcContent';

interface PvcModalOwnProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  title?: string;
}

type PvcModalProps = PvcModalOwnProps & WrappedComponentProps;

class PvcModalBase extends React.Component<PvcModalProps, any> {
  constructor(props: PvcModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: PvcModalProps) {
    const { isOpen } = this.props;
    return nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { isOpen, title } = this.props;

    return (
      <Modal className="modalOverride" isOpen={isOpen} onClose={this.handleClose} title={title} width={'50%'}>
        <PvcContent />
      </Modal>
    );
  }
}

const PvcModal = injectIntl(PvcModalBase);

export { PvcModal };
