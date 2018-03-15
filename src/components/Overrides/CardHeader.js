import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import CardHeader from 'material-ui/Card/CardHeader';

const styles = {
  root: {
    padding: 16,
    fontSize: 24,
    fontWeight: 400,
  },
  label: {
    textTransform: 'capitalize',
  },
};

function Classes(props) {
  return (
    <div>
      <CardHeader
        classes={{
          root: props.classes.root, // className, e.g. `Classes-root-X`
          label: props.classes.label, // className, e.g. `Classes-label-X`
        }}
        title={props.title}
        subheader={props.subheader}
      />
      {props.children && props.children}
    </div>
  );
}

Classes.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  subheader: PropTypes.object,
};

export default withStyles(styles)(Classes);