import type { GcpHistoricalDataWidget } from './gcpHistoricalDataCommon';
import { computeUsageWidget, costWidget, storageUsageWidget } from './gcpHistoricalDataWidgets';

export type GcpHistoricalDataState = Readonly<{
  widgets: Record<number, GcpHistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: GcpHistoricalDataState = {
  currentWidgets: [costWidget.id, computeUsageWidget.id, storageUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [computeUsageWidget.id]: computeUsageWidget,
    [storageUsageWidget.id]: storageUsageWidget,
  },
};

export function gcpHistoricalDataReducer(state = defaultState): GcpHistoricalDataState {
  return state;
}
