import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { connect } from 'react-redux';

import AccountPage from        '../Account';
import HomePage from           '../Home';
import LandingPage from        '../Landing';
import MenuAppBar from         '../MenuAppBar';
//import Navigation from         '../Navigation';
//import PasswordForgetPage from '../PasswordForget';
import RootPath from           '../RootPath';
import SignUpPage from         '../SignUp';
import SignInPage from         '../SignIn';

import withAuthentication from '../Session/withAuthentication';

import * as routes from '../../constants/routes';

import './index.css';

const App = ({ authUser, noAuth }) =>
  <Router>
    <div className="app">
      <MenuAppBar />

      {/* <Navigation />

      <hr/> */}
      <Route exact path={routes.LANDING} component={() => <LandingPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <RootPath />
      {/* <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} /> */}
      <Route exact path={routes.HOME} component={() => <HomePage />} />
      <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
    </div>
  </Router>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  noAuth: state.sessionState.noAuth,
});

export default connect(mapStateToProps)(withAuthentication(App));

// authUser
// noAuth