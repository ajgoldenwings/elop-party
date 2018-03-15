import React, { Component } from 'react';
import { withRouter }       from 'react-router-dom';

import Hidden           from 'material-ui/Hidden';
import Paper            from 'material-ui/Paper';
import Typography       from 'material-ui/Typography';
import Card             from 'material-ui/Card';
import Grid             from 'material-ui/Grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Button      from '../Overrides/Button';
import CardActions from '../Overrides/CardActions';
import CardContent from '../Overrides/CardContent';
import CardHeader  from '../Overrides/CardHeader';

import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink }         from '../SignUp';
import Theme                  from '../Theme';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';


const SignInPage = ({ history }) =>
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
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
      paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      pos: {
        marginBottom: 12,
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
        <h2>Sign In</h2>

        <div className={styles.root}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Paper className={styles.paper}>toolbar</Paper>
            </Grid>
            <Hidden only={['xs']}>
            <Grid item xs={6}>
              <Paper className={styles.paper}>Go large</Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={styles.paper}>Back large</Paper>
            </Grid>
            </Hidden>
            <Hidden smUp>
            <Grid item xs={12}>
              <Paper className={styles.paper}>Go</Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={styles.paper}>Back</Paper>
            </Grid>
            </Hidden>
          </Grid>
        </div>

        <form onSubmit={this.onSubmit}>

          <Grid container className={styles.root}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={40}>
                <Grid item>
                  <input
                    value={email}
                    onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                    type="text"
                    placeholder="Email Address"
                  />
                  <input
                    value={password}
                    onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
                    type="password"
                    placeholder="Password"
                  />

                  <button disabled={isInvalid} type="submit">
                    Sign In
                  </button>

                  {error && <p>{error.message}</p>}
                </Grid>
                <Grid item>
                  <Card className={styles.card}>
                    <CardHeader title="Do not have an accout?" />
                    <CardContent>
                      <Typography component="p">
                        Go create you account here.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        Go Sign Up
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
