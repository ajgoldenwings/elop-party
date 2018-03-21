import React, { Component }       from 'react';
import { Link, withRouter }             from 'react-router-dom';

import Typography       from 'material-ui/Typography';
import Card             from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Button      from '../Overrides/Button';
import CardActions from '../Overrides/CardActions';
import CardContent from '../Overrides/CardContent';
import CardHeader  from '../Overrides/CardHeader';
import TextField   from '../Overrides/TextField';

// import { PasswordForgetLink }       from '../PasswordForget';
import {
  // SignUpLink,
  SignUpButton,
} from '../SignUp';
import Theme from '../Theme';

import './index.css';

import { auth } from    '../../firebase';
import * as routes from '../../constants/routes';

const SignInPage = ({ history }) =>
  <div>
    <SignInForm history={history} />
    {/* <PasswordForgetLink />
    <SignUpLink /> */}
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const styles = theme => ({
      card: {
        minWidth: 275,
      },
      title: {
        marginBottom: 16,
        fontSize: 14,
        color: theme.palette.text.secondary,
      },
    });

    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <MuiThemeProvider theme={Theme}>
        <form onSubmit={this.onSubmit} className="authenticationContainer">
          <h2>Sign In</h2>

          <div className="subsection grid">
            <section>
              <div className="row input-row">
                <TextField
                  autoComplete="current-username"
                  className="textField"
                  id="name"
                  label="Email Address"
                  onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                  margin="normal"
                  value={email}
                />
              </div>

              <div className="row input-row">
                <TextField
                  autoComplete="current-password"
                  className="textField"
                  id="password-input"
                  label="Password"
                  onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
                  type="password"
                  margin="normal"
                  value={password}
                  />
              </div>

              <div className="center input-row">
                <Button responsive responsive_1 disabled={isInvalid} type="submit">
                  Sign In
                </Button>
              </div>

              <div className="row input-row">
                {error && <p>{error.message}</p>}
              </div>
            </section>
            <section className="responsive-hidden">
              <div className="row input-row">
                <Card className={styles.card}>
                  <CardHeader title="Don't have an accout?" />
                  <CardContent>
                    <Typography component="p">
                      Go create you account here.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <SignUpButton />
                  </CardActions>
                </Card>
              </div>
            </section>
          </div>
        </form>
      </MuiThemeProvider>
    );
  }
}

const SignInButton = () =>
  <Button
    size="small"
    color="primary"
    component={Link}
    to={routes.SIGN_IN}
    responsive
  >
    Go Sign In
  </Button>

export default withRouter(SignInPage);

export {
  SignInForm,
  SignInButton,
};
