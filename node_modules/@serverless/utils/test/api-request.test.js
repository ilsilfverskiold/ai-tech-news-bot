'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const requireUncached = require('ncjsm/require-uncached');

const { expect } = chai;
chai.use(require('chai-as-promised'));

const log = require('../log').log.get('test');

let api;
describe('test/api-request.test.js', () => {
  let lastMethod;
  let lastRequestHeaders;
  let lastRequestBody;
  const testAccessKey = 'abc123Key';
  beforeEach(() => {
    const responseHeaders = new Map([['content-type', 'application/json; charset=utf-8']]);
    api = requireUncached(() =>
      proxyquire('../api-request', {
        'node-fetch': sinon
          .stub()
          .callsFake(async (url, { method, headers: requestHeaders, body } = { method: 'GET' }) => {
            log.debug('fetch request %s %o', url, method);
            lastMethod = method;
            lastRequestHeaders = requestHeaders;
            lastRequestBody = body;
            switch (method) {
              case 'GET':
                if (url.includes('/server-unavailable/')) {
                  throw new Error('Server error');
                }
                if (url.includes('/server-error/')) {
                  return {
                    status: 500,
                    headers: new Map(
                      Object.entries({
                        ...responseHeaders,
                        'sls-correlation-id': 'correlation-id-123',
                      })
                    ),
                    text: async () => 'Server Error',
                  };
                }
                if (url.includes('/programmer-error/')) {
                  return {
                    status: 400,
                    headers: new Map(
                      Object.entries({
                        ...responseHeaders,
                        'sls-correlation-id': 'correlation-id-123',
                      })
                    ),
                    text: async () => 'Programmer Error',
                  };
                }
                if (url.includes('/org-auth-error/')) {
                  return {
                    status: 401,
                    headers: responseHeaders,
                    text: async () => 'Org auth error',
                  };
                }
                if (url.includes('/user-auth-error/')) {
                  return {
                    status: 401,
                    headers: responseHeaders,
                    text: async () => 'User auth Error',
                  };
                }
                if (url.includes('/unexpected-response/')) {
                  return {
                    status: 200,
                    ok: true,
                    headers: responseHeaders,
                    json: async () => {
                      throw new Error('Parse Error');
                    },
                    text: async () => 'Unexpected response',
                  };
                }
                if (url.includes('/success/')) {
                  return {
                    status: 200,
                    ok: true,
                    headers: responseHeaders,
                    json: async () => ({ foo: 'bar' }),
                  };
                }
                break;
              case 'POST':
                if (url.includes('/submission/')) {
                  return {
                    status: 200,
                    ok: true,
                    headers: responseHeaders,
                    json: async () => ({ foo: 'bar' }),
                  };
                }
                break;

              default:
            }
            throw new Error(`Unexpected request: ${url} method: ${method}`);
          }),
      })
    );
  });

  it('should handle success response', async () => {
    expect(await api('/success/', { accessKey: testAccessKey })).to.deep.equal({ foo: 'bar' });
    expect(lastMethod).to.equal('GET');
  });

  it('should handle post requests', async () => {
    expect(
      await api('/submission/', { method: 'POST', body: { foo: 'bar' }, accessKey: testAccessKey })
    ).to.deep.equal({
      foo: 'bar',
    });
    expect(lastMethod).to.equal('POST');
    expect(lastRequestHeaders['Content-Type']).to.equal('application/json');
    expect(lastRequestBody).to.equal('{"foo":"bar"}');
  });

  it('should support body array input', async () => {
    expect(
      await api('/submission/', {
        method: 'POST',
        body: [{ foo: 'bar' }],
        accessKey: testAccessKey,
      })
    ).to.deep.equal({
      foo: 'bar',
    });
    expect(lastMethod).to.equal('POST');
    expect(lastRequestHeaders['Content-Type']).to.equal('application/json');
    expect(lastRequestBody).to.equal('[{"foo":"bar"}]');
  });

  it('should handle no auth option', async () => {
    expect(await api('/success/', { noAuth: true })).to.deep.equal({ foo: 'bar' });
    expect(!('Authorization' in lastRequestHeaders)).to.equal(true);
  });

  it('should handle server unavailability', async () =>
    expect(
      api('/server-unavailable/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property('code', 'DASHBOARD_SERVER_UNAVAILABLE'));

  it('should handle server error', async () =>
    expect(
      api('/server-error/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property('code', 'DASHBOARD_SERVER_REQUEST_FAILED'));
  it('should handle server error and include correlationId', async () => {
    expect(
      api('/server-error/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property(
      'message',
      'Dashboard encountered an error, please try again later. ReferenceId: correlation-id-123'
    );
  });
  it('should handle programmer error', async () =>
    expect(
      api('/programmer-error/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property('code', 'DASHBOARD_SERVER_ERROR_400'));
  it('should handle progammer error and include correlationId', async () => {
    expect(
      api('/programmer-error/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property(
      'message',
      'Dashboard server error: [400] Programmer Error. ReferenceId: correlation-id-123'
    );
  });
  it('should handle user auth error', async () =>
    expect(
      api('/user-auth-error/', { accessKey: testAccessKey })
    ).to.eventually.be.rejected.and.have.property('code', 'DASHBOARD_USER_AUTH_REJECTED'));
  it('should handle unexpected response', async () =>
    expect(
      api('/unexpected-response/', { accessKey: testAccessKey })
    ).to.eventually.be.rejectedWith('Unexpected response'));
});
