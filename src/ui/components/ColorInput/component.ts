import Component, { tracked } from '@glimmer/component';

export default class ColorInput extends Component {

  public args: {
    colorName: string;
    color: string;
    updateColor: (colorName: string, color: string) => void;
  };

  @tracked
  public color: string = '';

  constructor(options: object) {
    super(options);

    this.color = this.args.color;
  }

  public didInsertElement() {
    const { firstNode } = this.bounds;
    const input = firstNode;

    const pickr = this.buildPickr(input, this.color);

    pickr.on('change', (color) => {
      const newColor = color.toHEXA().toString();
      this.args.updateColor(this.args.colorName, newColor);
    });
    pickr.on('save', (color) => { // yay
      if (!color) {
        color = this.color;
      } else {
        color = color.toHEXA().toString();
        this.color = color;
      }
      this.args.updateColor(this.args.colorName, this.color);
    });
    pickr.on('clear', () => {
      this.args.updateColor(this.args.colorName, this.color);
    });
    pickr.on('cancel', () => {
      this.args.updateColor(this.args.colorName, this.color);
    });
    pickr.on('hide', () => {
      this.args.updateColor(this.args.colorName, this.color);
    });
  }

  public buildPickr(input: Element, defaultColor: string) {
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
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            save: true,
            clear: true,
            cancel: false,
        }
      },
      strings: {
        save: 'yay',
        clear: 'nay',
      }
    });
  }

}
