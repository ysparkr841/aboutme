/* global naver */
import Feature from "./NaverFeature";
import LineString from "./NaverLineString";

export default class NaverDraw {
  constructor(buttons = {}, options = {}) {
    this.$btnDistance = buttons.distance || null;
    this.$btnArea = buttons.area || null;
    this.$geo = buttons.geo || null;
    this.$download = buttons.download || null;
    this.$modify = buttons.modify || null;
    this.$line = buttons.line || null;
    this.$circle = buttons.circle || null;
    this.$pinpoint = buttons.pinpoint || null;

    this._onFinish = options.onFinish || null;

    this.polylineList = [];
    this.polygonList = [];
    this.drawingList = [];
    this.featureList = [];
    this.lineList = [];
    this.drawingClrList = [];
    this.radiusCircleList = [];
    this.radiusLineList = [];
    this.pinpointMarkerList = [];
    this.pinpointInfoWindowList = [];
    this.modifyMarkerList = [];
    this.modifyObjMap = {};
    this.indexList = [];
    this.property = {};

    this._mode = null;
    this.isCtrl = false;
    this.popState = false;
    this.modeAfterProp = "";
    this.fileTitle = "";
    this._docMouseMoveHandler = null;

    this.colorList = [
      "#2a85f3",
      "#d1a11a",
      "#12a9bb",
      "#7158d0",
      "#d77d27",
      "#3162ee",
      "#f0424b",
      "#5B9BD5",
      "#ED7D31",
      "#5a6efb",
      "#84bd07",
      "#ff9c00",
      "#e74243",
      "#79b4ff",
      "#ce9a5c",
      "#67b7ab",
      "#c386e0",
      "#8498fd",
      "#38b85b",
      "#9ca708",
      "#812fff",
      "#e74243",
      "#35aac6",
      "#3170ff",
      "#ac8a62",
      "#8b9099",
      "#dbc427",
      "#9ca708",
      "#9460ff",
    ];
    this.colorIdx = 0;

    this._bindKeyEvents();
    if (Object.keys(buttons).length > 0) {
      this._bindDOMEvents();
    }
  }

  setMap(map) {
    if (this.map) {
      this._unbindMap(this.map);
    }
    this.map = map;
    if (map) {
      this._bindMap(map);
    }
  }

  startMode(mode) {
    if (!mode) return;
    if (mode === "distance") this._startDistance();
    if (mode === "area") this._startArea();
    if (mode === "geo") this._startGeo();
    if (mode === "download") this._startDownload();
    if (mode === "modify") this._startModify();
    if (mode === "line") this._startLine();
    if (mode === "circle") this._startCircle();
    if (mode === "pinpoint") this._startPinpoint();
  }

  finishMode(mode) {
    if (!mode) return;
    if (mode === "distance") this._finishDistance();
    if (mode === "area") this._finishArea();
    if (mode === "geo") this._finishGeo();
    if (mode === "modify") this._finishModify();
    if (mode === "line") this._finishLine();
    if (mode === "pinpoint") this._finishPinpoint();
  }

  clearAll() {
    this.drawingList.forEach((d) => d.setMap(null));
    this.drawingList = [];
    this.featureList = [];
    this.drawingClrList = [];
    this.colorIdx = 0;
    if (this._onFinish) this._onFinish();
  }

  featureClear() {
    this.featureList = [];
  }

  drawingClrClear() {
    this.drawingClrList = [];
  }

  addFeature(feature) {
    if (this.featureList) {
      this.featureList.push(feature);
    }
  }

  _deactivateAllButtons() {
    [
      this.$btnDistance,
      this.$btnArea,
      this.$geo,
      this.$download,
      this.$modify,
      this.$line,
      this.$circle,
      this.$pinpoint,
    ].forEach((btn) => {
      if (btn) {
        btn.classList.remove("control-on");
        btn.blur();
      }
    });
  }

  _removeDocMouseMove() {
    if (this._docMouseMoveHandler) {
      document.removeEventListener("mousemove", this._docMouseMoveHandler);
      this._docMouseMoveHandler = null;
    }
  }

