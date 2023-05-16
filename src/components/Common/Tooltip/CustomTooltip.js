import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    customTooltip: {
      fontSize: '12px',
      lineHeight: '14ox',
      maxWidth: 310,
      background: '#191919',
      border: '1px solid #191919',
      color: 'white',
      padding: 8,

      '@media screen and (min-width:300px) and (max-width:767px)': {
        padding: 4,
        maxWidth: 184,
      }
    },
    customArrow: {
      color: '#191919',
    },
  }));

const CustomTooltip = ({children, title='Tooltip', placement}) => {
    const classes = useStyles();
    return (
        <Tooltip 
            classes={{tooltip: classes.customTooltip, arrow: classes.customArrow}} 
            title={title}
            placement={placement}
            arrow
            enterTouchDelay={0}
        >
            {children}
        </Tooltip>
    );
};

export default CustomTooltip;