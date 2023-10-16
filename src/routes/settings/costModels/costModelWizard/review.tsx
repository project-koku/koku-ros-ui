import {
  Alert,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Icon,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OkIcon } from '@patternfly/react-icons/dist/esm/icons/ok-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RateTable } from 'routes/settings/costModels/components/rateTable';
import { WarningIcon } from 'routes/settings/costModels/components/warningIcon';
import { createMapStateToProps } from 'store/common';

import { CostModelContext } from './context';

const ReviewSuccessBase: React.FC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ onClose, name }) => (
      <EmptyState>
        <EmptyStateHeader
          titleText={<>{intl.formatMessage(messages.costModelsWizardReviewStatusTitle)}</>}
          icon={
            <Icon status="success">
              <EmptyStateIcon icon={OkIcon} />
            </Icon>
          }
          headingLevel="h2"
        />
        <EmptyStateBody>
          {intl.formatMessage(messages.costModelsWizardReviewStatusSubTitle, { value: name })}
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button variant="link" onClick={onClose}>
              {intl.formatMessage(messages.close)}
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    )}
  </CostModelContext.Consumer>
);

const ReviewSuccess = injectIntl(ReviewSuccessBase);

interface ReviewDetailsOwnProps extends WrappedComponentProps {
  // TBD...
}

interface ReviewDetailsStateProps {
  // TBD...
}

type ReviewDetailsProps = ReviewDetailsOwnProps & ReviewDetailsStateProps;

const ReviewDetailsBase: React.FC<ReviewDetailsProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({
      checked,
      createError,
      currencyUnits,
      description,
      distribution,
      distributePlatformUnallocated,
      distributeWorkerUnallocated,
      isDiscount,
      markup,
      name,
      tiers,
      type,
    }) => {
      const selectedSources = Object.keys(checked)
        .filter(key => checked[key].selected)
        .map(key => checked[key].meta);
      return (
        <>
          {createError && <Alert variant="danger" title={`${createError}`} />}
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl}>
                {intl.formatMessage(messages.costModelsWizardStepsReview)}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text>
                  {intl.formatMessage(messages.costModelsWizardReviewStatusSubDetails, {
                    create: <strong>{intl.formatMessage(messages.create)}</strong>,
                    back: <strong>{intl.formatMessage(messages.back)}</strong>,
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <TextList component={TextListVariants.dl}>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.names, { count: 1 })}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{name}</TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.description)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{description}</TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.currency)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {intl.formatMessage(messages.currencyOptions, { units: currencyUnits })}
                  </TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.priceList)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {tiers.length > 0 ? (
                          <RateTable tiers={tiers} />
                        ) : (
                          intl.formatMessage(messages.costModelsWizardNoRatesAdded)
                        )}
                      </TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.costModelsWizardReviewMarkDiscount)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {intl.formatMessage(messages.percent, { value: isDiscount ? '-' + markup : markup })}
                  </TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.costDistribution)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {intl.formatMessage(messages.distributionTypeDesc, { type: distribution })}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {intl.formatMessage(messages.distributeCosts, {
                          value: distributePlatformUnallocated,
                          type: 'platform',
                        })}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {intl.formatMessage(messages.distributeCosts, {
                          value: distributeWorkerUnallocated,
                          type: 'worker',
                        })}
                      </TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.costModelsAssignSources, { count: 2 })}{' '}
                    {selectedSources.find(src => Boolean(src.costmodel)) && (
                      <WarningIcon text={intl.formatMessage(messages.costModelsWizardWarningSources)} />
                    )}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {selectedSources.map(r => r.name).join(', ')}
                  </TextListItem>
                </TextList>
              </TextContent>
            </StackItem>
          </Stack>
        </>
      );
    }}
  </CostModelContext.Consumer>
);

const mapStateToProps = createMapStateToProps<undefined, ReviewDetailsStateProps>(() => {
  return {
    // TBD...
  };
});

const ReviewDetails = injectIntl(connect(mapStateToProps, {})(ReviewDetailsBase));

const ReviewWithDistribution = () => {
  return (
    <CostModelContext.Consumer>
      {({ createSuccess }) => {
        if (!createSuccess) {
          return <ReviewDetails />;
        }
        return <ReviewSuccess />;
      }}
    </CostModelContext.Consumer>
  );
};

export default ReviewWithDistribution;
