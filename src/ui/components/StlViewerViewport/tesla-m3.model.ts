
export const tm3ModelIds = {
  car: [1101, 1302],
  calipers: [2011, 6012, 4013, 5014],
  rims: [301, 302, 303, 304],
  headLights: [405],
  chromeTrim: [501, 502, 503, 504, 506, 507],
  windows: [601, 602, 603, 604],
}

export default function(colors) {
  const modelIds = tm3ModelIds;

  const {
    carColor,
    headLightsColor,
    rimColor,
    caliperColor,
    chromeTrimColor,
    windowsColor,
  } = colors;

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
  const windshieldOpacity = 0.5;

  return [
    // All coordinates are offsets relative to the car model.
    // Looking from the front
    {id: modelIds.car[0], display: 'smooth', filename: 'rest_of_car.stl', color: carColor},

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
      color: windshieldColor, opacity: windshieldOpacity, display: 'smooth',
      y: 310, z: 810},
    {filename: 'Rear_glass_roof_and_window.stl',
     color: '#222222', opacity: .93, display: 'smooth',
     y: 500, z: -1230},
    {filename: 'Front_glass_roof.stl',
     color: '#222222', opacity: .93, display: 'smooth'
     y: 600, z: -50},

    {filename: 'Front_flashlights.stl', color: rearLightsColor, opacity: .9, y: -380, z: 2200},
    {filename: 'Rear_flashlights.stl', color: rearLightsColor, opcaity: .9, y: -415, z: -2245},

    {id: modelIds.headLights[0],
     filename: 'front_headlights.stl',
     color: headLightsColor, opacity: .87, display: 'smooth',
     y: -87, z: 2033},
    {filename: 'Rear_lights.stl',
     color: rearLightsColor, opacity: .9, display: 'smooth',
     y: 92, z: -2060},

    {id: modelIds.chromeTrim[0], filename: 'Left_window_trim.stl',
      color: chromeTrimColor, x: 740, y: 340, z: -275}, // right
    {id: modelIds.chromeTrim[1], filename: 'Rightwindow_trim.stl',
      color: chromeTrimColor, x: -740, y: 340, z: -275}, // left
    {id: modelIds.car[1], filename: 'Side_mirror_covers.stl', color: carColor, y: 187, z: 733},
    {id: modelIds.chromeTrim[2], filename: 'Side_mirrors_and_chrome.stl', color: chromeTrimColor, y: 165, z: 833},

    {id: modelIds.chromeTrim[3], filename: 'Door_handles_and_side_cams.stl',
      color: chromeTrimColor, y: -10, z: 100},

    {id: modelIds.windows[0], display: 'smooth', filename: 'Front_left_window.stl',
      color: windowsColor, opacity: windshieldOpacity,
      x: 745, y: 340, z: 277}, // right window
    {id: modelIds.windows[1], display: 'smooth', filename: 'Front_right_window.stl',
      color: windowsColor, opacity: windshieldOpacity,
      x: -745, y: 340, z: 277}, // left window
    {id: modelIds.windows[2], display: 'smooth', filename: 'Rear_left_window.stl',
      color: windowsColor, opacity: windshieldOpacity,
      x: 720, y: 380, z: -905},
    {id: modelIds.windows[3], display: 'smooth', filename: 'Rear_right_window.stl',
      color: windowsColor, opacity: windshieldOpacity,
      x: -720, y: 380, z: -905},

    {id: modelIds.chromeTrim[4], filename: 'Rear_T_logo.stl',
     color: chromeTrimColor, y: 143, z: -2346},
    {id: modelIds.chromeTrim[5], filename: 'Front_T_logo.stl',
     color: chromeTrimColor, y: -112, z: 2270},
  ];
}