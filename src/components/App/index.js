import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { connect } from 'react-redux';

import LinearProgress from '../Overrides/Progress';

import AccountPage from '../Account';
import HomePage    from '../Home';
import LandingPage from '../Landing';
import MenuAppBar  from '../MenuAppBar';
//import Navigation from         '../Navigation';
//import PasswordForgetPage from '../PasswordForget';
import RootPath    from '../RootPath';
import Settings    from '../Settings';
import SignUpPage  from '../SignUp';
import SignInPage  from '../SignIn';
import Terms       from '../Terms';

import withAuthentication from '../Session/withAuthentication';

import * as routes from '../../constants/routes';

import './index.css';

const App = ({ authUser, noAuth }) =>
  <Router>
    <div className="app">
      <MenuAppBar />

      {/* <Navigation />

      <hr/> */}
      <Route exact path={routes.LANDING}  component={() => <LandingPage />} />
      <Route exact path={routes.SETTINGS} component={() => <Settings />} />
      <Route exact path={routes.SIGN_IN}  component={() => <SignInPage />} />
      <Route exact path={routes.SIGN_UP}  component={() => <SignUpPage />} />
      <Route exact path={routes.TERMS}    component={() => <Terms />} />
      <RootPath />
      {/* <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} /> */}
      <Route exact path={routes.HOME}     component={() => <HomePage />} />
      <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />

      <LinearProgress hidden />

      {/* case 'progressHide': this.$.progress.setAttribute("hidden",true); break;
          case 'progressShow': this.$.progress.removeAttribute("hidden");   break; */}
      {/* <paper-progress name="progress" id="progress" hidden indeterminate></paper-progress> */}
    </div>
  </Router>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  noAuth: state.sessionState.noAuth,
});

export default connect(mapStateToProps)(withAuthentication(App));

// authUser
// noAuth