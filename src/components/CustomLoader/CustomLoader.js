import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';


// Inspired by the former Facebook spinners.
const useStylesCustomLoader = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: '#fff',
  },
  top: {
    color: '#464B4E',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export default function CustomLoader(props) {
  const classes = useStylesCustomLoader();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={props?.size ? props.size : 40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={props?.size ? props.size : 40}
        thickness={4}
        {...props}
      />
    </div>
  );
}