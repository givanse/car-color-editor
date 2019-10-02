import Component, { tracked } from '@glimmer/component';
import getTM3Models from './tesla-m3.model';

const modelIds = {
  car: [1101, 1302],
  calipers: [2011, 6012, 4013, 5014],
  rims: [301, 302, 303, 304],
  headLights: [405],
  chromeTrim: [501, 502, 503, 504, 506, 507],
  windows: [601, 602, 603, 604],
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
  windowsColor: string;
  @tracked
  all3dFilesLoaded: boolean = false;

  constructor(options) {
    super(options);

    this.carColor = '#b18f15';
    this.caliperColor = '#8916d1';
    this.rimColor = '#181818';
    this.headLightsColor = '#f1f1f1';
    this.chromeTrimColor = '#363636';
    this.windowsColor = '#9ec8ef';
  }

  public didInsertElement() {
    const { firstNode } = this.bounds;
    const hostElement = firstNode.parentElement.querySelector('#stl_cont');
    this.stlViewer = this.initStlViewwer(hostElement);
  }

  private initStlViewwer(hostElement) {

    const colors = {
      headLightsColor: this.headLightsColor,
      rimColor: this.rimColor,
      carColor: this.carColor,
      caliperColor: this.caliperColor,
      chromeTrimColor: this.chromeTrimColor,
      windowsColor: this.windowsColor,
    };

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
      models: getTM3Models(modelIds, colors),
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
      case 'windowsColor':
        ids = modelIds.windows;
        break;
    }

    for (const modelId of ids) {
      this.stlViewer.set_color(modelId, color);
    }
  }
}
