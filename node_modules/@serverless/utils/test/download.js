// This module is heavily inspired by https://github.com/kevva/download repository with substantial pieces of the code copied and adapted from it

// License of the original module - https://github.com/kevva/download/blob/master/license

// MIT License

// Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com> (github.com/kevva)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

const fsp = require('fs').promises;
const path = require('path');
const contentDisposition = require('content-disposition');
const getStream = require('get-stream');
const isZip = require('is-zip');
const nock = require('nock');
const randomBuffer = require('random-buffer');
const provisionTmpDir = require('@serverless/test/provision-tmp-dir');

const download = require('../download');

const chai = require('chai');
chai.use(require('chai-as-promised'));

const { expect } = chai;

describe('download.js', () => {
  let tmpDir;
  before(async () => {
    tmpDir = await provisionTmpDir();
    nock('http://foo.bar')
      .persist()
      .get('/404')
      .reply(404)
      .get('/foo.zip')
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'))
      .get('/foo.js')
      .replyWithFile(200, __filename)
      .get('/querystring.zip')
      .query({ param: 'value' })
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'))
      .get('/dispo')
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'), {
        'Content-Disposition': contentDisposition('dispo.zip'),
      })
      .get('/foo*bar.zip')
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'))
      .get('/large.bin')
      .reply(200, randomBuffer(7928260))
      .get('/redirect.zip')
      .reply(302, null, { location: 'http://foo.bar/foo.zip' })
      .get('/redirect-https.zip')
      .reply(301, null, { location: 'https://foo.bar/foo-https.zip' })
      .get('/filetype')
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'));

    nock('https://foo.bar')
      .persist()
      .get('/foo-https.zip')
      .replyWithFile(200, path.join(__dirname, 'fixture.zip'));
  });

  it('download as stream', async () => {
    expect(isZip(await getStream.buffer(download('http://foo.bar/foo.zip')))).to.be.true;
  });

  it('download as promise', async () => {
    expect(isZip(await download('http://foo.bar/foo.zip'))).to.be.true;
  });

  it('download a very large file', async () => {
    expect((await getStream.buffer(download('http://foo.bar/large.bin'))).length).to.equal(7928260);
  });

  it('download and rename file', async () => {
    await download('http://foo.bar/foo.zip', tmpDir, { filename: 'bar.zip' });
    const stats = await fsp.lstat(path.join(tmpDir, 'bar.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'bar.zip'));
  });

  it('save file', async () => {
    await download('http://foo.bar/foo.zip', tmpDir);
    const stats = await fsp.lstat(path.join(tmpDir, 'foo.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'foo.zip'));
  });

  it('extract file', async () => {
    await download('http://foo.bar/foo.zip', tmpDir, { extract: true });
    const stats = await fsp.lstat(path.join(tmpDir, 'file.txt'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'file.txt'));
  });

  it('extract file that is not compressed', async () => {
    await download('http://foo.bar/foo.js', tmpDir, { extract: true });
    const stats = await fsp.lstat(path.join(tmpDir, 'foo.js'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'foo.js'));
  });

  it('error on 404', async () => {
    await expect(download('http://foo.bar/404')).to.be.eventually.rejectedWith(
      'Response code 404 (Not Found)'
    );
  });

  it('rename to valid filename', async () => {
    await download('http://foo.bar/foo*bar.zip', tmpDir);
    const stats = await fsp.lstat(path.join(tmpDir, 'foo!bar.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'foo!bar.zip'));
  });

  it('follow redirects', async () => {
    expect(isZip(await download('http://foo.bar/redirect.zip'))).to.be.true;
  });

  it('follow redirect to https', async () => {
    expect(isZip(await download('http://foo.bar/redirect-https.zip')));
  });

  it('handle query string', async () => {
    await download('http://foo.bar/querystring.zip?param=value', tmpDir);
    const stats = await fsp.lstat(path.join(tmpDir, 'querystring.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'querystring.zip'));
  });

  it('handle content dispositon', async () => {
    await download('http://foo.bar/dispo', tmpDir);
    const stats = await fsp.lstat(path.join(tmpDir, 'dispo.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'dispo.zip'));
  });

  it('handle filename from file type', async () => {
    await download('http://foo.bar/filetype', tmpDir);
    const stats = await fsp.lstat(path.join(tmpDir, 'filetype.zip'));
    expect(stats.isFile()).to.be.true;
    await fsp.unlink(path.join(tmpDir, 'filetype.zip'));
  });
});
