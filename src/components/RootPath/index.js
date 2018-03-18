import React from                 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from           'react-redux';

import HomePage from   '../Home';
import SignInPage from '../SignIn';

//const authCondition = (authUser) => !!authUser;
//import { compose } from       'recompose';
//import withAuthorization from '../Session/withAuthorization';

import * as routes from '../../constants/routes';

const RootPath = ({ authUser }) =>
  <div>
    { authUser
        ? <Route exact path={routes.ROOT} component={() => <HomePage />} />
        : <Route exact path={routes.ROOT} component={() => <SignInPage />} />
    }
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});


export default withRouter(connect(mapStateToProps)(RootPath));
