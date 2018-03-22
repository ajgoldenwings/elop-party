import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button         from 'material-ui/Button';

import './index.css';

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
    '&:focus': {
      backgroundColor: '#c5cad3',
    },
    '&:active': {
      backgroundColor: '#000',
      color: '#FFF',
    },
  },
  label: {
    textTransform: 'uppercase',
  },
}

function Classes(props) {
  return (
    <Button
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
        label: props.classes.label, // className, e.g. `Classes-label-X`
      }}
      component={props.component ? props.component : null}
      disabled={props.disabled ? props.disabled : false}
      to={props.to ? props.to : ''}
      type={props.type ? props.type : ''}
      responsive={props.responsive ? "true" : "false"}
      responsive_1={props.responsive_1 ? "true" : "false"}
    >
      {props.children ? props.children : ''}
    </Button>
  )
}

Classes.propTypes = {
  children:   PropTypes.node,
  classes:    PropTypes.object.isRequired,
  component:  PropTypes.func,
  disabled:   PropTypes.bool,
  responsive: PropTypes.bool,
  to:         PropTypes.string,
  type:       PropTypes.string,
};

export default withStyles(styles)(Classes);
