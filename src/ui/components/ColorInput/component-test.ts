import hbs from '@glimmer/inline-precompile';
import { render, setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: ColorInput', function(hooks) {
  setupRenderingTest(hooks);

  test('renders with a background color', async function(assert) {
    this.colorName = 'foobar';
    this.color = '#00ff00';
    await render(hbs`<ColorInput @colorName={{this.colorName}} @color={{this.color}} />`);

    const d = this.containerElement.querySelector('div');
    assert.equal(d.style.backgroundColor, 'rgb(0, 255, 0)');
  });
});
