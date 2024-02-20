# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.15.0](https://github.com/serverless/utils/compare/v6.14.0...v6.15.0) (2023-09-19)

### Features

- Add Serverless Platform Correlation Id in error messages ([#222](https://github.com/serverless/utils/issues/222)) ([3a4add2](https://github.com/serverless/utils/commit/3a4add2dbad364f7a197339843928a5ddd069d7c))

## [6.14.0](https://github.com/serverless/utils/compare/v6.13.1...v6.14.0) (2023-09-19)

### Features

- Remove console auth and require dashboard accessKey for api calls ([#220](https://github.com/serverless/utils/issues/220)) ([1d8f91c](https://github.com/serverless/utils/commit/1d8f91c2c70427095f05c9c448bbbe1d49962671))

### [6.13.1](https://github.com/serverless/utils/compare/v6.13.0...v6.13.1) (2023-07-12)

### Bug Fixes

- Set dashboardToken when using dashboard token ([#218](https://github.com/serverless/utils/issues/218)) ([3aa8c08](https://github.com/serverless/utils/commit/3aa8c087d17963d4b828fdbe33ba3fda87a98c18))

## [6.13.0](https://github.com/serverless/utils/compare/v6.12.0...v6.13.0) (2023-07-12)

### Features

- Allow custom accessKey on console api ([#216](https://github.com/serverless/utils/issues/216)) ([dca4bc4](https://github.com/serverless/utils/commit/dca4bc40c0d65f4a161427506fb80bb8316f123a))

## [6.12.0](https://github.com/serverless/utils/compare/v6.11.2...v6.12.0) (2023-07-11)

### Features

- Added dashboard frontend url ([#214](https://github.com/serverless/utils/issues/214)) ([cacf8dc](https://github.com/serverless/utils/commit/cacf8dc0da5c8c0f83fac430ab5b06ce8766c48b))

### Maintenance Improvements

- Upgrade `make-dir` to v4 ([#213](https://github.com/serverless/utils/issues/213)) ([8767882](https://github.com/serverless/utils/commit/87678823359bf1f37d8300259828e2b4964a46d4))

### [6.11.2](https://github.com/serverless/utils/compare/v6.11.1...v6.11.2) (2023-06-26)

### Bug Fixes

- **API:** Support arrays as body input ([#211](https://github.com/serverless/utils/issues/211)) ([98db4a0](https://github.com/serverless/utils/commit/98db4a0e911682a87e9b1581c63f91a70213a21d)) ([Mariusz Nowak](https://github.com/medikoo))

### [6.11.1](https://github.com/serverless/utils/compare/v6.11.0...v6.11.1) (2023-04-06)

### Bug Fixes

- **Auth:** Fix handling of `skipTokenRefresh` option ([#206](https://github.com/serverless/utils/issues/206)) ([4d42e3d](https://github.com/serverless/utils/commit/4d42e3d686a47bcce5962c07d45d6a3f77a418cb)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.11.0](https://github.com/serverless/utils/compare/v6.10.0...v6.11.0) (2023-04-06)

### Features

- **Auth:** Support offline auth check ([#204](https://github.com/serverless/utils/issues/204)) ([123588f](https://github.com/serverless/utils/commit/123588f21cf66654de07f59ed2f94167a9ffe1f7)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Auth:** Introduce debug logs ([#204](https://github.com/serverless/utils/issues/204)) ([70877a9](https://github.com/serverless/utils/commit/70877a99ac26330460751c3c0f9f93b45b701bce)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.10.0](https://github.com/serverless/utils/compare/v6.9.2...v6.10.0) (2023-03-21)

### Features

- Added no auth option to apiRequest ([#202](https://github.com/serverless/utils/issues/202)) ([623a885](https://github.com/serverless/utils/commit/623a885784dbda3222f7a568ee87c5e200352703))

## [6.9.2](https://github.com/serverless/utils/compare/v6.9.1...v6.9.2) (2023-03-16)

### Bug Fixes

- Stack trace should not be camel case ([#200](https://github.com/serverless/utils/issues/200)) ([a046bdb](https://github.com/serverless/utils/commit/a046bdb47dbe517a3650f83daf606a859e05bdad))

## [6.9.1](https://github.com/serverless/utils/compare/v6.9.0...v6.9.1) (2023-03-16)

### Bug Fixes

- Filter out stack trace from warning ([#198](https://github.com/serverless/utils/issues/198)) ([9cec6e9](https://github.com/serverless/utils/commit/9cec6e9059b681986c695e2aac5fd21ddcd286ea))

## [6.9.0](https://github.com/serverless/utils/compare/v6.8.2...v6.9.0) (2023-03-13)

### Features

- Added console UI utlities ([#196](https://github.com/serverless/utils/issues/196)) ([5e3e20d](https://github.com/serverless/utils/commit/5e3e20d7e7d2e40e5e599403843a40d8ca3bd6ea)) ([Dan Jarvis](https://github.com/Danwakeem))
- **Auth:** Configure `devModeFeed` url ([#195](https://github.com/serverless/utils/issues/195)) ([5e2f1bf](https://github.com/serverless/utils/commit/5e2f1bf0c8a825905585bcd4bedca9e6d589fe1b)) ([Dan Jarvis](https://github.com/Danwakeem))

### [6.8.2](https://github.com/serverless/utils/compare/v6.8.1...v6.8.2) (2022-11-02)

### Bug Fixes

- **Auth:**
  - Ensure no overlapping auth calls ([#192](https://github.com/serverless/utils/issues/192)) ([9b3376a](https://github.com/serverless/utils/commit/9b3376a4176f92f75457945d304b0db95107322b)) ([Mariusz Nowak](https://github.com/medikoo))
  - Handle parallel processes race condition case ([#192](https://github.com/serverless/utils/issues/192)) ([0ac94af](https://github.com/serverless/utils/commit/0ac94af43edd13abffd96298108c8a4acf30aabe)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Auth:** Improve debug logs ([#192](https://github.com/serverless/utils/issues/192)) ([f92091d](https://github.com/serverless/utils/commit/f92091d2c599efd433a7d396bdf316a16085a3ff))([Mariusz Nowak](https://github.com/medikoo))

### [6.8.1](https://github.com/serverless/utils/compare/v6.8.0...v6.8.1) (2022-10-26)

### Bug Fixes

- **Auth:** Fix in-memory handling of refresh token ([#191](https://github.com/serverless/utils/issues/191)) ([1b309d4](https://github.com/serverless/utils/commit/1b309d46637d343ffc96b3e6de70a94b4cfbd405)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Auth:** Improve debug logging ([#191](https://github.com/serverless/utils/issues/191)) ([49539f4](https://github.com/serverless/utils/commit/49539f4110e7e909872fc9d61ec47ab2ceb548ad)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.8.0](https://github.com/serverless/utils/compare/v6.7.0...v6.8.0) (2022-10-12)

### Features

- **API:** Recognize integration backend ([#189](https://github.com/serverless/utils/issues/189)) ([65b1093](https://github.com/serverless/utils/commit/65b10935e5a6a5e822511f748620744e19149832)) ([Mariusz Nowak](https://github.com/medikoo))
- Ensure handling of object values in step history ([#188](https://github.com/serverless/utils/issues/188)) ([71202b5](https://github.com/serverless/utils/commit/71202b586192559ad880f02645b6d6932ea00bba)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- Correct typos in error messages ([#187](https://github.com/serverless/utils/issues/187)) ([f1a0fe1](https://github.com/serverless/utils/commit/f1a0fe13283b1c62aa99f7e59771bcda82c44fe6)) ([Lee Sang Min](https://github.com/morethanmin))

## [6.7.0](https://github.com/serverless/utils/compare/v6.6.0...v6.7.0) (2022-07-08)

### Features

- **Auth:** Support `clientOriginCommand` param ([#183](https://github.com/serverless/utils/pull/183)) ([287d68b](https://github.com/serverless/utils/commit/287d68ba35b8cdbb054cd3e8943627b7d2fa6cdc)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.6.0](https://github.com/serverless/utils/compare/v6.5.0...v6.6.0) (2022-05-19)

### Features

- **API:** Improve reporting of authentication errors ([#180](https://github.com/serverless/utils/pull/180)) ([f5aeee6](https://github.com/serverless/utils/commit/f5aeee655900c67bcbf4f97668c53c6a13fa0195)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.5.0](https://github.com/serverless/utils/compare/v6.4.1...v6.5.0) (2022-05-17)

### Features

- **API (experimental):**
  - Extend generic request handler to support all methods ([#178](https://github.com/serverless/utils/pull/178)) ([a4cae48](https://github.com/serverless/utils/commit/a4cae4861c917d6c9a278c520739be90ae6f2b36)) ([Mariusz Nowak](https://github.com/medikoo))
  - Do not hard code url prefix ([#178](https://github.com/serverless/utils/pull/178)) ([87cc2d5](https://github.com/serverless/utils/commit/87cc2d585174234c7e2b443954de8fbcd7c4b397)) ([Mariusz Nowak](https://github.com/medikoo))
  - Expose 4xx response status in error code ([#178](https://github.com/serverless/utils/pull/178)) ([09bb2b6](https://github.com/serverless/utils/commit/09bb2b6883a177bf7279fc3a56af0247a06726d3)) ([Mariusz Nowak](https://github.com/medikoo))
  - Expose status code as `httpStatusCode` on error ([#178](https://github.com/serverless/utils/pull/178)) ([015cb0e](https://github.com/serverless/utils/commit/015cb0e8324b747659502976739e0976f9b5e2a1)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **API:** Improve debug logs ([#178](https://github.com/serverless/utils/pull/178)) ([385003c](https://github.com/serverless/utils/commit/385003ca9609cf4cd2e4150ba6db95a13cd65561)) ([Mariusz Nowak](https://github.com/medikoo))

### [6.4.1](https://github.com/serverless/utils/compare/v6.4.0...v6.4.1) (2022-05-17)

### Maintenance Improvements

- **Auth:** Add debug logs ([#176](https://github.com/serverless/utils/pull/176)) ([c5b9629](https://github.com/serverless/utils/commit/c5b96290e44cbe5e6d0cb74ae2a1374108c5013d)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.4.0](https://github.com/serverless/utils/compare/v6.3.0...v6.4.0) (2022-05-11)

### Features

- **Auth:**
  - Rename `resolveIdToken` to `resolveToken` ([#174](https://github.com/serverless/utils/pull/174)) ([261fa75](https://github.com/serverless/utils/commit/261fa751d1bbe08d965bd09e190a2f64472b945a)) ([Mariusz Nowak](https://github.com/medikoo))
  - Replace `isAuthenticated` with `resolveMode` ([#174](https://github.com/serverless/utils/pull/174)) ([d7af467](https://github.com/serverless/utils/commit/d7af4673145fb15eb947168a966bfe732e3e6446)) ([Mariusz Nowak](https://github.com/medikoo))
- `apiRequest` util (and remove `auth.getOrgId`) ([#174](https://github.com/serverless/utils/pull/174)) ([c2df18a](https://github.com/serverless/utils/commit/c2df18ab68cb6cc12bb10064b48944e39ecb40c1)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Auth:** Ensure to send required header with org token ([#174](https://github.com/serverless/utils/pull/174)) ([aa37b21](https://github.com/serverless/utils/commit/aa37b21df23a14b36b180731712d6b33fa295376)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.3.0](https://github.com/serverless/utils/compare/v6.2.0...v6.3.0) (2022-05-06)

### Features

- **Auth:**
  - `getOrgId` utility ([#172](https://github.com/serverless/utils/pull/172)) ([20b29d8](https://github.com/serverless/utils/commit/20b29d84af6b55e428774d269cee3753d93359f1)) ([Mariusz Nowak](https://github.com/medikoo))
  - `isAuthenticated` util ([#172](https://github.com/serverless/utils/pull/172)) ([1bfed6c](https://github.com/serverless/utils/commit/1bfed6c1d2e19a34fc04faa9d75da0ad4c9adbd2)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Auth:**
  - Fix error code ([#172](https://github.com/serverless/utils/pull/172)) ([d6bab1a](https://github.com/serverless/utils/commit/d6bab1abaa963bb2737c1aa69e1ba7afb1e4b70b)) ([Mariusz Nowak](https://github.com/medikoo))
  - Improve server errors handling ([#172](https://github.com/serverless/utils/pull/172)) ([49f7632](https://github.com/serverless/utils/commit/49f76324ceaf7aa498b2f2b619233bd7de65431f)) ([Mariusz Nowak](https://github.com/medikoo))
  - Refactor utils to be CLI agnostic ([#171](https://github.com/serverless/utils/pull/171)) ([fa05f40](https://github.com/serverless/utils/commit/fa05f407a5b94395cdf54d47f1ea592462717436)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.2.0](https://github.com/serverless/utils/compare/v6.1.0...v6.2.0) (2022-05-06)

### Features

- **Auth:** Report from `logout` whether there was a logged in user ([#169](https://github.com/serverless/utils/pull/169)) ([45c4300](https://github.com/serverless/utils/commit/45c4300ed0fe5356116b989b926024771c48a1b5)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.1.0](https://github.com/serverless/utils/compare/v6.0.3...v6.1.0) (2022-05-06)

### Features

- **Auth:** Authentication utilities for new Identity system ([#165](https://github.com/serverless/utils/pull/165)) ([b1fed4d](https://github.com/serverless/utils/commit/b1fed4dcec4fd7e1e13a1686d5e1c25d87614f5e)) ([Mariusz Nowak](https://github.com/medikoo))
- `ServerlessError` to report user errors ([#164](https://github.com/serverless/utils/pull/164)) ([11cdc1c](https://github.com/serverless/utils/commit/11cdc1cff4be06b20f15c4b3807d281c2176f276)) ([Mariusz Nowak](https://github.com/medikoo))

### [6.0.3](https://github.com/serverless/utils/compare/v6.0.2...v6.0.3) (2022-03-02)

### Maintenance Improvements

- Disable interactivity when `process.env.CI` set ([#162](https://github.com/serverless/utils/pull/162)) ([ec58f2d](https://github.com/serverless/utils/commit/ec58f2de83c034bc84a73f9d321164b8a8f8ffd9)) ([Piotr Grzesik](https://github.com/pgrzesik))

### [6.0.2](https://github.com/serverless/utils/compare/v6.0.1...v6.0.2) (2022-02-07)

### Bug Fixes

- Check if `stdout.isTTY` for interactive ([#160](https://github.com/serverless/utils/pull/160)) ([3a6ec04](https://github.com/serverless/utils/commit/3a6ec04adc171e606a5fe6b06338b0ca23625f84)) ([Piotr Grzesik](https://github.com/pgrzesik))

### [6.0.1](https://github.com/serverless/utils/compare/v6.0.0...v6.0.1) (2022-02-03)

### Maintenance Improvements

- Replace `ncjsm/resolve` with native `createRequire` ([#158](https://github.com/serverless/utils/pull/158)) ([551c0ad](https://github.com/serverless/utils/commit/551c0ad58d777e1b906ba56e85bcf4258f8a5403)), ([Mariusz Nowak](https://github.com/medikoo))
- Upgrade `inquirer` to v8 ([#158](https://github.com/serverless/utils/pull/158)) ([f379b13](https://github.com/serverless/utils/commit/f379b136df7998ffdee122e6e34fd20ef7c34399)) ([Mariusz Nowak](https://github.com/medikoo))
- Upgrade `write-file-atomic` to v4 ([#158](https://github.com/serverless/utils/pull/158)) ([70b6b1a](https://github.com/serverless/utils/commit/70b6b1a63a2ac2c6059145146ca310c70d658e62)) ([Mariusz Nowak](https://github.com/medikoo))

## [6.0.0](https://github.com/serverless/utils/compare/v5.20.3...v6.0.0) (2022-01-27)

### ⚠ BREAKING CHANGES

- **Log:** Remove legacy logs interface, only modern interface as the only to be used is now exposed
- Node.js version 12 or later is required (dropped support for v10)

### Features

- **Log:** Remove legacy logs interface ([#154](https://github.com/serverless/utils/pull/154)) ([7bfbdea](https://github.com/serverless/utils/commit/7bfbdea589a92c3021981aa1e9c738e48b5d4464)) ([Mariusz Nowak](https://github.com/medikoo))
- **Log:** Setup new log writers ([#141](https://github.com/serverless/utils/pull/141)) ([2c18da7](https://github.com/serverless/utils/commit/2c18da7be00599dd67d5014a5c6016f5c488da20)) ([Mariusz Nowak](https://github.com/medikoo))
- **Log:** Support global `--debug` flag ([#149](https://github.com/serverless/utils/pull/149)) ([3c0909c](https://github.com/serverless/utils/commit/3c0909cf0f410bc32216c8ecd51080b1ab85beba)) ([Mariusz Nowak](https://github.com/medikoo))
- **Log:** Support global `--verbose` flag ([#149](https://github.com/serverless/utils/pull/149)) ([55f5432](https://github.com/serverless/utils/commit/55f5432073328558f83668d3760442637e61c9c2)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- Drop support for Node.js versions below v12 ([6aee6ab](https://github.com/serverless/utils/commit/6aee6abe961bfb80d514e7e90296164e46046602)) ([Mariusz Nowak](https://github.com/medikoo))
- **Log:** Remove legacy logs ([b435765](https://github.com/serverless/utils/commit/b435765f54b3988d7b43d33a5baa3d970d4c200e)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.20.3](https://github.com/serverless/utils/compare/v5.20.2...v5.20.3) (2022-01-18)

### Maintenance Improvements

- **Log:** Configure modern logs for `config` util ([#152](https://github.com/serverless/utils/pull/152)) ([d055467](https://github.com/serverless/utils/commit/d055467c998c63ebc9c8e9a3fb9a266426bf1349)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.20.2](https://github.com/serverless/utils/compare/v5.20.1...v5.20.2) (2021-12-17)

### Bug Fixes

- **Log:** Ensure no doubled setup of the log reporter ([#150](https://github.com/serverless/utils/pull/150)) ([513e6d5](https://github.com/serverless/utils/commit/513e6d5b538a69862aea7ce34fa090d5a0782dd0)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.20.1](https://github.com/serverless/utils/compare/v5.20.0...v5.20.1) (2021-11-08)

### Bug Fixes

- **Log:** Ensure custom styles are applied globally ([#147](https://github.com/serverless/utils/pull/147)) ([6473459](https://github.com/serverless/utils/commit/6473459eeab9fcb94762dc7979abeeec9594739c)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.20.0](https://github.com/serverless/utils/compare/v5.19.0...v5.20.0) (2021-11-03)

### Features

- **Log:**
  - `name` option for `progress.create` ([#142](https://github.com/serverless/utils/pull/142)) ([4110e76](https://github.com/serverless/utils/commit/4110e766e7292a74267f020bd3cee8b665e09f4d)) ([Mariusz Nowak](https://github.com/medikoo))
  - Support optional `message` in `progress.create` via options ([#142](https://github.com/serverless/utils/pull/142)) ([7051e34](https://github.com/serverless/utils/commit/7051e34ae7be498b5a3c5fb80803bbe07d170c4a)) ([Mariusz Nowak](https://github.com/medikoo))
  - Update main log function to write at `notice` level ([#143](https://github.com/serverless/utils/pull/143)) ([dc6afd7](https://github.com/serverless/utils/commit/dc6afd799a51a04fd79e7296c3e7bf08e560ea84)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.19.0](https://github.com/serverless/utils/compare/v5.18.0...v5.19.0) (2021-10-20)

### Features

- **Log:**
  - Introduce `progress.create()` factory, which allows to create unnamed progress instances ([#138](https://github.com/serverless/utils/pull/138)) ([0bb2fd1](https://github.com/serverless/utils/commit/0bb2fd187760dcc1dc72dfbeec930b3cca6692e7)) ([Mariusz Nowak](https://github.com/medikoo))
  - Configure `log.success` as an alias to `log.notice.success` ([#138](https://github.com/serverless/utils/pull/138)) ([8bbff52](https://github.com/serverless/utils/commit/8bbff522da748aec24c44f4a2940df62ab805188)) ([Mariusz Nowak](https://github.com/medikoo))
  - Configure `log.verbose` as an alias to `log.info` ([#138](https://github.com/serverless/utils/pull/138)) ([7a0319f](https://github.com/serverless/utils/commit/7a0319f37cda3721a73774ec8878f737ac41df2b)) ([Mariusz Nowak](https://github.com/medikoo))
  - Introduce `progress.update` as an alias for `progress.notice` ([#138](https://github.com/serverless/utils/pull/138)) ([0d28345](https://github.com/serverless/utils/commit/0d28345a81ec4a887377fd60bebb176bb755e019)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Log:**
  - Adjust style of error level logs ([#138](https://github.com/serverless/utils/pull/138)) ([538d816](https://github.com/serverless/utils/commit/538d8168ae4db11196b5827e6d6131a976cd4a4f)) ([Mariusz Nowak](https://github.com/medikoo))
  - Remove effectless decoration ([#138](https://github.com/serverless/utils/pull/138)) ([85e322a](https://github.com/serverless/utils/commit/85e322a6f7fbe68f5195cf85d98c6031445eae88)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.18.0](https://github.com/serverless/utils/compare/v5.17.3...v5.18.0) (2021-10-13)

### Features

- **Log:**
  - Introduce `style.linkStrong` and do not decorate `style.link` ([#135](https://github.com/serverless/utils/pull/135)) ([ab762ca](https://github.com/serverless/utils/commit/ab762ca0116b1dcdc9755cbba6c5ea40b8773295)) ([Mariusz Nowak](https://github.com/medikoo))
  - Remove decoration symbol from `log.notice.skip` ([#136](https://github.com/serverless/utils/pull/136)) ([172f392](https://github.com/serverless/utils/commit/172f3928d4b078c88ec8c302fa94fa8538926205)) ([Piotr Grzesik](https://github.com/pgrzesik))

### [5.17.3](https://github.com/serverless/utils/compare/v5.17.2...v5.17.3) (2021-10-08)

### Bug Fixes

- Ensure `style` is multi instance safe ([#133](https://github.com/serverless/utils/pull/133)) ([796d38c](https://github.com/serverless/utils/commit/796d38c16b5b1d4078faae7ef13a117059a86797)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.17.2](https://github.com/serverless/utils/compare/v5.17.1...v5.17.2) (2021-10-08)

### Bug Fixes

- **Log:**
  - Ensure reliable mode resolution with multiple installations ([#131](https://github.com/serverless/utils/pull/131)) ([6b2d201](https://github.com/serverless/utils/commit/6b2d201bc0926b7e387a15c73e53bb4422ba5bae)) ([Mariusz Nowak](https://github.com/medikoo))
  - Fix `legacy.log` to reflect`sls.cli.log` args handling ([#130](https://github.com/serverless/utils/pull/130)) ([789785b](https://github.com/serverless/utils/commit/789785bc6f84561177c9735c010b3dc7d4acee12)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.17.1](https://github.com/serverless/utils/compare/v5.17.0...v5.17.1) (2021-10-07)

_Maintainance update_

## [5.17.0](https://github.com/serverless/utils/compare/v5.16.0...v5.17.0) (2021-09-29)

### Features

- **Log:**
  - Modern logs for interactive exchange ([#128](https://github.com/serverless/utils/pull/128)) ([4b1f36a](https://github.com/serverless/utils/commit/4b1f36a93ad474f89e061bae6ec29cb755e53f0d)) ([Mariusz Nowak](https://github.com/medikoo))
  - Setup `strong` and `title` styles ([5ddca35](https://github.com/serverless/utils/commit/5ddca35879db79c6b96ba6d1d9152b9f40f22682)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.16.0](https://github.com/serverless/utils/compare/v5.15.0...v5.16.0) (2021-09-23)

### Features

- **Log:**
  - Configure `success` and `skip` notice level decorators ([#127](https://github.com/serverless/utils/pull/126)) ([65ed6fe](https://github.com/serverless/utils/commit/65ed6fe9ff3d0ccd21d7788988bf50f8549df339)) ([Mariusz Nowak](https://github.com/medikoo))
  - Introduce `link` style ([#127](https://github.com/serverless/utils/pull/126)) ([bf54126](https://github.com/serverless/utils/commit/bf54126d82ba662f75c5cf3ba80f731cdd35cba1)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.15.0](https://github.com/serverless/utils/compare/v5.14.0...v5.15.0) (2021-09-22)

### Features

- **Log:** Support internally `--verbose` flag for modern logs ([#126](https://github.com/serverless/utils/pull/126)) ([749de91](https://github.com/serverless/utils/commit/749de91a9aa6596a6b7a147f0eeb52d2923e39d2)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.14.0](https://github.com/serverless/utils/compare/v5.13.0...v5.14.0) (2021-09-21)

### Features

- **Log:** Generalize handling of main process events ([#125](https://github.com/serverless/utils/pull/125)) ([bbf7687](https://github.com/serverless/utils/commit/bbf768742fc7cb62d920848a878bc78d0752b3d3)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.13.0](https://github.com/serverless/utils/compare/v5.12.0...v5.13.0) (2021-09-15)

### Features

- **Log:** Do not write level prefix with deprecation warnings ([#123](https://github.com/serverless/utils/pull/123)) ([67cce8b](https://github.com/serverless/utils/commit/67cce8b504356ac59fcf6e21fdbdda2b0253b49a)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.12.0](https://github.com/serverless/utils/compare/v5.11.0...v5.12.0) (2021-09-14)

### Features

- **Log:** Improve styles when just 16 or 256 colors are supported ([#121](https://github.com/serverless/utils/pull/121)) ([668362d](https://github.com/serverless/utils/commit/668362d3ef2159b075408bac2427b09a5aa2f9b4)) ([d97bf24](https://github.com/serverless/utils/commit/d97bf240ee853c684247b6cdc8a38a810114504f)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.11.0](https://github.com/serverless/utils/compare/v5.10.0...v5.11.0) (2021-09-10)

### Features

- **Log:** Support multiline input in style decorators ([#119](https://github.com/serverless/utils/pull/119)) ([668362d](https://github.com/serverless/utils/commit/668362d3ef2159b075408bac2427b09a5aa2f9b4)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.10.0](https://github.com/serverless/utils/compare/v5.9.0...v5.10.0) (2021-09-09)

### Features

- **Log:** `style` decorators interface ([#117](https://github.com/serverless/utils/pull/117)) ([ec173d0](https://github.com/serverless/utils/commit/ec173d01bfffdc6674afd6a347afc7e871182cb9)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.9.0](https://github.com/serverless/utils/compare/v5.8.1...v5.9.0) (2021-09-08)

### Features

- **Log (Experimental):**
  - `progress.clear` to clear and close progress output ([#114](https://github.com/serverless/utils/pull/114)) ([f81801f](https://github.com/serverless/utils/commit/f81801f90fdb85857cb86f9fd3434793b9daf3ab)) ([Mariusz Nowak](https://github.com/medikoo))
  - Main progress instance, to cover entire command progress ([#115](https://github.com/serverless/utils/pull/115)) ([322fcba](https://github.com/serverless/utils/commit/322fcba7a19a1bb89dc5ed4a890862d5d9a61b0c)) ([Mariusz Nowak](https://github.com/medikoo))

### [5.8.1](https://github.com/serverless/utils/compare/v5.8.0...v5.8.1) (2021-09-07)

### Maintenance Improvements

- **Log:** Ensure writing functions respect mocked `stdout.write` ([#112](https://github.com/serverless/utils/pull/112)) ([99a0706](https://github.com/serverless/utils/commit/99a07068130eeed47cee7cb6db1d60f3f632e237)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.8.0](https://github.com/serverless/utils/compare/v5.7.0...v5.8.0) (2021-09-07)

### Features

- **Log (Experimental):**
  - `legacy` interface for legacy logs to be shown conditionally ([#102](https://github.com/serverless/utils/pull/102)) ([281ae29](https://github.com/serverless/utils/commit/281ae2995200c6b9a9de5b1f75624d22dad64129)) ([Mariusz Nowak](https://github.com/medikoo))
  - `log` modern write interface for event logs ([#103](https://github.com/serverless/utils/pull/103)) ([26a59e6](https://github.com/serverless/utils/commit/26a59e60f5a5b33319cc020b85f3717a8c138390)) ([Mariusz Nowak](https://github.com/medikoo))
  - Endpoints that inform on used log level ([#103](https://github.com/serverless/utils/pull/103)) ([089576e](https://github.com/serverless/utils/commit/089576ec6fd084ec062c7587c8e832d5751bf581)) ([Mariusz Nowak](https://github.com/medikoo))
  - `writeText` modern write interface for substantial text output ([#104](https://github.com/serverless/utils/pull/104)) ([a10a7fa](https://github.com/serverless/utils/commit/a10a7fa296369e5bcc8d0ba07f0aeced51182e7d)) ([Mariusz Nowak](https://github.com/medikoo))
  - `progress` modern write interface for dynamic progress ([#105](https://github.com/serverless/utils/pull/105)) ([8e4f982](https://github.com/serverless/utils/commit/8e4f9826ab436650d21a489422fc7e0b59a8a0f6)) ([Mariusz Nowak](https://github.com/medikoo))
  - `getPluginWriters` to return modern writers dedicated for plugins ([#106](https://github.com/serverless/utils/pull/106)) ([3c8ee39](https://github.com/serverless/utils/commit/3c8ee3947ffe4a8ee9d782865f7946ed5f7cd0a4)) ([Mariusz Nowak](https://github.com/medikoo))
  - Expose information on whether we're in context of TTY ([#109](https://github.com/serverless/utils/pull/109)) ([b3ca20a](https://github.com/serverless/utils/commit/b3ca20aeede06af05e7c0e4f467bc66033a81599)) ([Mariusz Nowak](https://github.com/medikoo))
  - **Node.js CLI reporter:**
    - Support hiding legacy logs ([#107](https://github.com/serverless/utils/pull/107)) ([2d51179](https://github.com/serverless/utils/commit/2d51179edf539f6a39e8e161efcd53f78769e843)) ([Mariusz Nowak](https://github.com/medikoo))
    - Report event logs ([#107](https://github.com/serverless/utils/pull/107)) ([44db92c](https://github.com/serverless/utils/commit/44db92cdb17d452dacdf566a0cefc7666d37edae)) ([Mariusz Nowak](https://github.com/medikoo))
    - Expose configured log level ([#109](https://github.com/serverless/utils/pull/109)) ([6ce33b7](https://github.com/serverless/utils/commit/6ce33b71b423691c0f2d34f3ab91d2a002dbc91b)) ([Mariusz Nowak](https://github.com/medikoo))
    - Report substantial text output ([#108](https://github.com/serverless/utils/pull/108)) ([bc20bc6](https://github.com/serverless/utils/commit/bc20bc6e34258a049727822cb7ebc1b78e6f8e03)) ([Mariusz Nowak](https://github.com/medikoo))
    - Report dynamic progress ([#109](https://github.com/serverless/utils/pull/109)) ([6d916b3](https://github.com/serverless/utils/commit/6d916b36dc40bf1dacec541d34e3d59272c814c6)) ([Mariusz Nowak](https://github.com/medikoo))

### Maintenance Improvements

- **Log:** Make `log` internal logic reusable ([#102](https://github.com/serverless/utils/pull/102)) ([c7338bf](https://github.com/serverless/utils/commit/c7338bfc3cd9423c3fc8969bf20b938e03e6bdda)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.7.0](https://github.com/serverless/utils/compare/v5.6.0...v5.7.0) (2021-08-17)

### Features

- Introduce `get-notifications-mode` util ([#100](https://github.com/serverless/utils/pull/100)) ([a1585c9](https://github.com/serverless/utils/commit/a1585c971d821fc53c4238b35dc50a041652f27b)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.6.0](https://github.com/serverless/utils/compare/v5.5.0...v5.6.0) (2021-07-21)

### Features

- Recognize continue prompts in history with `_continuation_` ([#94](https://github.com/serverless/utils/pull/94)) ([5cd0414](https://github.com/serverless/utils/commit/5cd04148e066b80c2135edf9eb05fb4fb5b09e56)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.5.0](https://github.com/serverless/utils/compare/v5.4.0...v5.5.0) (2021-07-20)

### Features

- Add `prompt-with-history` ([#92](https://github.com/serverless/utils/pull/92)) ([7f094ef](https://github.com/serverless/utils/commit/7f094ef659f9295884c5679c398f609da8dd1ba7)) ([Piotr Grzesik](https://github.com/pgrzesik))
- Add support for recording `startedAt` and `finalizedAt` in `StepHistory` ([#92](https://github.com/serverless/utils/pull/92)) ([483cb08](https://github.com/serverless/utils/commit/483cb082eaa9d049d862554e6a7d6290031d58db)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.4.0](https://github.com/serverless/utils/compare/v5.3.0...v5.4.0) (2021-07-16)

### Features

- **Backend notifications resolver:**
  - Introduce alternative notifications mode settings ([#90](https://github.com/serverless/utils/pull/90)) ([d3ffc7a](https://github.com/serverless/utils/commit/d3ffc7aac78e8a3adf0d2a126c2ba8e2df2592f6)) ([Mariusz Nowak](https://github.com/medikoo))
  - Support forcing display of notifications ([#90](https://github.com/serverless/utils/pull/90)) ([84c9599](https://github.com/serverless/utils/commit/84c9599864f288389101e8876aba4b8ac6683493)) ([Mariusz Nowak](https://github.com/medikoo))

## [5.3.0](https://github.com/serverless/utils/compare/v5.2.0...v5.3.0) (2021-06-15)

### Features

- Add `StepHistory` class in `telemetry` ([#88](https://github.com/serverless/utils/pull/88)) ([20b8df5](https://github.com/serverless/utils/commit/20b8df5ba5ec71328930290348ddd99f0938145a)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.2.0](https://github.com/serverless/utils/compare/v5.1.0...v5.2.0) (2021-05-27)

### Features

- Support disabling entity in `log` util ([#86](https://github.com/serverless/utils/pull/86)) ([df601f5](https://github.com/serverless/utils/commit/df601f5aca5ea7a3ecd8e9a8ddde9f233864acc1)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.1.0](https://github.com/serverless/utils/compare/v5.0.0...v5.1.0) (2021-05-19)

### Features

- Add `download` util ([#84](https://github.com/serverless/utils/pull/84)) ([888a583](https://github.com/serverless/utils/commit/888a58328099f1860fac8305fe32bb05325f039a)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [5.0.0](https://github.com/serverless/utils/compare/v4.1.0...v5.0.0) (2021-05-12)

### ⚠ BREAKING CHANGES

- Inquirer prompt will have no prefix instead of `Serverless:`. If you wish, to still use `Serverless:` prefix, override it on the client side.

### Features

- Remove `Serverless:` prefix from `inquirer` ([#82](https://github.com/serverless/utils/pull/82)) ([edb8593](https://github.com/serverless/utils/commit/edb8593fbd2524c3ba0e08fc1e143eb872cf9b86)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [4.1.0](https://github.com/serverless/utils/compare/v4.0.1...v4.1.0) (2021-04-20)

### Features

- Allow disabling backend notifications via `SLS_NOTIFICATIONS_MODE` env var ([#80](https://github.com/serverless/utils/pull/80)) ([e822033](https://github.com/serverless/utils/commit/e822033a4025415cc076f3bb367e1dea9bec28f1)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [4.0.1](https://github.com/serverless/utils/compare/v4.0.0...v4.0.1) (2021-04-01)

### Features

- Add a dev env metrics url for China user

## [4.0.0](https://github.com/serverless/utils/compare/v3.1.0...v4.0.0) (2021-03-11)

### ⚠ BREAKING CHANGES

- Expose analytics server URL unconditionally (and not just in non-CI environments). It is breaking as it might impact how analytics reporting works in older version of the Framework and might pollute data with unexpected events coming from CI deployments. Additonally, it will cause notifications to be triggered in CI environments as well.

### Features

- Expose analytics server URL unconditionally (and not just in non-CI environments) ([#76](https://github.com/serverless/utils/pull/76)) ([9f7143e](https://github.com/serverless/utils/commit/9f7143e8bdc5f036251ca4f6b54e7292c0803648)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [3.1.0](https://github.com/serverless/utils/compare/v3.0.0...v3.1.0) (2021-01-29)

### Features

- Add account-related methods ([#73](https://github.com/serverless/utils/pull/73)) ([c77df3c](https://github.com/serverless/utils/commit/c77df3ccf45e96b790ef508a50939ce29394eded)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [3.0.0](https://github.com/serverless/utils/compare/v2.2.0...v3.0.0) (2021-01-26)

### ⚠ BREAKING CHANGES

- **Config:**
  - Removed `getGlobalConfig`
  - Removed support for all `rc`-discoverable files (only supports local folder, `~/` and `~/.config` locations)
  - Update will modify local configuration file if found, otherwise it will modify global (previously it always modified global config)

### Features

- **Config:** Introduce new config resolution ([#70](https://github.com/serverless/utils/pull/70)) ([3bff1b4](https://github.com/serverless/utils/commit/3bff1b4fe70e0d011ddb185f3fe6b206ced03aad)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [2.2.0](https://github.com/serverless/utils/compare/v2.1.0...v2.2.0) (2021-01-05)

### Features

- `cloudformationSchema` util ([#66](https://github.com/serverless/utils/issues/66)) ([74adfa8](https://github.com/serverless/utils/commit/74adfa8d5a59f4838cd9c59d0b049ed12d5daa38)) ([Frédéric Barthelet](https://github.com/fredericbarthelet))

## [2.1.0](https://github.com/serverless/utils/compare/v2.0.0...v2.1.0) (2020-12-22)

### Features

- Add general logging utility ([#63](https://github.com/serverless/utils/issues/63)) ([58ccc3c](https://github.com/serverless/utils/commit/58ccc3c0ec741ce173982eb4b897cca2af6135b6)) ([Piotr Grzesik](https://github.com/pgrzesik))

### Bug Fixes

- Ensure that getConfig falls back to getGlobalConfig on error ([#62](https://github.com/serverless/utils/pull/62)) ([4f1251d](https://github.com/serverless/utils/commit/4f1251dc0500bb6f8c357832f243ca0524476fd9)) ([Piotr Grzesik](https://github.com/pgrzesik))
- Ensure that invalid user config is handled gracefully ([#62](https://github.com/serverless/utils/pull/62)) ([9537df2](https://github.com/serverless/utils/commit/9537df2b06bb7560ff0f0ad8f5dc4779cfcf9332)) ([Piotr Grzesik](https://github.com/pgrzesik))

## [2.0.0](https://github.com/serverless/utils/compare/v1.2.0...v2.0.0) (2020-09-21)

### ⚠ BREAKING CHANGES

- Node.js version 10 or later is required (dropped support for v6 and v8)

### Features

- Integrate @serverless/inquirer project ([#59](https://github.com/serverless/utils/pull/59)) ([3fc274a](https://github.com/serverless/utils/commit/3fc274a413ac04f34daee2abeff1b969686182c6)) ([Mariusz Nowak](https://github.com/medikoo))
- Drop support for Node.js v8 ([6cba266](https://github.com/serverless/utils/commit/6cba266861c9c55e4e897f896bb76cd265b0f80a)) ([Mariusz Nowak](https://github.com/medikoo))

## [1.2.0](https://github.com/serverless/utils/compare/v1.1.0...v1.2.0) (2020-06-26)

### Features

- Smarter notification resolution logic, also with support for unconditional notifications ([#56](https://github.com/serverless/utils/pull/56)) ([6329b1a](https://github.com/serverless/utils/commit/6329b1a03ce1ed57c8c922ea021a26f911d6e5c3)) ([Mariusz Nowak](https://github.com/medikoo))
- Configure AWS metrics URL ([#56](https://github.com/serverless/utils/pull/56)) ([c271b3f](https://github.com/serverless/utils/commit/c271b3f0a0e0901a3c45d5726c3e32b54a5a36ba)) ([Mariusz Nowak](https://github.com/medikoo))
- Provide eventual fallback to extended response format ([#56](https://github.com/serverless/utils/pull/56)) ([86ddb95](https://github.com/serverless/utils/commit/86ddb9575d635cdcf326436fe571cc1b2c5818b7)) ([Mariusz Nowak](https://github.com/medikoo))

## [1.1.0](https://github.com/serverless/utils/compare/v1.0.0...v1.1.0) (2020-06-15)

### Features

- **Analytics & Notifications URL**
  - By default do not expose analytics url in CI environment ([05ea565](https://github.com/serverless/utils/commit/05ea565a1642a9da10cb4770ef75ae70c4443a22)) ([Mariusz Nowak](https://github.com/medikoo))
  - Support override of analytics url via `SLS_ANALYTICS_URL` env var ([66ff290](https://github.com/serverless/utils/commit/66ff290a5c06b1b082e377eb3d8ead46b42c4f95)) ([Mariusz Nowak](https://github.com/medikoo))

### [1.0.0](https://github.com/serverless/utils/compare/v0.0.20...v1.0.0) (2020-06-12)

A new beginning. All old utilities were removed. Project now serves high level utilities for Serverless Framework and Component CLI's

### Features

- `analyticsAndNotificationsUrl` util ([b581cef](https://github.com/serverless/utils/commit/b581cef03961a0ee29e2fc9da577a7c0e600e915))
- `config` util ([aeb48d5](https://github.com/serverless/utils/commit/aeb48d58dab279e8c84db2f84b3515ba71815575))
- `isInChina` util ([c457d8c](https://github.com/serverless/utils/commit/c457d8c4e9829d9ab6d38a84e0f7c41809379f43))
- `processBackendNotificationRequest` util ([5249e2b](https://github.com/serverless/utils/commit/5249e2b9a09e72126382e902abeea38d9a089398))
