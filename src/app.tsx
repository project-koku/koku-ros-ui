import './app.scss';

import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import React, { useEffect, useLayoutEffect } from 'react';
import type { Reducer } from 'redux';
import { invalidateSession } from 'utils/localStorage';

import pkg from '../package.json';
import { useFeatureFlags } from './components/featureFlags';
import { Routes } from './routes';

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer as Reducer });

    // You can use directly the name of your app
    updateDocumentTitle(pkg.insights.appname);
  }, []);

  // Initialize Unleash feature flags
  useFeatureFlags();

  // Clear local storage value if current session is not valid
  invalidateSession();

  useLayoutEffect(() => {
    const el = document.querySelector<HTMLDivElement>('.chr-scope__default-layout');
    if (el) {
      el.style.overflow = 'auto';
    }
  }, []);

  return (
    <>
      <NotificationsPortal />
      <Routes />
    </>
  );
};

export default App;
