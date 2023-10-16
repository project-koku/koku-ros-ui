jest.mock('store/reports/reportActions');

import { ReportType } from 'api/reports/report';
import { ComputedReportItemType, DatumType } from 'routes/components/charts/common/chartDatum';
import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import * as actions from './rhelDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  rhelDashboardStateKey,
  RhelDashboardTab,
} from './rhelDashboardCommon';
import { rhelDashboardReducer } from './rhelDashboardReducer';
import * as selectors from './rhelDashboardSelectors';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './rhelDashboardWidgets';

const createRhelDashboardStore = createMockStoreCreator({
  [rhelDashboardStateKey]: rhelDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createRhelDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createRhelDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createRhelDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, RhelDashboardTab.projects));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(RhelDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(RhelDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(RhelDashboardTab.nodes)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(RhelDashboardTab.projects)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: ReportType.cost,
    availableTabs: [RhelDashboardTab.projects],
    currentTab: RhelDashboardTab.projects,
    details: { formatOptions: {} },
    trend: {
      computedReportItem: ComputedReportItemType.cost,
      datumType: DatumType.rolling,
      formatOptions: {},
      titleKey: '',
    },
    topItems: {
      formatOptions: {},
    },
  };

  [
    [
      undefined,
      'filter[resolution]=daily&filter[time_scope_units]=month&filter[time_scope_value]=-1&group_by[project]=*',
    ],
    [{}, 'group_by[project]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[project]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
