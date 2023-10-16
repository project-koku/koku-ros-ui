import type { Query } from 'api/queries/query';
import { endOfMonth } from 'date-fns';
import {
  formatStartEndDate,
  getCurrentMonthDate,
  getLast30DaysDate,
  getLast60DaysDate,
  getLast90DaysDate,
} from 'utils/dates';

// The date range drop down has the options below (if today is Jan 18th…)
// eslint-disable-next-line no-shadow
export const enum DateRangeType {
  currentMonthToDate = 'current_month_to_date', // Current month (Jan 1 - Jan 18)
  custom = 'custom', // Any date range within the last 90 days, but no more than 65 days total for best API performance
  previousMonth = 'previous_month', // Previous and current month (Dec 1 - Dec 31)
  previousMonthToDate = 'previous_month_to_date', // Previous and current month (Dec 1 - Jan 18)
  lastNinetyDays = 'last_ninety_days', // Last 90 days
  lastSixtyDays = 'last_sixty_days', // Last 60 days (Nov 18 - Jan 17)
  lastThirtyDays = 'last_thirty_days', // Last 30 days (Dec 18 - Jan 17)
}

export const getDateRange = (dateRangeType: DateRangeType, isFormatted = true) => {
  const endDate = new Date();
  const startDate = new Date();
  let dateRange;

  switch (dateRangeType) {
    case DateRangeType.previousMonth:
      endDate.setDate(1); // Required to obtain correct month
      startDate.setDate(1); // Required to obtain correct month
      endDate.setMonth(endDate.getMonth() - 1);
      startDate.setMonth(startDate.getMonth() - 1);

      dateRange = formatStartEndDate(startDate, endOfMonth(endDate), isFormatted);
      break;
    case DateRangeType.previousMonthToDate:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 1); // Note: Must include previous and current month

      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.lastNinetyDays:
      dateRange = getLast90DaysDate(isFormatted);
      break;
    case DateRangeType.lastSixtyDays:
      dateRange = getLast60DaysDate(isFormatted);
      break;
    case DateRangeType.lastThirtyDays:
      dateRange = getLast30DaysDate(isFormatted);
      break;
    case DateRangeType.currentMonthToDate:
    default:
      dateRange = getCurrentMonthDate(isFormatted);
      break;
  }
  return dateRange;
};

export const getDateRangeTypeDefault = (queryFromRoute: Query) => {
  return queryFromRoute.dateRangeType || DateRangeType.currentMonthToDate;
};

export const getDateRangeFromQuery = (queryFromRoute: Query) => {
  let end_date;
  let start_date;

  if (queryFromRoute.dateRangeType === DateRangeType.custom) {
    end_date = queryFromRoute.end_date;
    start_date = queryFromRoute.start_date;
  }
  if (!(end_date && start_date)) {
    const dateRangeType = getDateRangeTypeDefault(queryFromRoute);
    return getDateRange(dateRangeType);
  }
  return {
    end_date,
    start_date,
  };
};
