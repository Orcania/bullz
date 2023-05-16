import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import OwlCarousel from 'react-owl-carousel3';
import styled, { css } from 'styled-components';
import { useMediaQuery } from '@material-ui/core';

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;

const StyledCarousel = styled(OwlCarousel)`
  position: static !important;

  ${(props) => props.items && css`
    width: calc(${(props.items * 100) / (props.items + 0.5)}% - 6px) !important;
  `}
  .owl-stage-outer {
    overflow: visible !important;
  }

  .owl-nav {
    height: 0;

    .disabled {
      opacity: 0 !important;
    }
    
    .owl-prev {
      position: absolute !important;
      left: 0;
      top: 0;
      height: calc(100% - 16px);
      margin: 0 !important;
      padding: 0 !important;
      padding-left:16.5px!important;
      display: flex !important;
      justify-content: start;
      align-items: center;
      color: white !important;
      transition: 0.5s !important;
      font-family: monospace;
      @media(max-width:1023px){
        padding-left: 10px !important;
      }
    }

    .owl-next {
      position: absolute !important;
      right: 0;
      top: 0;
      height: calc(100% - 16px);
      margin: 0 !important;
      padding: 0 !important;
      padding-right:16.5px!important;
      display: flex !important;
      justify-content: end;
      align-items: center;
      color: white !important;
      transition: 0.5s !important;
      background-image: linear-gradient(265.23deg, #121213 -170.45%, rgba(18, 18, 19, 0) 94.15%);
      font-family: monospace;
      @media(max-width:1023px){
        padding-right: 10px !important;
      }

    }
  }
`;

const Carousel = ({ items, children, option={}, ...rest }) => {
  const sliderRef = useRef(null);
  const isScreenSmall = useMediaQuery('(min-width:340px) and (max-width:1024px)');
  const options = useMemo(() => ({
    loop: false,
    rewind:false,
    checkVisibility: true,
    nav: true,
    dots: false,
    autoplayHoverPause: true,
    autoplay: false,
    navText: ['<svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 12L13 22" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>',
      '<svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L12 12L2 22" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>'
    ],
    margin: 10,
    items,
    
    mouseDrag: true,
    ...option,
    ...rest,
  }), [items, rest]);

  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  }

  const onWheelSlider = debounce((e) => {
    if (e.deltaX > 0) {
      sliderRef.current.next(150);
    } else if (e.deltaX < 0) {
      sliderRef.current.prev(150);
    }
  }, 100);
 
  return (
    <Container onWheel={!isScreenSmall ? onWheelSlider : undefined}>
      <StyledCarousel {...options} ref={sliderRef}>
        {children}
      </StyledCarousel>
    </Container>
  );
};

Carousel.propTypes = {
  items: PropTypes.number,
  children: PropTypes.any,
};

Carousel.defaultProps = {
  items: 3,
  children: '',
};

export default Carousel;
