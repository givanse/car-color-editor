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
      this.args.updateColor(this.args.colorName, newColor);
    });
    pickr.on('save', color => { // yay
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
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            cancel: true,
            clear: true,
            save: true,
        }
      },
      strings: {
        save: 'yay',
        clear: 'nay',
        cancel: 'reset',
      }
    });
  }

}
