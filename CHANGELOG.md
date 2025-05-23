# CHANGELOG


## v0.1.16 (2025-05-22)

### Bug Fixes

- Resolve circular imports ([#30](https://github.com/ShragaAI/shraga/pull/30),
  [`1fe6e69`](https://github.com/ShragaAI/shraga/commit/1fe6e6984061be03c3f108b650b1f350decc1a7c))

- Return empty array of messages instead of code 404
  ([#29](https://github.com/ShragaAI/shraga/pull/29),
  [`2691823`](https://github.com/ShragaAI/shraga/commit/269182348e211323b27f7d5e47bc56ab10866db9))

### Chores

- Cohere embed import
  ([`2429e23`](https://github.com/ShragaAI/shraga/commit/2429e23900798ace9038a25dd210e897a080fd01))


## v0.1.15 (2025-05-18)

### Bug Fixes

- History
  ([`198de66`](https://github.com/ShragaAI/shraga/commit/198de660748a3fb42ade7b27cf43a5cd463e19ab))


## v0.1.14 (2025-05-18)

### Bug Fixes

- Add msg_id to user and system chat messages ([#27](https://github.com/ShragaAI/shraga/pull/27),
  [`8adb57c`](https://github.com/ShragaAI/shraga/commit/8adb57c68f5b022984d598b6a89720ab3ec8d342))

* chore: add uuid to user and system chat messages

* fix: msg_id

* chore: feedback

* perf: optimize chat history loading (#28)

* msg_id

---------

Co-authored-by: Liza Katz <lizka.k@gmail.com>


## v0.1.13 (2025-05-18)

### Performance Improvements

- Optimize chat history loading ([#28](https://github.com/ShragaAI/shraga/pull/28),
  [`1926ca7`](https://github.com/ShragaAI/shraga/commit/1926ca7ec9db798139e01712ed77f46dd26fb15f))


## v0.1.12 (2025-05-14)

### Bug Fixes

- Retrieverconfig
  ([`af07d2f`](https://github.com/ShragaAI/shraga/commit/af07d2fcf96948b7ecb80cac0dc7e183bf8dd6f6))


## v0.1.11 (2025-05-14)

### Bug Fixes

- Retriever config
  ([`0c34083`](https://github.com/ShragaAI/shraga/commit/0c34083d62932ec31b36877242de33331b987271))

- Typo
  ([`668c53d`](https://github.com/ShragaAI/shraga/commit/668c53d93b607ef95ddb2640146c519b82ea5179))


## v0.1.10 (2025-05-14)

### Bug Fixes

- Retrieveconfig in pydantic
  ([`34c20e7`](https://github.com/ShragaAI/shraga/commit/34c20e76e3f62951c1182d9222ed1f93d7291c04))


## v0.1.9 (2025-05-14)

### Bug Fixes

- Add cohere embeddings ([#26](https://github.com/ShragaAI/shraga/pull/26),
  [`cba6733`](https://github.com/ShragaAI/shraga/commit/cba6733608fdb285acc48ff6098c7ede98d96e15))

Co-authored-by: Dinor Nagar <dinornagar@Dinors-MacBook-Air.local>


## v0.1.8 (2025-05-05)

### Bug Fixes

- Fix chat logging ([#25](https://github.com/ShragaAI/shraga/pull/25),
  [`b6ea2ab`](https://github.com/ShragaAI/shraga/commit/b6ea2ab6958b770cb2368a01b64dad7bd92d3c17))

* fix: enable logging for chat messages without stats

* fix: handle empty stats

---------

Co-authored-by: Dinor Nagar <dinornagar@Dinors-MacBook-Air.local>


## v0.1.7 (2025-04-30)

### Bug Fixes

- Add nova support ([#24](https://github.com/ShragaAI/shraga/pull/24),
  [`31a9345`](https://github.com/ShragaAI/shraga/commit/31a9345a2ed229f5f2f81721e42866f05e5c9953))

* feat: Add nova support

* feat: remove duplicates

---------

Co-authored-by: Dinor Nagar <dinornagar@Dinors-MacBook-Air.local>

### Chores

- Don't build if already published
  ([`4c7d14d`](https://github.com/ShragaAI/shraga/commit/4c7d14d698887354ae2ac6335e474056fe7e6da7))

- Pre commit hook message linter
  ([`7aa0a93`](https://github.com/ShragaAI/shraga/commit/7aa0a939a359b30b0825848bc6a42047b7232409))


## v0.1.6 (2025-04-15)

### Bug Fixes

- Build
  ([`382d31a`](https://github.com/ShragaAI/shraga/commit/382d31a052dd1dfc2094b7b16b6de434a718b706))


## v0.1.5 (2025-04-15)

### Bug Fixes

- Lock
  ([`3b83b71`](https://github.com/ShragaAI/shraga/commit/3b83b714e4fb537ae8c8e80a4fcca37838f489e9))


## v0.1.4 (2025-04-15)

### Bug Fixes

- Build
  ([`94d4f08`](https://github.com/ShragaAI/shraga/commit/94d4f08a03f7f66dfabf9da541151c3825998317))

- Install poetry
  ([`da18535`](https://github.com/ShragaAI/shraga/commit/da18535cfce44e86a1fa003d80a5bfcd48c1e23f))

- Restore semantic release config
  ([`fb3cb9d`](https://github.com/ShragaAI/shraga/commit/fb3cb9db623ebd12f7e3cf9061d2f934b97a90c2))


## v0.1.3 (2025-04-15)

### Bug Fixes

- Don't upload to gh release if not released
  ([`e06f7e7`](https://github.com/ShragaAI/shraga/commit/e06f7e7ddd6f76e8dad3b55967dc68521bb81674))


## v0.1.2 (2025-04-15)

### Bug Fixes

- Test
  ([`4aca46d`](https://github.com/ShragaAI/shraga/commit/4aca46dcbe17a9f8848e25a16a350f733a7daf3e))


## v0.1.1 (2025-04-15)

### Bug Fixes

- Test
  ([`1e7267b`](https://github.com/ShragaAI/shraga/commit/1e7267bd2d1f1ecdd9f3629e35dc1f2909a124de))


## v0.1.0 (2025-04-15)

### Features

- Release script
  ([`62bbc2c`](https://github.com/ShragaAI/shraga/commit/62bbc2c97150889dbdeaa60941454a037008c884))


## v0.0.0 (2025-04-15)

### Chores

- Add gh release workflow
  ([`a2b9d2a`](https://github.com/ShragaAI/shraga/commit/a2b9d2a68552b910db95a409ba837c5d3f5e561c))

- Release action
  ([`1e7585f`](https://github.com/ShragaAI/shraga/commit/1e7585f0c347fa751c22b4b8260c0fdd0cc42289))
