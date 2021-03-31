/**
 *
 * SocialLink
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Cuatl from '../../assets/images/cuatl.png';
import Instagram from '../../assets/images/instagram.png';
import Facebook from '../../assets/images/facebook.png';

import { SocialLinkWrapper } from './components';

function getSrc(name) {
  switch (name) {
    case 'Cuatl':
      return Cuatl;
    case 'Facebook':
      return Facebook;
    case 'Instagram':
      return Instagram;
    default:
      return Cuatl;
  }
}

const SocialLink = ({ link, name }) => {
  return (
    <SocialLinkWrapper className="col-6">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={getSrc(name)} alt={name} />
        <span>{name}</span>
      </a>
    </SocialLinkWrapper>
  );
};

SocialLink.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default memo(SocialLink);
