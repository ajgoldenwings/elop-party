import React from                 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from           'react-redux';

import HomePage from   '../Home';
import SignInPage from '../SignIn';


import * as routes from '../../constants/routes';

const RootPath = ({ authUser, noAuth }) =>
  <div>
    { authUser
      && <Route exact path={routes.ROOT} component={() => <HomePage />} />
    }
    { noAuth
      && <Route exact path={routes.ROOT} component={() => <SignInPage />} />
    }
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  noAuth: state.sessionState.noAuth,
});

export default withRouter(connect(mapStateToProps)(RootPath));
