/* global naver */

export default class NaverMapRegion {
  constructor(map) {
    this.map = map;
    this.geoJsonUrl = null;
    this.keyPropNm = undefined;
    this.clickHandle = null;
    this.completedHandle = null;
    this.polygonMap = {};
    this.polylineList = [];
    this.strokeWeight = 1.5;
    this.strokeColor = "#ffffff";
    this.strokeOpacity = 1;
    this.fillColor = "#b0b0b0";
    this.fillOpacity = 0.4;
  }

  setGeoJsonUrl(url) {
    this.geoJsonUrl = url;
    return this;
  }

  setkeyPropNm(keyPropNm) {
    this.keyPropNm = keyPropNm;
    return this;
  }

  setClickHandle(fn) {
    this.clickHandle = fn;
    return this;
  }

  setCompletedHandle(fn) {
    this.completedHandle = fn;
    return this;
  }

  setOption(key, name, value) {
    let realKey = "p_" + key;
    if (this.polygonMap[realKey]) {
      let opt = {};
      opt[name] = value;
      this.polygonMap[realKey].polygons.forEach((p) => p.setOptions(opt));
    }
  }

  setOptionAll(name, value) {
    let opt = {};
    opt[name] = value;
    for (let key in this.polygonMap) {
      this.polygonMap[key].polygons.forEach((p) => p.setOptions(opt));
    }
  }

  setZIndex(key, zIndex) {
    let realKey = "p_" + key;
    if (this.polygonMap[realKey]) {
      this.polygonMap[realKey].polygons.forEach((p) => p.setZIndex(zIndex));
    }
  }

  setZIndexAll(zIndex) {
    for (let key in this.polygonMap) {
      this.polygonMap[key].polygons.forEach((p) => p.setZIndex(zIndex));
    }
  }

  _drawPolygon(paths, prop) {
    let polygon = new naver.maps.Polygon({
      map: this.map,
      paths: paths,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      strokeStyle: "solid",
      strokeWeight: this.strokeWeight,
      strokeColor: this.strokeColor,
      strokeOpacity: this.strokeOpacity,
      clickable: !!this.clickHandle,
    });

    if (this.clickHandle) {
      let listener = naver.maps.Event.addListener(polygon, "click", () => {
        this.clickHandle(this, prop);
      });
      if (this.keyPropNm && prop[this.keyPropNm] !== undefined) {
        let key = "p_" + prop[this.keyPropNm];
        if (!this.polygonMap[key])
          this.polygonMap[key] = { polygons: [], listener };
        this.polygonMap[key].polygons.push(polygon);
      }
    }
  }

  _drawPolyline(paths) {
    let coords = paths.map((c) => new naver.maps.LatLng(c[1], c[0]));
    let polyline = new naver.maps.Polyline({
      path: coords,
      strokeColor: "#5645d4",
      strokeOpacity: 0.6,
      strokeWeight: 1.5,
      strokeStyle: "solid",
      map: this.map,
    });
    this.polylineList.push(polyline);
  }

  drawGeoJson() {
    if (!this.geoJsonUrl) return;
    fetch(this.geoJsonUrl)
      .then((res) => res.json())
      .then((geoJson) => {
        let features = geoJson.features || [];
        features.forEach((feature) => {
          let coordinates = feature.geometry.coordinates;
          coordinates.forEach((paths) => {
            if (paths.length === 1) paths = paths[0];
            this._drawPolyline(paths);
          });
        });
        if (this.completedHandle) this.completedHandle(this);
      })
      .catch((err) => console.error("GeoJSON load error:", err));
  }

  clearAll() {
    this.polylineList.forEach((p) => p.setMap(null));
    this.polylineList = [];
    for (let key in this.polygonMap) {
      let { polygons, listener } = this.polygonMap[key];
      if (listener) naver.maps.Event.removeListener(listener);
      polygons.forEach((p) => p.setMap(null));
    }
    this.polygonMap = {};
  }
}
