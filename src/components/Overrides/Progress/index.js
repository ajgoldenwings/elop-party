import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import PropTypes from 'prop-types';

import './index.css';

const theme = createMuiTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        backgroundColor: 'white',
        height: 4,
        bottom: 0,
        position: 'fixed',
        width: '100%',
        zIndex: 2,
      },
      colorPrimary: {
        backgroundColor: 'white',
      },
      barColorPrimary: {
        backgroundColor: '#202020',
      },
    },
  },
});

function Classes(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <LinearProgress hidden={props.hidden ? true : false}/>
    </MuiThemeProvider>
  );
}

export default Classes;

Classes.propTypes = {
  hidden: PropTypes.bool,
};