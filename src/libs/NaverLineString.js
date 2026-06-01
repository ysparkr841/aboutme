export default class LineString {
  constructor(paths, properties) {
    this.feature = {};
    this._bindFeatures(paths, properties);
  }

  _bindFeatures(paths, properties) {
    if (!paths) return;
    let coordinates = [];
    let arrays = paths.getArray();
    arrays.forEach((latlng) => {
      coordinates.push([latlng._lng, latlng._lat]);
    });
    this.feature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: properties || {},
          geometry: {
            coordinates: coordinates,
            type: "LineString",
          },
        },
      ],
    };
  }
}
