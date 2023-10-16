import * as gcpOcpDashboardActions from './gcpOcpDashboardActions';
import type { GcpOcpDashboardWidget } from './gcpOcpDashboardCommon';
import { gcpOcpDashboardStateKey, GcpOcpDashboardTab } from './gcpOcpDashboardCommon';
import { gcpOcpDashboardReducer } from './gcpOcpDashboardReducer';
import * as gcpOcpDashboardSelectors from './gcpOcpDashboardSelectors';

export type { GcpOcpDashboardWidget };
export {
  gcpOcpDashboardStateKey,
  gcpOcpDashboardReducer,
  gcpOcpDashboardActions,
  gcpOcpDashboardSelectors,
  GcpOcpDashboardTab,
};
