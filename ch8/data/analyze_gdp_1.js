/*jslint node: true */
var d3 = require('d3'),
    dictionary = {},
    data = require('./country_gdp.json'),
    values = d3.map(data).values(),
    scale = d3.scale.quantize()
              .domain([d3.min(values), d3.max(values)])
              .range(d3.range(5));

d3.map(data).entries().forEach(function(d){
  dictionary[d.key] = scale(d.value);
});

console.log(JSON.stringify(dictionary));

//console.log(scale.quantize());


