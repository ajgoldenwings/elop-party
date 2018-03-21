import React from 'react';

import List, { ListItem, ListItemText } from 'material-ui/List';

import '../Styles/Common.css'

import { auth } from '../../firebase';

const Settings = () =>
  <div>
    <h2>Settings</h2>

    <h4 className="border-bottom">My Account</h4>

    <List>
      <ListItem button>
        <ListItemText primary="Username" secondary="[[userName]]" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Password" />
      </ListItem>
    </List>

    <h4 className="border-bottom">Information</h4>

    <List>
      <ListItem button>
        <ListItemText primary="Licenses" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Terms" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Version" secondary="0.2" />
      </ListItem>
    </List>

    <h4 className="border-bottom">Account Actions</h4>

    <List>
      <ListItem button onClick={auth.doSignOut}>
        <ListItemText primary="Sign Out" />
      </ListItem>
    </List>
  </div>

export default Settings;
