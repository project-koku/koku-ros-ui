import './costDistribution.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Title, TitleSizes } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { createMapStateToProps } from 'store/common';
import { setCostDistribution } from 'utils/localStorage';

import { styles } from './costDistribution.styles';

interface CostDistributionOwnProps {
  costDistribution?: string;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
}

interface CostDistributionDispatchProps {
  // TBD...
}

interface CostDistributionStateProps {
  // TBD...
}

interface CostDistributionState {
  isSelectOpen: boolean;
}

interface CostDistributionOption extends SelectOptionObject {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostDistributionProps = CostDistributionOwnProps &
  CostDistributionDispatchProps &
  CostDistributionStateProps &
  WrappedComponentProps;

const costDistributionOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.costDistributionType, value: ComputedReportItemValueType.distributed },
  { label: messages.costDistributionType, value: ComputedReportItemValueType.total },
];

class CostDistributionBase extends React.Component<CostDistributionProps, CostDistributionState> {
  protected defaultState: CostDistributionState = {
    isSelectOpen: false,
  };
  public state: CostDistributionState = { ...this.defaultState };

  private getSelect = () => {
    const { costDistribution, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostDistributionOption) => option.value === costDistribution);

    return (
      <Select
        className="selectOverride"
        id="costDistributionSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={(_evt, value) => this.handleSelect(value)}
        onToggle={(_evt, isExpanded) => this.handleToggle(isExpanded)}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption description={option.desc} key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getSelectOptions = (): CostDistributionOption[] => {
    const { intl } = this.props;

    const options: CostDistributionOption[] = [];

    costDistributionOptions.map(option => {
      options.push({
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return options;
  };

  private handleSelect = (selection: CostDistributionOption) => {
    const { onSelect } = this.props;

    setCostDistribution(selection.value); // Set cost distribution in local storage

    this.setState(
      {
        isSelectOpen: false,
      },
      () => {
        if (onSelect) {
          onSelect(selection.value);
        }
      }
    );
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

    return (
      <div style={styles.selector}>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.label}>
          {intl.formatMessage(messages.costDistributionLabel)}
        </Title>
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostDistributionOwnProps, CostDistributionStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CostDistributionDispatchProps = {
  // TBD...
};

const CostDistributionConnect = connect(mapStateToProps, mapDispatchToProps)(CostDistributionBase);
const CostDistribution = injectIntl(CostDistributionConnect);

export default CostDistribution;
