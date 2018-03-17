import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import CardContent from 'material-ui/Card/CardContent';

const styles = {
  root: {
    padding: 16,
    position: 'relative',
  },
};

function Classes(props) {
  return (
    <CardContent
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
      }}
    >
      {props.children ? props.children : ''}
    </CardContent>
  );
}

Classes.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Classes);