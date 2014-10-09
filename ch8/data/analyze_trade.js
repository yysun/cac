/*jslint node: true */
var d3 = require('d3'),
    fs = require('fs'),
    dictionary = {},
    countries = require('./country_names.json'),
    names = d3.map(countries).entries();

fs.readFile('./un_trade.csv', 'utf-8', function (err2, dat) {
    var data = d3.csv.parse(dat);
    names.forEach(function(country) {
      var code = country.value.code,
          d1 = data.filter(function(d) {
            return d.Year === "2012" && d["Country or Area Code"] === code &&
                   d.Flow === "Import";
          })[0],
          d2 = data.filter(function(d) {
            return d.Year === "2012" && d["Country or Area Code"] === code &&
                   d.Flow === "Export";
          })[0];
      if(d1 && d2) {
        dictionary[country.key] = {
          import: parseFloat(d1["Trade (USD)"]),
          export: parseFloat(d2["Trade (USD)"]),
          total:  parseFloat(d1["Trade (USD)"]) + parseFloat(d2["Trade (USD)"])
        };
      }
    });
    console.log(JSON.stringify(dictionary));
});

