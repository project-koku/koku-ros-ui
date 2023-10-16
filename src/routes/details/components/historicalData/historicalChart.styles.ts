import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const chartStyles = {
  chartHeight: 250,
};

export const styles = {
  chartContainer: {
    marginLeft: global_spacer_lg.value,
  },
  chartSkeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
  costChart: {
    marginBottom: global_spacer_sm.value,
    marginTop: global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  trendChart: {
    marginBottom: global_spacer_sm.value,
    marginTop: global_spacer_sm.value,
  },
  usageChart: {
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
