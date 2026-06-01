export default class Feature {
  constructor(paths, properties) {
    this.feature = {};
    this._bindFeatures(paths, properties);
  }

  _bindFeatures(paths, properties) {
    if (!paths) return;
    let pths = [];
    let arrays = paths.getArray();
    arrays.forEach((latlng) => {
      pths.push([latlng._lng, latlng._lat]);
    });
    this.feature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: properties || {},
          geometry: {
            coordinates: [pths],
            type: "Polygon",
          },
        },
      ],
    };
  }
}
