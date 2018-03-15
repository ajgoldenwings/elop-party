import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import CardContent from 'material-ui/Card/CardContent';

const styles = {
  root: {
    padding: 16,
    position: 'relative',
  },
  label: {
    textTransform: 'capitalize',
  },
};

function Classes(props) {
  return (
    <CardContent
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
        label: props.classes.label, // className, e.g. `Classes-label-X`
      }}
    >
      {props.children ? props.children : 'classes'}
    </CardContent>
  );
}

Classes.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Classes);