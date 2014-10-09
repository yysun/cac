/* global require */
var d3 = require('d3'),
    dictionary = {},
    topojson = require('topojson'),
    topojson_countries = require('./topo_countries_110m.json'),
    countries = topojson.feature(topojson_countries,
        topojson_countries.objects.countries_110m).features,
    neighbors = topojson.neighbors(
        topojson_countries.objects.countries_110m.geometries);

for (var i = 0; i < countries.length; i++) {
  dictionary[countries[i].id] =
  countries[i].color = d3.max(neighbors[i], function(n){ return countries[n].color;}) + 1 || 0;
}
console.log(JSON.stringify(dictionary));


/*
for (var i = 0; i < countries.length; i++) {
  var color = countries[i].color,
      match = neighbors[i]
        .map(function (d) { return countries[d]; })
        .filter(function (d) { return d.color = color; });

  if (match.length) {
    console.log(i, countries[i].id + ',' + countries[i].color, neighbors[i]);
  }
}
*/


