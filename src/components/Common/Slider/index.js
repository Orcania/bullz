import React from 'react';
import OwlCarousel from 'react-owl-carousel3';
import PropTypes from 'prop-types';

import './style.scss';

const Slider = ({ options, children, ...rest }) => {
  return (
    <OwlCarousel
      className="owl-carousel owl-theme default-slider"
      {...options}
      {...rest}
    >
      {children}
    </OwlCarousel>
  );
};

Slider.propTypes = {
  options: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

Slider.defaultProps = {
  options: null,
  children: null,
};

export default Slider;
