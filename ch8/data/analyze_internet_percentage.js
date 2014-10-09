/* global require */
var d3 = require('d3'),
    fs = require('fs'),
    dictionary = {},
    countries = require('./country_names.json'),
    names = d3.map(countries).entries(),
    scale = d3.scale.quantize()
              .domain([0, 100])
              .range(d3.range(5));

  function name_from_iso (iso_a3) {
    var countries = names.filter(function(d) {
      return d.value.iso_a3 === iso_a3;
    });
    return countries[0] ? countries[0].key : iso_a3;
  }

fs.readFile('./un_Internet_precentage.csv', 'utf-8', function (err, data) {
  d3.csv.parse(data)
    .filter(function(d){ return d.Year === "2012";})
    .forEach(function(d) {
      dictionary[name_from_iso(d["Country or Area Code"])] = scale(d.Value);
    });

  console.log(JSON.stringify(dictionary));
});

