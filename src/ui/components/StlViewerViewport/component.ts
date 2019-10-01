import Component, { tracked } from '@glimmer/component';

const modelIds = {
  car: [1101, 1302],
  calipers: [2011, 6012, 4013, 5014],
  rims: [301, 302, 303, 304],
  headLights: [405],
  chromeTrim: [501, 502, 503, 504, 506, 507],
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
  headLightsColor: string;
  @tracked
  chromeTrimColor: string;
  @tracked
  all3dFilesLoaded: boolean = false;

  constructor(options) {
    super(options);

    this.carColor = '#b18f15';
    this.caliperColor = '#8916d1';
    this.rimColor = '#181818';
    this.headLightsColor = '#9ec8ef';
    this.chromeTrimColor = '#363636';
  }

  public didInsertElement() {
    const { firstNode } = this.bounds;
    const hostElement = firstNode.parentElement.querySelector('#stl_cont');
    this.stlViewer = this.initStlViewwer(hostElement);
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
    const leftDiscRotationX = 15; // ???

    const tireColor = '#242424';
    const rearLightsColor = '#910000';
    const discColor = '#363636';
    const windshieldColor = '#9ec8ef';
    const windshieldOpacity = 0.75;

    const headLightsColor = this.headLightsColor;
    const rimColor = this.rimColor;
    const carColor = this.carColor;
    const caliperColor = this.caliperColor;
    const chromeTrimColor = this.chromeTrimColor;

    const initParams = {
      allow_drag_and_drop: false,
      auto_rotate: false,
      camerax: 3750,
      cameray: 1000,
      zoom: 4000,
      bgcolor: 'white',
      all_loaded_callback: function() {
        this.all3dFilesLoaded = true;
      }.bind(this),
      models: [
        // All coordinates are offsets relative to the car model.
        // Looking from the front
        {id: modelIds.car[0], filename: 'rest_of_car.stl', color: carColor},

        // front right
        {filename: 'tire.stl',
         x: frontwheelsx, y: wheelsy, z: frontwheelsz, color: tireColor},
        {filename: 'disc_and_axle.stl', color: discColor,
         x: frontwheelsx - 75, y: wheelsy, z: frontwheelsz},
        {id: modelIds.rims[0], filename: 'rim.stl',
         x: frontwheelsx, y: wheelsy, z: frontwheelsz, color: rimColor},
        {id: modelIds.calipers[0], filename: 'caliper.stl',
         color: caliperColor, x: frontwheelsx, y: calipersy, z: frontcalipersz},
        {filename: 'rim_hub.stl', color: rimColor,
         x: frontwheelsx + 75, y: wheelsy, z: frontwheelsz},

        // back right
        {filename: 'tire.stl', x: backwheelsx, y: wheelsy, z: backwheelsz, color: tireColor},
        {filename: 'disc_and_axle.stl', color: discColor,
         x: backwheelsx - 75, y: wheelsy, z: backwheelsz},
        {id: modelIds.rims[1], filename: 'rim.stl', x: backwheelsx, y: wheelsy, z: backwheelsz, color: rimColor},
        {id: modelIds.calipers[1], filename: 'caliper.stl',
         color: caliperColor, x: backwheelsx, y: calipersy, z: backcalipersz},
        {filename: 'rim_hub.stl', color: rimColor, x: backwheelsx + 75, y: wheelsy, z: backwheelsz},

        // back left
        {filename: 'tire.stl',
         x: -backwheelsx, y: wheelsy, z: backwheelsz, rotationy: leftwheelsrotationy, color: tireColor},
        {filename: 'disc_and_axle.stl', color: discColor,
         rotationx: leftDiscRotationX, rotationy: leftwheelsrotationy,
         x: -backwheelsx + 75, y: wheelsy, z: backwheelsz},
        {id: modelIds.rims[2],filename: 'rim.stl',
         x: -backwheelsx, y: wheelsy, z: backwheelsz, rotationy: leftwheelsrotationy, color: rimColor},
        {id: modelIds.calipers[2], filename: 'caliper.stl',
         x: -backwheelsx, y: calipersy, z: backcalipersz, color: caliperColor},
        {filename: 'rim_hub.stl', color: rimColor,
         x: -(backwheelsx + 75), y: wheelsy, z: backwheelsz},

        // front left
        {filename: 'tire.stl',
         x: -frontwheelsx, y: wheelsy, z: frontwheelsz, rotationy: leftwheelsrotationy, color: tireColor},
        {filename: 'disc_and_axle.stl',  color: discColor,
         rotationx: leftDiscRotationX, rotationy: leftwheelsrotationy,
         x: -frontwheelsx + 75, y: wheelsy, z: frontwheelsz},
        {id: modelIds.rims[3],filename: 'rim.stl',
         x: -frontwheelsx, y: wheelsy, z: frontwheelsz, rotationy: leftwheelsrotationy, color: rimColor},
        {id: modelIds.calipers[3], filename: 'caliper.stl',
         x: -frontwheelsx, y: calipersy, z: frontcalipersz, color: caliperColor},
        {filename: 'rim_hub.stl', color: rimColor, x: -(frontwheelsx + 75), y: wheelsy, z: frontwheelsz},

        {filename: 'windshield.stl',
         color: windshieldColor, opacity: windshieldOpacity,
         y: 300, z: 800},
        {filename: 'Rear_glass_roof_and_window.stl', y: 500, z: -1230, color: '#333333'},
        {filename: 'Front_glass_roof.stl', y: 600, z: -50, color: '#333333'},

        {filename: 'Front_flashlights.stl', color: rearLightsColor, y: -380, z: 2200},
        {filename: 'Rear_flashlights.stl', color: rearLightsColor, y: -415, z: -2245},

        {id: modelIds.headLights[0], filename: 'front_headlights.stl', color: headLightsColor, y: -87, z: 2033},
        {filename: 'Rear_lights.stl', color: rearLightsColor, y: 92, z: -2060},

        {id: modelIds.chromeTrim[0], filename: 'Left_window_trim.stl',
         color: chromeTrimColor, x: 740, y: 340, z: -275}, // right
        {id: modelIds.chromeTrim[1], filename: 'Rightwindow_trim.stl',
         color: chromeTrimColor, x: -740, y: 340, z: -275}, // left
        {id: modelIds.car[1], filename: 'Side_mirror_covers.stl', color: carColor, y: 187, z: 733},
        {id: modelIds.chromeTrim[2], filename: 'Side_mirrors_and_chrome.stl', color: chromeTrimColor, y: 165, z: 833},

        {id: modelIds.chromeTrim[3], filename: 'Door_handles_and_side_cams.stl',
         color: chromeTrimColor, y: -10, z: 100},

        {filename: 'Front_left_window.stl', color: windshieldColor, opacity: windshieldOpacity,
         x: 745, y: 340, z: 277}, // right window
        {filename: 'Front_right_window.stl', color: windshieldColor, opacity: windshieldOpacity,
         x: -745, y: 340, z: 277}, // left window
        {filename: 'Rear_left_window.stl', color: windshieldColor, opacity: windshieldOpacity,
         x: 720, y: 380, z: -905},
        {filename: 'Rear_right_window.stl', color: windshieldColor, opacity: windshieldOpacity,
         x: -720, y: 380, z: -905},

        {id: modelIds.chromeTrim[4], filename: 'Rear_T_logo.stl',
         color: chromeTrimColor, y: 143, z: -2346},
        {id: modelIds.chromeTrim[5], filename: 'Front_T_logo.stl',
         color: chromeTrimColor, y: -112, z: 2270},
      ],
    };
    const StlViewer = window.StlViewer;
    return new StlViewer(hostElement, initParams);
  }

  updateColor(colorName: string, color: string) {
    this[colorName] = color;
    //TODO: maybe turn into a proper map
    let ids;
    switch(colorName) {
      case 'carColor':
        ids = modelIds.car;
        break;
      case 'rimColor':
        ids = modelIds.rims;
        break;
      case 'caliperColor':
        ids = modelIds.calipers;
        break;
      case 'headLightsColor':
        ids = modelIds.headLights;
        break;
      case 'chromeTrimColor':
        ids = modelIds.chromeTrim;
        break;
    }

    for (const modelId of ids) {
      this.stlViewer.set_color(modelId, color);
    }
  }
}
