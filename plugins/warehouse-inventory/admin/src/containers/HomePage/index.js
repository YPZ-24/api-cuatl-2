/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { useGlobalContext } from 'strapi-helper-plugin';
import { getTrad } from '../../utils';

const HomePage = () => {
  const { formatMessage } = useGlobalContext();
  const pluginName = formatMessage({ id: getTrad('plugin.name') });
  const inProgress = formatMessage({ id: getTrad('Header.InProgress') });

  return (
    <header>
      <h1>{pluginName}</h1>
      <p>{inProgress}</p>
    </header>
  );
};

export default memo(HomePage);
