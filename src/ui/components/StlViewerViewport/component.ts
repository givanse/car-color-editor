import Component, { tracked } from '@glimmer/component';
import getTM3Models, {tm3ModelIds} from './tesla-m3.model';

export default class StlViewerViewport extends Component {

  public stlViewer;

  @tracked
  public carColor: string;
  @tracked
  public caliperColor: string;
  @tracked
  public rimColor: string;
  @tracked
  public headLightsColor: string;
  @tracked
  public chromeTrimColor: string;
  @tracked
  public windowsColor: string;
  @tracked
  public all3dFilesLoaded: boolean = false;

  constructor(options) {
    super(options);

    if (window.location.hash) {
      this.parseHash(window.location.hash);
    } else {
      this.useDefaultColors();
    }

    this.updateQueryParams();
  }

  public parseHash(hash: string) {

    const search = hash.substring(hash.indexOf('?') + 1);
    const queryParams = search.split('&');

    for (const qp of queryParams) {
      const [key, value] = qp.split('=');
      this[key] = '#' + value; // TODO: color hashes are a mess
    }
  }

  public useDefaultColors() {
    this.carColor = '#b18f15';
    this.caliperColor = '#8916d1';
    this.rimColor = '#181818';
    this.headLightsColor = '#f1f1f1';
    this.chromeTrimColor = '#363636';
    this.windowsColor = '#000000';
  }

  public didInsertElement() {
    const { firstNode } = this.bounds;
    const hostElement = firstNode.parentElement.querySelector('#stl_cont');
    this.stlViewer = this.initStlViewwer(hostElement);
  }

  public buildQueryParams(obj) {
    let qp = '';

    for (const key of Object.keys(obj)) {
      if (qp) {
        qp += '&';
      }
      qp += `${key}=${obj[key]}`;
    }

    return qp;
  }

  public updateQueryParams() {
    function removeHash(s) { return s.replace('#', ''); }

    const values = {
      carColor: removeHash(this.carColor),
      caliperColor: removeHash(this.caliperColor),
      rimColor: removeHash(this.rimColor),
      chromeTrimColor: removeHash(this.chromeTrimColor),
      headLightsColor: removeHash(this.headLightsColor),
      windowsColor: removeHash(this.windowsColor),
    };

    const qp = this.buildQueryParams(values);
    window.location.hash = '?' + qp;
  }

  public updateColor(colorName: string, color: string, opacity: number = 1) {
    this[colorName] = color;
    // TODO: maybe turn into a proper map
    let ids;
    const modelIds = tm3ModelIds;
    switch (colorName) {
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

      if (opacity != 1) {
        this.stlViewer.set_opacity(modelId, opacity);
      }
    }

    this.updateQueryParams();
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
      auto_rotate: true,
      camerax: 3750,
      cameray: 1000,
      zoom: 4000,
      bgcolor: 'white',
      all_loaded_callback: function() {
        this.all3dFilesLoaded = true;
      }.bind(this),
      models: getTM3Models(colors),
    };
    const StlViewer = window.StlViewer;
    return new StlViewer(hostElement, initParams);
  }
}
