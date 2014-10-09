/*jslint node: true */
var d3 = require('d3'),
    dictionary = {},
    data = require('./country_gdp.json'),
    scale = d3.scale.threshold()
              .domain([2000, 10000, 18000, 100000, 157000])
              .range(d3.range(5));

d3.map(data).entries().forEach(function(d){
  dictionary[d.key] = {level: scale(d.value), value: d.value};
});

console.log(JSON.stringify(dictionary));

//console.log(scale.quantize());


