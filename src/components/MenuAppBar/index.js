import React       from 'react';
import { connect } from 'react-redux';
import { Link }    from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../Theme';

import * as routes from '../../constants/routes';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    position: 'fixed',
    top: 0,
    boxShadow: "none",
    //'&([shadow])::after': {opacity: 1,},
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 27,
    fontWeight: 600,
    letterSpacing: 2.7,
  },
});

const Navigation = ({ authUser, classes }) => {
  return (
    <MuiThemeProvider theme={Theme}>
      <div className={classes.root}>
        <AppBar
          position="static"
          className={classes.appBar}
        >
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.title}>
              Elop Party
            </Typography>
            {authUser && (
              <IconButton
                aria-owns={false ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
                component={Link}
                to={routes.SETTINGS}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(withStyles(styles)(Navigation));

























// import PropTypes from 'prop-types';
// import { withStyles } from 'material-ui/styles';
// import Switch from 'material-ui/Switch';
// import { FormControlLabel, FormGroup } from 'material-ui/Form';
// import Menu, { MenuItem } from 'material-ui/Menu';

// class MenuAppBar extends React.Component {
//   state = {
//     auth: true,
//     anchorEl: null,
//   };

//   handleChange = (event, checked) => {
//     this.setState({ auth: checked });
//   };
//   handleClose = () => {
//     this.setState({ anchorEl: null });
//   };

//   render() {
//     const { classes } = this.props;
//     const { auth, anchorEl } = this.state;
//     const open = Boolean(anchorEl);

//     return (
//       <div className={classes.root}>
//         <AppBar position="static">
//           <Toolbar>
//             <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="title" color="inherit" className={classes.flex}>
//               Elop Party
//             </Typography>
//             {auth && (
//               <div>
//                 <IconButton
//                   aria-owns={open ? 'menu-appbar' : null}
//                   aria-haspopup="true"
//                   onClick={this.handleMenu}
//                   color="inherit"
//                 >
//                   <AccountCircle />
//                 </IconButton>
//                 <Menu
//                   id="menu-appbar"
//                   anchorEl={anchorEl}
//                   anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   open={open}
//                   onClose={this.handleClose}
//                 >
//                   <MenuItem onClick={this.handleClose}>Profile</MenuItem>
//                   <MenuItem onClick={this.handleClose}>My account</MenuItem>
//                 </Menu>
//               </div>
//             )}
//           </Toolbar>
//         </AppBar>
//         <FormGroup>
//           <FormControlLabel
//             control={
//               <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
//             }
//             label={auth ? 'Logout' : 'Login'}
//           />
//         </FormGroup>
//       </div>
//     );
//   }
// }

// MenuAppBar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(MenuAppBar);
