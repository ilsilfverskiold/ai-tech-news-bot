'use strict';

const configUtils = require('./config');
const jwtDecode = require('jwt-decode');

const logout = () => {
  const loggedInUser = configUtils.getLoggedInUser();
  const data = {
    userId: null,
  };

  if (loggedInUser) {
    data.users = {
      [loggedInUser.userId]: {
        dashboard: {
          accessToken: null,
          idToken: null,
          expiresAt: null,
          refreshToken: null,
        },
      },
    };
  }

  configUtils.set(data);
};

const refreshToken = async (sdk) => {
  const loggedInUser = configUtils.getLoggedInUser();

  if (!loggedInUser || !loggedInUser.refreshToken || !loggedInUser.idToken) {
    return;
  }

  // Skip refresh if token did not expire yet
  const decoded = jwtDecode(loggedInUser.idToken);
  if (Number(decoded.exp) * 1000 > Date.now()) {
    return;
  }

  const tokens = await sdk.session.refreshToken(loggedInUser.refreshToken);

  const data = {
    users: {
      [loggedInUser.userId]: {
        dashboard: {
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
        },
      },
    },
  };

  configUtils.set(data);
};

module.exports = {
  logout,
  refreshToken,
};