  _startDistance() {
    this._distanceListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickDistance.bind(this)
      ),
    ];
    this.map.setCursor("crosshair");
  }

  _startArea() {
    this._areaListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickArea.bind(this)
      ),
      naver.maps.Event.addListener(
        this.map,
        "rightclick",
        this._finishArea.bind(this)
      ),
    ];
    this._docMouseMoveHandler = this._onMouseMoveArea.bind(this);
    document.addEventListener("mousemove", this._docMouseMoveHandler);
    this.map.setCursor("crosshair");
  }

  _startGeo() {
    this._geoListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickGeo.bind(this)
      ),
      naver.maps.Event.addListener(
        this.map,
        "rightclick",
        this._finishGeo.bind(this)
      ),
      naver.maps.Event.addListener(
        this.map,
        "keydown",
        this._keyupGeo.bind(this)
      ),
    ];
    this._docMouseMoveHandler = this._onMouseMoveGeo.bind(this);
    document.addEventListener("mousemove", this._docMouseMoveHandler);
    this.map.setCursor("crosshair");
  }

  _startModify() {
    this._modifyListners = [
      naver.maps.Event.addListener(
        this.map,
        "rightclick",
        this._finishModify.bind(this)
      ),
    ];
    this.map.setCursor("crosshair");

    if (this.drawingList && this.drawingList.length > 0) {
      this.drawingList.forEach((d, idx) => {
        d.setOptions({ clickable: true });
        let event = naver.maps.Event.addListener(d, "click", () => {
          this._setDefaultColor();
          this._deleteModifyMarkers();
          d.setOptions({
            fillColor: "#f00",
            strokeStyle: "shortdash",
            strokeColor: "#f00",
          });
          this._setPolygonPoint(d);
          this._setPolygonLine(d, idx);
        });
        this._modifyListners.push(event);
      });
    } else {
      this._clearMode("modify");
    }
  }

  _startDownload() {
    if (this.featureList.length > 0) {
      if (this.indexList.length === 0) {
        alert("좌하단 다운받을 객체를 먼저 선택해주세요.");
        return;
      }
      this.featureList.forEach((d, idx) => {
        if (this.indexList.includes(idx)) {
          let jsonString = JSON.stringify(d, null, 4);
          let blob = new Blob([jsonString], { type: "application/json" });
          let url = URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.href = url;
          let fileName = "geo" + idx;
          if (
            d.features &&
            d.features[0] &&
            d.features[0].properties &&
            d.features[0].properties.title
          ) {
            fileName = d.features[0].properties.title;
          } else if (this.fileTitle) {
            fileName = this.fileTitle;
          }
          link.download = fileName + ".json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });
    } else {
      alert("다운받을 객체가 없습니다.");
      return;
    }
    this._deactivateAllButtons();
    this._mode = null;
  }

  _startLine() {
    this._lineListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickLine.bind(this)
      ),
    ];
    this.map.setCursor("crosshair");
  }

  _startCircle() {
    this._circleListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickCircle.bind(this)
      ),
    ];
    this.map.setCursor("crosshair");
  }

  _startPinpoint() {
    this._pinpointListeners = [
      naver.maps.Event.addListener(
        this.map,
        "click",
        this._onClickPinpoint.bind(this)
      ),
      naver.maps.Event.addListener(
        this.map,
        "rightclick",
        this._finishPinpoint.bind(this)
      ),
    ];
    this.map.setCursor("crosshair");
  }

  _onClickPinpoint(e) {
    var coord = e.coord;
    var lat = coord.lat().toFixed(7);
    var lng = coord.lng().toFixed(7);

    var marker = new naver.maps.Marker({ position: coord, map: this.map });
    var infoWindow = new naver.maps.InfoWindow({
      content:
        '<div style="padding:8px 12px;font-size:13px;line-height:1.8;min-width:160px;">' +
        "<b>좌표 정보</b><br>위도: " +
        lat +
        "<br>경도: " +
        lng +
        "</div>",
      borderColor: "#555",
      backgroundColor: "#fff",
      borderWidth: 1,
    });
    infoWindow.open(this.map, marker);
    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) infoWindow.close();
      else infoWindow.open(this.map, marker);
    });
    this.pinpointMarkerList.push(marker);
    this.pinpointInfoWindowList.push(infoWindow);
  }

  _finishPinpoint() {
    if (this._pinpointListeners) {
      naver.maps.Event.removeListener(this._pinpointListeners);
      delete this._pinpointListeners;
    }
    if (this.$pinpoint) {
      this.$pinpoint.classList.remove("control-on");
      this.$pinpoint.blur();
    }
    this.map.setCursor("auto");
    this._mode = null;
  }

  _finishDistance() {
    if (!this._distanceListeners) return;
    naver.maps.Event.removeListener(this._distanceListeners);
    delete this._distanceListeners;

    this._removeDocMouseMove();

    if (this._guideline) {
      this._guideline.setMap(null);
      delete this._guideline;
    }

    if (this._polyline) {
      var path = this._polyline.getPath();
      var lastCoord = path.getAt(path.getLength() - 1);
      var distance = this._polyline.getDistance();
      this.polylineList.push(this._polyline);
      delete this._polyline;
      if (lastCoord) {
        this._addMileStone(lastCoord, this._fromMetersToText(distance), {
          "font-size": "14px",
          "font-weight": "bold",
          color: "#f00",
        });
      }
    }

    if (this.$btnDistance) {
      this.$btnDistance.classList.remove("control-on");
      this.$btnDistance.blur();
    }
    this.map.setCursor("auto");
    delete this._lastDistance;
    this._mode = null;
  }

  _finishLine() {
    if (!this._lineListeners) return;
    naver.maps.Event.removeListener(this._lineListeners);
    delete this._lineListeners;

    this._removeDocMouseMove();

    if (this._guideDrawline) {
      this._guideDrawline.setMap(null);
      delete this._guideDrawline;
    }

    if (this._polyDrawline) {
      this.drawingList.push(this._polyDrawline);
      this.drawingClrList.push(this._polyDrawline.getOptions("strokeColor"));
      let paths = this._polyDrawline.getPath();
      let feature = new LineString(paths, this.property);
      if (feature) this.featureList.push(feature.feature);
      delete this._polyDrawline;
    }

    this._deactivateAllButtons();
    this.map.setCursor("auto");
    this.modeAfterProp = "";
    this._mode = null;
    this.colorIdx =
      this.colorIdx < this.colorList.length - 1 ? this.colorIdx + 1 : 0;
    this.property = {};
    if (this._onFinish) this._onFinish();
  }

  _finishArea() {
    if (!this._areaListeners) return;
    naver.maps.Event.removeListener(this._areaListeners);
    delete this._areaListeners;

    this._removeDocMouseMove();

    if (this._polygon) {
      var path = this._polygon.getPath();
      path.pop();
      var squarMeters = this._polygon.getAreaSize();
      var lastCoord = path.getAt(path.getLength() - 1);
      if (lastCoord) {
        this._addMileStone(
          lastCoord,
          this._fromSquareMetersToText(squarMeters),
          {
            "font-size": "14px",
            "font-weight": "bold",
            color: "#00f",
          }
        );
      }
      this.polygonList.push(this._polygon);
      delete this._polygon;
    }

    if (this.$btnArea) {
      this.$btnArea.classList.remove("control-on");
      this.$btnArea.blur();
    }
    this.map.setCursor("auto");
    this._mode = null;
  }

  _finishGeo() {
    if (!this._geoListeners) return;
    naver.maps.Event.removeListener(this._geoListeners);
    delete this._geoListeners;

    this._removeDocMouseMove();

    if (this._polygonDrawing) {
      var path = this._polygonDrawing.getPath();
      path.pop();
      this.drawingList.push(this._polygonDrawing);
      this.drawingClrList.push(this._polygonDrawing.getOptions("fillColor"));
      let paths = this._polygonDrawing.getPath();
      let arr = paths.getArray ? paths.getArray() : paths._array;
      let centerLat = 0,
        centerLng = 0;
      if (arr && arr.length > 0) {
        arr.forEach((latlng) => {
          centerLat += latlng._lat;
          centerLng += latlng._lng;
        });
        centerLat = parseFloat((centerLat / arr.length).toFixed(7));
        centerLng = parseFloat((centerLng / arr.length).toFixed(7));
      }
      let featureProps = Object.assign({}, this.property, {
        LTTD_VAL: centerLat,
        LGTD_VAL: centerLng,
      });
      let feature = new Feature(paths, featureProps);
      if (feature) this.featureList.push(feature.feature);
      delete this._polygonDrawing;
      this.property = {};
    }

    this._deactivateAllButtons();
    this.map.setCursor("auto");
    this.colorIdx =
      this.colorIdx < this.colorList.length - 1 ? this.colorIdx + 1 : 0;
    this._mode = null;
    this.modeAfterProp = "";
    if (this._onFinish) this._onFinish();
  }

  _finishModify() {
    if (!this._modifyListners) return;
    naver.maps.Event.removeListener(this._modifyListners);
    this._setDefaultColor();
    this._deleteModifyMarkers();
    for (let key in this.modifyObjMap) {
      this.modifyObjMap[key].forEach((line) => line.setMap(null));
    }
    this.modifyObjMap = {};
    this._refreshMidpointsFn = null;
    this.drawingList.forEach((d) => d.setOptions({ clickable: false }));

    let savedProps = this.featureList.map((f) =>
      f && f.features && f.features[0] && f.features[0].properties
        ? f.features[0].properties
        : {}
    );
    this.featureClear();

    this.drawingList.forEach((d, idx) => {
      let paths = d.getPath();
      let props = savedProps[idx] || {};
      let feature =
        typeof d.getPaths === "function"
          ? new Feature(paths, props)
          : new LineString(paths, props);
      if (feature) this.featureList.push(feature.feature);
    });
    this._deactivateAllButtons();
    this.map.setCursor("auto");
    this._mode = null;
  }

  _finishCircle() {
    if (!this._circleListeners) return;
    naver.maps.Event.removeListener(this._circleListeners);
    delete this._circleListeners;

    this._removeDocMouseMove();

    if (this._polyDrawRadiusLine) {
      var path = this._polyDrawRadiusLine.getPath();
      var lastCoord = path.getAt(path.getLength() - 1);
      var distance = this._polyDrawRadiusLine.getDistance();
      if (lastCoord) {
        this._addMileStone(lastCoord, this._fromMetersToTextCircle(distance), {
          "font-size": "14px",
          "font-weight": "bold",
          color: "#59008c",
        });
      }
    }
    if (this._guideDrawRadiusline) {
      this._guideDrawRadiusline.setMap(null);
      delete this._guideDrawRadiusline;
    }
    if (this._polyDrawRadiusLine) {
      this.radiusLineList.push(this._polyDrawRadiusLine);
      delete this._polyDrawRadiusLine;
    }
    if (this._radiusCircle) {
      this.radiusCircleList.push(this._radiusCircle);
      delete this._radiusCircle;
    }

    this._deactivateAllButtons();
    this.map.setCursor("auto");
    this.modeAfterProp = "";
    this._mode = null;
    this.colorIdx =
      this.colorIdx < this.colorList.length - 1 ? this.colorIdx + 1 : 0;
  }

  _fromMetersToText(meters) {
    meters = meters || 0;
    return meters >= 1000
      ? parseFloat((meters / 1000).toFixed(1)) + "km"
      : parseFloat(meters.toFixed(1)) + "m";
  }

  _fromMetersToTextCircle(meters) {
    meters = meters || 0;
    return meters >= 1000
      ? "반경 : " + parseFloat((meters / 1000).toFixed(1)) + "km"
      : "반경 : " + parseFloat(meters.toFixed(1)) + "m";
  }

  _fromSquareMetersToText(squarMeters) {
    squarMeters = squarMeters || 0;
    var squarKm = 1000 * 1000;
    return squarMeters >= squarKm
      ? parseFloat((squarMeters / squarKm).toFixed(1)) + "km<sup>2</sup>"
      : parseFloat(squarMeters.toFixed(1)) + "m<sup>2</sup>";
  }

  _addMileStone(coord, text, css) {
    if (!this._ms) this._ms = [];
    var ms = new naver.maps.Marker({
      position: coord,
      icon: {
        content:
          '<div style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;"><span>' +
          text +
          "</span></div>",
        anchor: new naver.maps.Point(-5, -5),
      },
      map: this.map,
    });
    var el = ms.getElement();
    if (css) {
      Object.keys(css).forEach((k) => {
        el.style[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = css[k];
      });
    } else {
      el.style.fontSize = "11px";
    }
    this._ms.push(ms);
  }

  _onClickDistance(e) {
    var coord = e.coord;
    if (!this._polyline) {
      this._guideline = new naver.maps.Polyline({
        strokeColor: "#f00",
        strokeWeight: 2,
        strokeStyle: [4, 4],
        strokeOpacity: 0.6,
        path: [coord],
        map: this.map,
      });
      this._docMouseMoveHandler = this._onMouseMoveDistance.bind(this);
      document.addEventListener("mousemove", this._docMouseMoveHandler);
      this._distanceListeners.push(
        naver.maps.Event.addListener(
          this.map,
          "rightclick",
          this._finishDistance.bind(this)
        )
      );
      this._polyline = new naver.maps.Polyline({
        strokeColor: "#f00",
        strokeWeight: 2,
        strokeOpacity: 0.8,
        path: [coord],
        map: this.map,
      });
      this._lastDistance = this._polyline.getDistance();
    } else {
      this._guideline.setPath([e.coord]);
      this._polyline.getPath().push(coord);
      var distance = this._polyline.getDistance();
      this._addMileStone(
        coord,
        this._fromMetersToText(distance - this._lastDistance)
      );
      this._lastDistance = distance;
    }
  }

  _onClickLine(e) {
    var coord = e.coord;
    let color = this.colorList[this.colorIdx];
    if (!this._polyDrawline) {
      this._guideDrawline = new naver.maps.Polyline({
        strokeColor: "#01a035",
        strokeWeight: 2,
        strokeStyle: "solid",
        strokeOpacity: 0.6,
        path: [coord],
        map: this.map,
      });
      this._docMouseMoveHandler = this._onMouseMoveLine.bind(this);
      document.addEventListener("mousemove", this._docMouseMoveHandler);
      this._lineListeners.push(
        naver.maps.Event.addListener(
          this.map,
          "rightclick",
          this._finishLine.bind(this)
        )
      );
      this._polyDrawline = new naver.maps.Polyline({
        strokeColor: color,
        strokeWeight: 2,
        strokeOpacity: 0.8,
        path: [coord],
        map: this.map,
      });
    } else {
      this._guideDrawline.setPath([e.coord]);
      this._polyDrawline.getPath().push(coord);
    }
  }

  _onClickCircle(e) {
    var coord = e.coord;
    if (!this._polyDrawRadiusLine) {
      this._radiusCircle = new naver.maps.Circle({
        map: this.map,
        center: coord,
        radius: 0,
        fillColor: "#e1acff",
        strokeOpacity: 1,
        strokeColor: "#9c1ae8",
        fillOpacity: 0.2,
        strokeWeight: 3,
      });
      this._guideDrawRadiusline = new naver.maps.Polyline({
        strokeColor: "#9c1ae8",
        strokeWeight: 2,
        strokeStyle: [4, 4],
        strokeOpacity: 0.6,
        path: [coord],
        map: this.map,
        startIcon: 3,
        endIcon: 3,
      });
      this._docMouseMoveHandler = this._onMouseMoveCircle.bind(this);
      document.addEventListener("mousemove", this._docMouseMoveHandler);
      this._polyDrawRadiusLine = new naver.maps.Polyline({
        strokeColor: "#610099",
        strokeWeight: 2,
        strokeStyle: [4, 4],
        strokeOpacity: 0.8,
        startIcon: 3,
        endIcon: 3,
        path: [coord],
        map: this.map,
      });
    } else {
      this._guideDrawRadiusline.setPath([e.coord]);
      this._polyDrawRadiusLine.getPath().push(coord);
      this._finishCircle();
    }
  }

  _onMouseMoveDistance(e) {
    var proj = this.map.getProjection();
    var coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
    var path = this._guideline.getPath();
    if (path.getLength() === 2) path.pop();
    path.push(coord);
  }

  _onClickArea(e) {
    var coord = e.coord;
    if (!this._polygon) {
      this._polygon = new naver.maps.Polygon({
        strokeColor: "#00f",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#00f",
        fillOpacity: 0.3,
        paths: [coord],
        map: this.map,
      });
    } else {
      this._polygon.getPath().push(coord);
    }
  }

  _onMouseMoveArea(e) {
    if (!this._polygon) return;
    var proj = this.map.getProjection();
    var coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
    var path = this._polygon.getPath();
    if (path.getLength() >= 2) path.pop();
    path.push(coord);
  }

  _onMouseMoveLine(e) {
    var proj = this.map.getProjection();
    var coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
    var path = this._guideDrawline.getPath();
    if (path.getLength() === 2) path.pop();
    path.push(coord);
  }

  _onMouseMoveCircle(e) {
    var proj = this.map.getProjection();
    var coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
    let distance = this._guideDrawRadiusline.getDistance();
    this._radiusCircle.setRadius(distance);
    var path = this._guideDrawRadiusline.getPath();
    if (path.getLength() === 2) path.pop();
    path.push(coord);
  }

  _onClickGeo(e) {
    var coord = e.coord;
    let color = this.colorList[this.colorIdx];
    if (!this._polygonDrawing) {
      this._polygonDrawing = new naver.maps.Polygon({
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.3,
        paths: [coord],
        map: this.map,
      });
    } else {
      this._polygonDrawing.getPath().push(coord);
    }
  }

  _onMouseMoveGeo(e) {
    if (!this._polygonDrawing) return;
    var proj = this.map.getProjection();
    var coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
    var path = this._polygonDrawing.getPath();
    if (path.getLength() >= 2) path.pop();
    path.push(coord);
  }

  _keyupGeo(e) {
    if (e.domEvent.key === "z" && this.isCtrl) {
      var path = this._polygonDrawing.getPath();
      if (path.getLength() > 2) {
        path.pop();
      } else {
        path.clear();
        this._clearMode("geo");
      }
    }
  }

  _setDefaultColor() {
    if (!this.drawingList) return;
    this.drawingList.forEach((polygon, idx) => {
      let color = this.drawingClrList[idx];
      if (typeof polygon.getPaths === "function") {
        polygon.setOptions({
          fillColor: color,
          strokeStyle: "solid",
          strokeColor: color,
        });
      } else {
        polygon.setOptions({ strokeStyle: "solid", strokeColor: color });
      }
    });
  }

  _deleteModifyMarkers() {
    if (this.modifyMarkerList) {
      this.modifyMarkerList.forEach((marker) => marker.setMap(null));
    }
  }

  _setPolygonPoint(polygon) {
    let type =
      typeof polygon.getPaths === "function" ? "Polygon" : "LineString";
    let mvcArr =
      type === "Polygon" ? polygon.getPaths().getAt(0) : polygon.getPath();
    let list = [];
    for (let i = 0; i < mvcArr.getLength(); i++) {
      var marker = new naver.maps.Marker({
        position: mvcArr.getAt(i),
        map: this.map,
      });
      marker.setDraggable(true);
      list.push(marker);
    }
    this.modifyMarkerList = list;
  }

  _setPolygonLine(polygon, idx) {
    if (typeof this.modifyObjMap[idx] === "undefined")
      this.modifyObjMap[idx] = [];
    let type =
      typeof polygon.getPaths === "function" ? "Polygon" : "LineString";
    let initRing =
      type === "Polygon" ? polygon.getPaths().getAt(0) : polygon.getPath();
    let vertices = [];
    for (let j = 0; j < initRing.getLength(); j++)
      vertices.push(initRing.getAt(j));

    const applyVertices = () => {
      if (type === "Polygon") polygon.setPaths([vertices]);
      else polygon.setPath(vertices);
    };

    const refreshVertexMarkers = () => {
      if (this.modifyMarkerList)
        this.modifyMarkerList.forEach((m) => m.setMap(null));
      let list = [];
      for (let i = 0; i < vertices.length; i++) {
        let marker = new naver.maps.Marker({
          position: vertices[i],
          map: this.map,
          draggable: true,
        });
        naver.maps.Event.addListener(
          marker,
          "dragend",
          ((vi) => () => {
            vertices[vi] = marker.getPosition();
            applyVertices();
            if (this._refreshMidpointsFn) this._refreshMidpointsFn();
          })(i)
        );
        list.push(marker);
      }
      this.modifyMarkerList = list;
    };

    const refreshMidpoints = () => {
      this.modifyObjMap[idx].forEach((m) => m.setMap(null));
      this.modifyObjMap[idx] = [];
      const len = vertices.length;
      const edgeCount = type === "Polygon" ? len : len - 1;
      for (let i = 0; i < edgeCount; i++) {
        const p1 = vertices[i];
        const p2 = i < len - 1 ? vertices[i + 1] : vertices[0];
        const midMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            (p1._lat + p2._lat) / 2,
            (p1._lng + p2._lng) / 2
          ),
          map: this.map,
          icon: {
            content:
              '<div style="width:12px;height:12px;background:rgba(255,255,255,0.85);border:2px solid #555;border-radius:50%;cursor:crosshair;box-sizing:border-box;"></div>',
            anchor: new naver.maps.Point(6, 6),
          },
          draggable: true,
          zIndex: 50,
        });
        naver.maps.Event.addListener(
          midMarker,
          "dragend",
          ((ei) => () => {
            vertices.splice(ei + 1, 0, midMarker.getPosition());
            applyVertices();
            midMarker.setMap(null);
            refreshVertexMarkers();
            refreshMidpoints();
          })(i)
        );
        this.modifyObjMap[idx].push(midMarker);
      }
    };

    refreshVertexMarkers();
    this._refreshMidpointsFn = refreshMidpoints;
    refreshMidpoints();
  }

  _bindMap() {}

  _unbindMap() {
    if (this.unbindAll) this.unbindAll();
  }

  _bindKeyEvents() {
    document.addEventListener("keyup", (e) => {
      if (e.which === 17) this.isCtrl = false;
    });
    document.addEventListener("keydown", (e) => {
      if (e.which === 17) this.isCtrl = true;
    });
  }

  _bindDOMEvents() {
    const bind = (btn, mode) => {
      if (btn)
        btn.addEventListener("click", this._onClickButton.bind(this, mode));
    };
    bind(this.$btnDistance, "distance");
    bind(this.$btnArea, "area");
    bind(this.$geo, "geo");
    bind(this.$download, "download");
    bind(this.$modify, "modify");
    bind(this.$line, "line");
    bind(this.$circle, "circle");
    if (this.$pinpoint) bind(this.$pinpoint, "pinpoint");
  }

  _onClickButton(newMode, e) {
    e.preventDefault();
    var btn = e.currentTarget;
    var mode = this._mode;

    if (this.popState) {
      this.popState = false;
      this.modeAfterProp = "";
      this.property = {};
    }

    var shouldActivate = !btn.classList.contains("control-on");
    [
      this.$btnDistance,
      this.$btnArea,
      this.$geo,
      this.$download,
      this.$modify,
      this.$line,
      this.$circle,
      this.$pinpoint,
    ].forEach(($btn) => {
      if ($btn) $btn.classList.remove("control-on");
    });
    if (shouldActivate) btn.classList.add("control-on");

    this._clearMode(mode);

    if (mode === newMode) {
      this._mode = null;
      return;
    }

    if (newMode === "geo" || newMode === "line") {
      this._mode = newMode;
      this.popState = true;
      this.modeAfterProp = newMode;
      return;
    }

    this._mode = newMode;
    this.startMode(newMode);
  }

  _clearMode(mode) {
    if (!mode) return;
    if (mode === "distance") {
      if (this._polyline) {
        this._polyline.setMap(null);
        delete this._polyline;
      }
      this._finishDistance();
      if (this._ms) {
        this._ms.forEach((m) => m.setMap(null));
        delete this._ms;
      }
    } else if (mode === "area") {
      if (this._polygon) {
        this._polygon.setMap(null);
        delete this._polygon;
      }
      this._finishArea();
    } else if (mode === "geo") {
      if (this._polygonDrawing) {
        this._polygonDrawing.setMap(null);
        delete this._polygonDrawing;
      }
      this._finishGeo();
    } else if (mode === "modify") {
      this._finishModify();
    } else if (mode === "line") {
      this._finishLine();
    } else if (mode === "circle") {
      this._finishCircle();
    } else if (mode === "pinpoint") {
      this._finishPinpoint();
    }
  }
}
