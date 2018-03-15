import React from 'react';

import * as routes from '../../constants/routes';
import { auth } from '../../firebase';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends React.Component {
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

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value,
    });
  };

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    const { classes } = this.props;

    return (
      <MuiThemeProvider muiTheme={classes}>
        <form onSubmit={this.onSubmit}>
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>

          {error && <p>{error.message}</p>}

          <hr />

          <Grid container className={classes.root}>
            <Grid item xs={12}>
              <Grid container className={classes.demo} justify="center" spacing={40}>
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
                </Grid>
                <Grid item>
                    <Card className={classes.card}>
                      <CardContent>
                        <Typography variant="headline" component="h1">
                          Do not have an accout?
                        </Typography>
                        <Typography component="p" className={classes.pos}>
                          Go create you account here.
                        </Typography>
                        <Typography className={classes.pos}>adjective</Typography>
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