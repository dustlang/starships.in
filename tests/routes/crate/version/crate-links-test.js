import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'cargo/tests/helpers';

module('Route | crate.version | crate links', function (hooks) {
  setupApplicationTest(hooks);

  test('shows all external crate links', async function (assert) {
    this.server.create('crate', {
      name: 'foo',
      homepage: 'https://starships.in/',
      documentation: 'https://doc.rust-lang.org/cargo/getting-started/',
      repository: 'https://github.com/dustlang/starships.in.git',
    });
    this.server.create('version', { crateId: 'foo', num: '1.0.0' });

    await visit('/crates/foo');

    assert.dom('[data-test-homepage-link] a').hasText('starships.in').hasAttribute('href', 'https://starships.in/');

    assert
      .dom('[data-test-docs-link] a')
      .hasText('doc.rust-lang.org/cargo/getting-started')
      .hasAttribute('href', 'https://doc.rust-lang.org/cargo/getting-started/');

    assert
      .dom('[data-test-repository-link] a')
      .hasText('github.com/dustlang/starships.in')
      .hasAttribute('href', 'https://github.com/dustlang/starships.in.git');
  });

  test('shows no external crate links if none are set', async function (assert) {
    this.server.create('crate', { name: 'foo' });
    this.server.create('version', { crateId: 'foo', num: '1.0.0' });

    await visit('/crates/foo');

    assert.dom('[data-test-homepage-link]').doesNotExist();
    assert.dom('[data-test-docs-link]').doesNotExist();
    assert.dom('[data-test-repository-link]').doesNotExist();
  });

  test('hide the homepage link if it is the same as the repository', async function (assert) {
    this.server.create('crate', {
      name: 'foo',
      homepage: 'https://github.com/dustlang/starships.in',
      repository: 'https://github.com/dustlang/starships.in',
    });
    this.server.create('version', { crateId: 'foo', num: '1.0.0' });

    await visit('/crates/foo');

    assert.dom('[data-test-homepage-link]').doesNotExist();
    assert.dom('[data-test-docs-link]').doesNotExist();

    assert
      .dom('[data-test-repository-link] a')
      .hasText('github.com/dustlang/starships.in')
      .hasAttribute('href', 'https://github.com/dustlang/starships.in');
  });

  test('hide the homepage link if it is the same as the repository plus `.git`', async function (assert) {
    this.server.create('crate', {
      name: 'foo',
      homepage: 'https://github.com/dustlang/starships.in/',
      repository: 'https://github.com/dustlang/starships.in.git',
    });
    this.server.create('version', { crateId: 'foo', num: '1.0.0' });

    await visit('/crates/foo');

    assert.dom('[data-test-homepage-link]').doesNotExist();
    assert.dom('[data-test-docs-link]').doesNotExist();

    assert
      .dom('[data-test-repository-link] a')
      .hasText('github.com/dustlang/starships.in')
      .hasAttribute('href', 'https://github.com/dustlang/starships.in.git');
  });
});
