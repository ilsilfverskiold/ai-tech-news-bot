'use strict';

const account = require('../account');
const sinon = require('sinon');
const config = require('../config');
const chai = require('chai');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

const { expect } = chai;

const nonexipredJwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTTFMiLCJpYXQiOjE2MTE3NDAzNTgsImV4cCI6MTk1ODgwOTE1OCwiYXVkIjoic2xzIiwic3ViIjoic2xzQHNscy5jb20ifQ.fy_DY4cWWADDREVYrSy3U5-p7cKT4evEOCjQtQJl9ww';
const expiredJwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTTFMiLCJpYXQiOjE1ODAxMTc5NTgsImV4cCI6MTU4MDExNzk1OCwiYXVkIjoic2xzIiwic3ViIjoic2xzQHNscy5jb20ifQ.s2xmT0NDxuhuIUo4A6Dzm_aM1vGZWnOxJRNEkoD6X4Q';
const refreshedJwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTTFMiLCJpYXQiOjE1ODAxMTc5NTgsImV4cCI6MTg5NTczNzE1OCwiYXVkIjoic2xzIiwic3ViIjoic2xzQHNscy5jb20ifQ.cEB3jMC6P2TDCkX7UR9uOOPLIPDl8D7F31i0ovkV67w';

describe('account', () => {
  describe('logout', () => {
    it('works correctly when no logged in user', () => {
      config.set('userId', null);
      account.logout();
      expect(config.get('userId')).to.be.null;
    });

    it('works correctly when userId set but no corresponding data for user', () => {
      config.set('userId', 123);
      account.logout();
      expect(config.get('userId')).to.be.null;
    });

    it('works correctly with loggedInUser', () => {
      const userId = 456;
      config.set({
        userId,
        users: {
          [userId]: {
            dashboard: {
              username: 'username',
              accessToken: 'access-token',
              idToken: 'id-token',
              refreshToken: 'refresh-token',
              expiresAt: '123',
            },
          },
        },
      });

      account.logout();

      expect(config.getLoggedInUser()).to.be.null;
      const configAfterLogout = config.getConfig();
      expect(configAfterLogout.userId).to.be.null;
      expect(configAfterLogout.users[userId].dashboard).to.deep.equal({
        accessToken: null,
        expiresAt: null,
        idToken: null,
        username: 'username',
        refreshToken: null,
      });
    });
  });

  describe('refreshToken', () => {
    const sdkRefreshTokenStub = sinon
      .stub()
      .returns({ id_token: refreshedJwt, access_token: 'refreshed-access-token' });
    const sdk = { session: { refreshToken: sdkRefreshTokenStub } };

    beforeEach(() => {
      sdkRefreshTokenStub.resetHistory();
    });

    it('skips refresh if no logged in user', async () => {
      config.set('userId', null);
      await account.refreshToken(sdk);
      expect(sdkRefreshTokenStub).not.to.be.called;
    });

    it('skips refresh if token did not expire yet', async () => {
      const userId = 456;
      config.set({
        userId,
        users: {
          [userId]: {
            dashboard: {
              username: 'username',
              accessToken: 'access-token',
              idToken: nonexipredJwt,
              refreshToken: 'refresh-token',
              expiresAt: '123',
            },
          },
        },
      });
      await account.refreshToken(sdk);
      expect(sdkRefreshTokenStub).not.to.be.called;
    });

    it('correcly refreshes expired token', async () => {
      const userId = 456;
      config.set({
        userId,
        users: {
          [userId]: {
            dashboard: {
              username: 'username',
              accessToken: 'access-token',
              idToken: expiredJwt,
              refreshToken: 'refresh-token',
              expiresAt: '123',
            },
          },
        },
      });
      await account.refreshToken(sdk);
      expect(sdkRefreshTokenStub).to.be.calledWith('refresh-token');
      expect(config.getLoggedInUser().idToken).to.equal(refreshedJwt);
    });
  });
});
