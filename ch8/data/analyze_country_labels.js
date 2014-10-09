/* global require */
var d3 = require('d3'),
    dictionary = [],
    countries = require('./country_names.json'),
    names = d3.map(countries).entries();

names.forEach(function(d) {
  dictionary.push({id: d.key, cname: d.value.cname, display:true });
});
console.log(JSON.stringify(dictionary));





