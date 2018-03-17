import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    margin: '0 20px 20px 0',
  },
  label: {
    textTransform: 'capitalize',
  },
};

function Classes(props) {
  return (
    <TextField
      id={props.id ? props.id : ""}
      className={props.className ? props.className : ""}
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
        label: props.classes.label, // className, e.g. `Classes-label-X`
      }}
      label={props.label ? props.label : ""}
      autoComplete={props.autoComplete ? props.autoComplete : ""}
      margin={props.margin ? props.margin : "normal"}
    >
      {props.children ? props.children : 'classes'}
    </TextField>
  );
}

Classes.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Classes);