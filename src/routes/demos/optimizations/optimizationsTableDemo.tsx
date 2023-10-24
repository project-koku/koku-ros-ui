import { PageSection } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';
import { formatPath } from 'utils/paths';
import { useLocation } from 'react-router-dom';
import { parseQuery, Query } from 'api/queries/query';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';

interface OptimizationsDetailsDemoOwnProps {
  // TBD...
}

type OptimizationsDetailsDemoProps = OptimizationsDetailsDemoOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const OptimizationsDetailsDemo: React.FC<OptimizationsDetailsDemoProps> = () => {
  const intl = useIntl();
  const queryFromRoute = useQueryFromRoute();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  return (
    <PageSection isFilled>
      <OptimizationsTable
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
        breadcrumbPath={formatPath(`${routes.optimizationsTable.path}${location.search}`)}
        groupBy={groupBy || 'project'}
        groupByValue={groupByValue || 'openshift'}
        toPath={formatPath(routes.optimizationsBreakdown.path)}
      />
    </PageSection>
  );
};

export default OptimizationsDetailsDemo;