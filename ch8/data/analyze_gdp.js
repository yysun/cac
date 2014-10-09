/*jslint node: true */
var d3 = require('d3'),
    fs = require('fs'),
    dictionary = {},
    countries = require('./country_names.json'),
    names = d3.map(countries).entries();

  function name_from_iso (iso_a3) {
    var countries = names.filter(function(d) {
      return d.value.iso_a3 === iso_a3;
    });
    return countries[0] ? countries[0].key : iso_a3;
  }

  fs.readFile('./un_gdp.csv', 'utf-8', function (err2, data) {
    d3.csv.parse(data)
      .filter(function(d){ return d.Year === "2012" &&
        d["Country or Area Code"] !== 'EAP' &&
        d["Country or Area Code"] !== 'EMU' &&
        parseFloat(d.Value) < 16000000000000;})
      .forEach(function(d) {
        dictionary[name_from_iso(d["Country or Area Code"])] =
            parseFloat(d.Value) / 100000000; // 亿为单位
      });
    console.log(JSON.stringify(dictionary));
  });



