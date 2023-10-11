import axios from 'axios';

import type { PagedLinks, PagedMetaData } from './api';

export interface AccountSettingsData {
  cost_type?: string;
  currency?: string;
}

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
}

export interface AccountSettings {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: AccountSettingsData;
}

export interface AccountSettingsPayload {
  cost_type?: string;
  currency?: string;
}

// eslint-disable-next-line no-shadow
export const enum AccountSettingsType {
  settings = 'settings',
  costType = 'costType',
  currency = 'currency',
}

export const AccountSettingsTypePaths: Partial<Record<AccountSettingsType, string>> = {
  [AccountSettingsType.settings]: 'account-settings/',
  [AccountSettingsType.costType]: 'account-settings/cost-type/',
  [AccountSettingsType.currency]: 'account-settings/currency/',
};

export function fetchAccountSettings(settingsType: AccountSettingsType) {
  const path = AccountSettingsTypePaths[settingsType];
  return axios.get<AccountSettings>(`${path}`);
}

export function updateAccountSettings(settingsType: AccountSettingsType, payload: AccountSettingsPayload) {
  const path = AccountSettingsTypePaths[settingsType];
  return axios.put(`${path}`, payload);
}
