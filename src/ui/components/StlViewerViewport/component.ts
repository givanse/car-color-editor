import Component, { tracked } from '@glimmer/component';

const modelIds = {
  car: [1001],
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
      camerax: 3750,
      cameray: 1000,
      zoom: 4000,
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
        {id: modelIds.car[0], filename: 'rest_of_car.stl', color: carColor},
        {filename: 'Front_flashlights.stl', color: '#641088', y: -380, z: 2200},
        {filename: 'front_headlights.stl', y: -75, z: 2050},
        {filename: 'Rear_lights.stl', color: '#641088', y: 80, z: -2075},
        /*
        {filename: 'disc_and_axle.stl'},
        {filename: 'Door_handles_and_side_cams.stl'},
        {filename: 'Front_left_window.stl'},
        {filename: 'Front_right_window.stl'},
        {filename: 'Front_T_logo.stl'},
        {filename: 'Left_window_trim.stl'},
        {filename: 'Rear_flashlights.stl'},
        {filename: 'Rear_left_window.stl'},
        {filename: 'Rear_right_window.stl'},
        {filename: 'Rear_T_logo.stl'},
        {filename: 'Rightwindow_trim.stl'},
        {filename: 'rim_hub.stl'},
        {filename: 'Side_mirror_covers.stl'},
        {filename: 'Side_mirrors_and_chrome.stl'},
        */
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
    }

    for (const modelId of ids) {
      this.stlViewer.set_color(modelId, color);
    }
  }
}
