import Component, { tracked } from '@glimmer/component';

export default class ColorInput extends Component {

  public args: {
    colorName: string;
    color: string;
    updateColor: (colorName: string, color: string, alpha: number) => void;
    alpha: boolean;
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
      const alpha = color.a;
      color.a = 1;
      const newColor = color.toHEXA().toString();
      this.color = newColor;
      this.updateColor(newColor, alpha);
    });
    pickr.on('save', (color) => { // yay
      if (!color) {
        color = this.color;
      } else {
        color = color.toHEXA().toString();
        this.color = color;
      }
      this.updateColor(this.color);
    });
    pickr.on('clear', () => {
      this.updateColor(this.color);
    });
    pickr.on('cancel', () => {
      this.updateColor(this.color);
    });
  }

  updateColor(color: string, alpha?: number) {
    this.args.updateColor(this.args.colorName, color, alpha);
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
        opacity: this.args.alpha,
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
