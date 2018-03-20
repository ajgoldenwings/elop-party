import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Card             from 'material-ui/Card';
import Typography       from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { SignInButton }   from '../SignIn';
import { TermsAgreement } from '../Terms';
import Theme              from '../Theme';

import { auth, db } from '../../firebase';
import * as routes from  '../../constants/routes';

import Button      from '../Overrides/Button';
import CardActions from '../Overrides/CardActions';
import CardContent from '../Overrides/CardContent';
import CardHeader  from '../Overrides/CardHeader';
import TextField   from '../Overrides/TextField';

import '../Styles/Form.css';

const SignUpPage = ({ history }) =>
  <div>
    <SignUpForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(updateByPropertyName('error', error));
          });

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
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        marginBottom: 16,
        fontSize: 14,
        color: theme.palette.text.secondary,
      },
    });

    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    return (
      <MuiThemeProvider theme={Theme}>
        <form onSubmit={this.onSubmit} className="authenticationContainer">
          <h2>Sign Up</h2>
          <div className="subsection grid">
            <section>
              <div className="row input-row">
                <TextField
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
                  className="textField"
                  id="passwordOne-input"
                  label="Password"
                  onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
                  type="password"
                  margin="normal"
                  value={passwordOne}
                />
              </div>

              <div className="row input-row">
                <TextField
                  className="textField"
                  id="passwordTwo-input"
                  label="Confirm Password"
                  onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
                  type="password"
                  margin="normal"
                  value={passwordTwo}
                />
              </div>

              <div className="center input-row">
                <TermsAgreement/>
              </div>

              <div className="row input-row">
                <Button disabled={isInvalid} type="submit">
                  Sign Up
                </Button>
              </div>

              <div className="row input-row">
                { error && <p>{error.message}</p> }
              </div>
            </section>
            <section className="responsive-hidden">
              <div className="row input-row">
                <Card className={styles.card}>
                  <CardHeader title="Already have a accout?" />
                  <CardContent>
                    <Typography component="p">
                      Go sign on to your account here.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <SignInButton />
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

const SignUpButton = () =>
  <Button
    size="small"
    color="primary"
    component={Link}
    to={routes.SIGN_UP}
    responsive
  >
    Go Sign Up
  </Button>

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpButton,
  SignUpLink,
};