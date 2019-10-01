import Component, { tracked } from '@glimmer/component';
//import Pickr from '@simonwep/pickr'; //TODO

const modelIds = {
  car: 1001,
  calipers: [2011, 6012, 4013, 5014],
  rims: [301, 302, 303, 304],
}

export default class StlViewerViewport extends Component {

  stlViewer;

  @tracked
  carColor: string;
  @tracked
  caliperColor: string;
  @tracked
  rimColor: string;
  @tracked
  all3dFilesLoaded: boolean = false;

  constructor(options) {
    super(options);

    this.carColor = '#6444a9';
    this.caliperColor = '#ffeb30';
    this.rimColor = '#99ffff';
  }

  public didInsertElement() {
    const { firstNode } = this.bounds;
    const hostElement = firstNode.parentElement.querySelector('#stl_cont');
    this.stlViewer = this.initStlViewwer(hostElement);
    this._initColorPickers(firstNode.parentElement);
  }

  _initColorPickers(parentElement) {
    let input = parentElement.querySelector('input[name=carColor]');
    this._addColorPicker(input, this.carColor, color => {
      const hexa = color.toHEXA().toString();
      this.carColor = hexa; 
      this.stlViewer.set_color(modelIds.car, this.carColor);
    });

    input = parentElement.querySelector('input[name=caliperColor]');
    this._addColorPicker(input, this.caliperColor, color => {
      const hexa = color.toHEXA().toString();
      this.caliperColor = hexa; 
      for (const id of modelIds.calipers) {
        this.stlViewer.set_color(id, this.caliperColor);
      }
    });

    input = parentElement.querySelector('input[name=rimColor]');
    this._addColorPicker(input, this.rimColor, color => {
      const hexa = color.toHEXA().toString();
      this.rimColor = hexa;
      for (const id of modelIds.rims) {
        this.stlViewer.set_color(id, this.rimColor);
      }
    });

  }

  _addColorPicker(input: Element, defaultColor, onchange) {
    window.Pickr.create({
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
    })
    .on('change', onchange);
  }

  private initStlViewwer(hostElement) {
    const wheelsy = -475;
    const calipersy = -440;
    const frontwheelsx = 810;
    const backwheelsx = 860;
    const backwheelsz = -1350;
    const backcalipersz = -1485;

    const frontwheelsz = 1612.5;
    const frontcalipersz = 1465;
    const leftwheelsrotationy = 15.75; // ???

    const tireColor = '#242424';
    const rimColor = this.rimColor;
    const carColor = this.carColor;
    const caliperColor = this.caliperColor;

    const initParams = {
      allow_drag_and_drop: false,
      auto_rotate: false,
      bgcolor: 'white',
      all_loaded_callback: function() {
        this.all3dFilesLoaded = true;
      }.bind(this),
      models: [
        // Looking from the front
        // front right
        {filename: 'tire.stl', x: frontwheelsx, y: wheelsy, z: frontwheelsz, color: tireColor},
        {id: modelIds.rims[0], filename: 'rim.stl', x: frontwheelsx, y: wheelsy, z: frontwheelsz, color: rimColor},
        {id: modelIds.calipers[0], filename: 'caliper.stl',
         color: caliperColor, x: frontwheelsx, y: calipersy, z: frontcalipersz},
        // back right
        {filename: 'tire.stl', x: backwheelsx, y: wheelsy, z: backwheelsz, color: tireColor},
        {id: modelIds.rims[1], filename: 'rim.stl', x: backwheelsx, y: wheelsy, z: backwheelsz, color: rimColor},
        {id: modelIds.calipers[1], filename: 'caliper.stl',
         color: caliperColor, x: backwheelsx, y: calipersy, z: backcalipersz},
        // back left
        {filename: 'tire.stl',
         x: -backwheelsx, y: wheelsy, z: backwheelsz, rotationy: leftwheelsrotationy, color: tireColor},
        {id: modelIds.rims[2],filename: 'rim.stl',
         x: -backwheelsx, y: wheelsy, z: backwheelsz, rotationy: leftwheelsrotationy, color: rimColor},
        {id: modelIds.calipers[2], filename: 'caliper.stl',
         x: -backwheelsx, y: calipersy, z: backcalipersz, color: caliperColor},
        // front left
        {filename: 'tire.stl',
         x: -frontwheelsx, y: wheelsy, z: frontwheelsz, rotationy: leftwheelsrotationy, color: tireColor},
        {id: modelIds.rims[3],filename: 'rim.stl',
         x: -frontwheelsx, y: wheelsy, z: frontwheelsz, rotationy: leftwheelsrotationy, color: rimColor},
        {id: modelIds.calipers[3], filename: 'caliper.stl',
         x: -frontwheelsx, y: calipersy, z: frontcalipersz, color: caliperColor},

        {filename: 'windshield.stl', y: 300, z: 800, color: '#ebf3ff'},
        {filename: 'Rear_glass_roof_and_window.stl', y: 500, z: -1230, color: '#333333'},
        {filename: 'Front_glass_roof.stl', y: 600, z: -50, color: '#333333'},
        {id: modelIds.car, filename: 'rest_of_car.stl', color: carColor},
        /*
        {filename: 'gdisc_and_axle.stl'},
        {filename: 'gDoor_handles_and_side_cams.stl'},
        {filename: 'gFront_flashlights.stl'},
        {filename: 'gfront_headlights.stl'},
        {filename: 'gFront_left_window.stl'},
        {filename: 'gFront_right_window.stl'},
        {filename: 'gFront_T_logo.stl'},
        {filename: 'gLeft_window_trim.stl'},
        {filename: 'gRear_flashlights.stl'},
        {filename: 'gRear_left_window.stl'},
        {filename: 'gRear_lights.stl'},
        {filename: 'gRear_right_window.stl'},
        {filename: 'gRear_T_logo.stl'},
        {filename: 'gRightwindow_trim.stl'},
        {filename: 'grim_hub.stl'},
        {filename: 'gSide_mirror_covers.stl'},
        {filename: 'gSide_mirrors_and_chrome.stl'},
        */
      ],
    };
    const StlViewer = window.StlViewer;
    return new StlViewer(hostElement, initParams);
  }

  colorChange(event) {
    //const input = event.target;
    //const colorName = input.name;
    //this[colorName] = input.value;
    console.log(event.target.value);
  }
}
