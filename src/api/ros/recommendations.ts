import axios from 'axios';

import type { RosData, RosMeta, RosReport } from './ros';
import { RosType } from './ros';

export interface Notification {
  code?: number;
  message?: string;
  type?: string;
}

export interface RecommendationValue {
  amount?: number;
  format?: string;
}

export interface RecommendationValues {
  limits: {
    cpu?: RecommendationValue;
    memory?: RecommendationValue;
  };
  requests: {
    cpu?: RecommendationValue;
    memory?: RecommendationValue;
  };
}

export interface RecommendationEngine {
  config: RecommendationValues;
  pods_count?: number;
  variation: RecommendationValues;
}

export interface RecommendationTerm {
  duration_in_hours?: number;
  monitoring_start_time?: string;
  notifications?: {
    [key: string]: Notification;
  };
  recommendation_engines?: {
    cost: RecommendationEngine;
    performance: RecommendationEngine;
  };
}

export interface RecommendationTerms {
  long_term?: RecommendationTerm;
  medium_term?: RecommendationTerm;
  short_term?: RecommendationTerm;
}

export interface RecommendationItems {
  current?: RecommendationValues;
  monitoring_end_time?: string;
  notifications?: {
    [key: string]: Notification;
  };
  recommendation_terms?: RecommendationTerms;
}

export interface RecommendationReportData extends RosData {
  recommendations?: RecommendationItems;
}

export interface RecommendationReportMeta extends RosMeta {
  // TBD...
}

export interface RecommendationReport extends RosReport {
  meta: RecommendationReportMeta;
  data: RecommendationReportData[];
}

export const RosTypePaths: Partial<Record<RosType, string>> = {
  [RosType.ros]: 'recommendations/openshift',
};

// This fetches a recommendation by ID
export function runRosReport(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `/${query}` : '';
  return axios.get<RecommendationReport>(`${path}${queryString}`);
}

// This fetches a recommendations list
export function runRosReports(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `?${query}` : '';
  return axios.get<RecommendationReport>(`${path}${queryString}`);
}
