import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import './index.css';

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    margin: '0 20px 20px 0',
    backgroundColor: 'white',
  },
};

function Classes(props) {
  return (
    <TextField
      autoComplete={props.autoComplete ? props.autoComplete : ""}
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
      }}
      className={props.className ? props.className : ""}
      id={props.id ? props.id : ""}
      label={props.label ? props.label : ""}
      margin={props.margin ? props.margin : "normal"}
      onChange={props.onChange  ? props.onChange : null}
      type={props.type ? props.type : "string"}
      value={props.value ? props.value : ""}
    >
      {props.children ? props.children : 'classes'}
    </TextField>
  );
}

Classes.propTypes = {
  autoComplete: PropTypes.string,
  children:     PropTypes.node,
  classes:      PropTypes.object.isRequired,
  className:    PropTypes.string,
  id:           PropTypes.string,
  label:        PropTypes.string,
  value:        PropTypes.string,
  onChange:     PropTypes.func,
  type:         PropTypes.string,
};

export default withStyles(styles)(Classes);
