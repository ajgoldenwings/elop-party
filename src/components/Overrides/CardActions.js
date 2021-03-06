import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import CardActions from 'material-ui/Card/CardActions';

const styles = {
  root: {
    display: 'block',
    borderTop: '1px solid #e8e8e8',
    boxShadow: 'none',
    position: 'relative',
    padding: '10px 20px',
    textAlign: 'center',
  },
};

function Classes(props) {
  return (
    <CardActions
      classes={{
        root: props.classes.root, // className, e.g. `Classes-root-X`
      }}
    >
      {props.children ? props.children : ''}
    </CardActions>
  );
}

Classes.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Classes);