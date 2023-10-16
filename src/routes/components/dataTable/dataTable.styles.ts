import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  costColumn: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
  defaultLabel: {
    minWidth: '50px',
  },
  emptyState: {
    backgroundColor: global_BackgroundColor_light_100.value,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: global_spacer_3xl.value,
    height: '35vh',
    width: '100%',
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: global_spacer_xs.value,
  },
  infoDescription: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
  },
  lastItem: {
    textAlign: 'right',
    paddingRight: '3.8rem',
  },
  lastItemColumn: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  managedColumn: {
    textAlign: 'right',
  },
  nameColumn: {
    width: '1%',
  },
  warningIcon: {
    paddingLeft: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
