import Component, { tracked } from '@glimmer/component';

export default class ColorInput extends Component {

  args: {
    colorName: string;
    color: string;
    updateColor: (colorName: string, color: string) => void;
  }

  @tracked
  color: string = '';

  constructor(options: Object) {
    super(options);

    this.color = this.args.color;
  }

  didInsertElement() {
    const { firstNode } = this.bounds;
    const input = firstNode;

    const pickr = this.buildPickr(input, this.color);
    
    pickr.on('change', color => {
      const newColor = color.toHEXA().toString();
      this.color = newColor;
      this.args.updateColor(this.args.colorName, this.color);
    });
  }

  buildPickr(input: Element, defaultColor: string) {
    return window.Pickr.create({
      el: input,
      useAsButton: true,
      defaultRepresentation: 'HEXA',
      default: defaultColor,
      theme: 'nano',
      autoReposition: true,
      components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,
      // Input / output Options
      interaction: {
          hex: true,
          rgba: false,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          cancel: true,
          clear: true,
          save: true,
      }
      }
    });
  }

}
