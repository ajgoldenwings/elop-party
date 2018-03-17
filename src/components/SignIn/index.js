import React, { Component }       from 'react';
import { withRouter }             from 'react-router-dom';

import Hidden           from 'material-ui/Hidden';
import Typography       from 'material-ui/Typography';
import Card             from 'material-ui/Card';
import Grid             from 'material-ui/Grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Button      from '../Overrides/Button';
import CardActions from '../Overrides/CardActions';
import CardContent from '../Overrides/CardContent';
import CardHeader  from '../Overrides/CardHeader';
import TextField   from '../Overrides/TextField';

import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink }         from '../SignUp';
import './index.css';
import Theme                  from '../Theme';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';


const SignInPage = ({ history }) =>
  <div>
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

        <form onSubmit={this.onSubmit} className="authenticationContainer">
          <h2>Sign In</h2>

          <Grid container className={styles.grid} spacing={40}>
            <Hidden only={['xs']}>
              <Grid item xs={5} className="center">
                <TextField
                  autoComplete="current-username"
                  className="textField"
                  id="name"
                  label="Email Address"
                  onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                  margin="normal"
                  value={email}
                />
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
                <Button disabled={isInvalid} type="submit">
                  Sign In
                </Button>

                {error && <p>{error.message}</p>}
              </Grid>
              <Grid item xs={1}>
              </Grid>
              <Grid item xs={6}>
                <Card className={styles.card}>
                  <CardHeader title="Don't have an accout?" />
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
            </Hidden>
          </Grid>

          {/* <Grid container spacing={16} className={styles.grid}>
            <Hidden smUp>
            <Grid item xs={12}>
              <Paper className={styles.paper}>Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go Go </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={styles.paper}>Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back Back </Paper>
            </Grid>
            </Hidden>
          </Grid> */}
        </form>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
