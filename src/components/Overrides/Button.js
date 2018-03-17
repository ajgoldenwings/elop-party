import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = {
  root: {
    display: 'inline-block',
    boxSizing: 'border-box',
    border: '2px solid #000',
    fontSize: 14,
    fontWeight: 500,
    color: '#202020',
    margin: 0,
    padding: '8px 44px',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
    borderRadius: 0,
    outline: 'none',
    //-webkit-appearance: none;
    '&:focus': {
      backgroundColor: '#c5cad3',
    },
    '&:active': {
      backgroundColor: '#000',
      color: '#FFF',
    },
    // '& > *': {
    //   textTransform: 'uppercase',
    // },
  },
  label: {
    textTransform: 'uppercase',
  },

  // @media (max-width: 767px) {

  //   ajp-button[responsive] {
  //     height: 64px;
  //   }

  //   ajp-button[responsive] > * {
  //     /*background-color: var(--app-accent-color);*/
  //     background-color: #172C50;
  //     border: none;
  //     color: white;
  //     font-size: 18px;
  //   }

  //   ajp-button[responsive] > *:focus {
  //     /*background-color: var(--app-accent-color);*/
  //   }
  // }

  // @media (max-height: 500px) and (max-width: 767px) {
  //   ajp-button[responsive] {
  //     height: 32px;
  //   }

  //   ajp-button[responsive] > * {
  //     font-size: 0.9em;
  //   }
  // }
}

function Classes(props) {
  return (
    <Button
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
        label: props.classes.label, // className, e.g. `Classes-label-X`
      }}
      disabled={props.disabled ? props.disabled : false}
      type={props.type ? props.type : false}
    >
      {props.children ? props.children : ''}
    </Button>
  )
}

Classes.propTypes = {
  children: PropTypes.node,
  classes:  PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  type:     PropTypes.string,
};

export default withStyles(styles)(Classes);