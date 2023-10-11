import type { GcpQuery } from 'api/queries/gcpQuery';
import type { GcpReport, GcpReportItem } from 'api/reports/gcpReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedIbmReportItemsParams extends ComputedReportItemsParams<GcpReport, GcpReportItem> {}

export function getIdKeyForGroupBy(groupBy: GcpQuery['group_by'] = {}): ComputedIbmReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.project) {
    return 'project';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
