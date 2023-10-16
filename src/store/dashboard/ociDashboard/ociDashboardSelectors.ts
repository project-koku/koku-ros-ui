import type { RootState } from 'store/rootReducer';
import { getCurrency } from 'utils/localStorage';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ociDashboardDefaultFilters,
  ociDashboardStateKey,
  ociDashboardTabFilters,
} from './ociDashboardCommon';

export const selectOciDashboardState = (state: RootState) => state[ociDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOciDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOciDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ociDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ociDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    currency: getCurrency(),
  };

  return {
    previous: getQueryForWidget(
      {
        ...(filter as any),
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(filter, props),
    forecast: getQueryForWidget({}, { limit: 31, ...props }),
    tabs: getQueryForWidgetTabs(
      widget,
      {
        ...(tabsFilter as any),
        resolution: 'monthly',
      },
      props
    ),
  };
};
