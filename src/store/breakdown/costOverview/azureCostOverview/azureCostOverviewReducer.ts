import type { AzureCostOverviewWidget } from './azureCostOverviewCommon';
import {
  accountSummaryWidget,
  costWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './azureCostOverviewWidgets';

export type AzureCostOverviewState = Readonly<{
  widgets: Record<number, AzureCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureCostOverviewState = {
  currentWidgets: [costWidget.id, accountSummaryWidget.id, serviceSummaryWidget.id, regionSummaryWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function azureCostOverviewReducer(state = defaultState): AzureCostOverviewState {
  return state;
}
