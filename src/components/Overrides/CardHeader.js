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
};

function Classes(props) {
  return (
    <div>
      <CardHeader
        classes={{
          root: props.classes.root, // className, e.g. `Classes-root-X`
        }}
        title={props.title}
        subheader={props.subheader}
      />
    </div>
  );
}

Classes.propTypes = {
  classes:   PropTypes.object.isRequired,
  subheader: PropTypes.object,
  title:     PropTypes.string.isRequired,
};

export default withStyles(styles)(Classes);