/* global d3, topojson */
(function() {
'use strict';
  window.map = function (mapoptions) {
    var options = mapoptions || {},
      width   = options.width || 1080,                       // 定义缺省宽度
      height = options.height || 540,                        // 定义缺省高度
      div_id  = options.id || '#map',                        // 定义地图 div id
      projection = options.projection ||                     // 定义缺省投影为等矩形投影
        d3.geo.equirectangular()
          .scale((width-1) / 2 / Math.PI)
          .translate([width / 2, height / 2]),
      path = d3.geo.path().projection(projection),
      graticule = d3.geo.graticule(),                        // 定义经纬网
      svg = d3.select(div_id)                                // 绘制地图 svg 标签
          .append("svg")
          .style("z-index", 5)
          .style("position", 'absolute')
          .attr("width", width)
          .attr("height", height);
      svg.append("path")                                     // 绘制经纬网背景
         .datum(graticule.outline)
         .attr("class", "background")
         .attr("d", path);
      d3.json('topo_countries_110m.json', function (json) {  // 载入地图数
      var features = topojson.feature(json,
          json.objects.countries_110m).features;             // 转化 topojson 至 geojson
      svg.append("g")                                        // 绘制地物
         .attr("id", "states")
         .selectAll("path")
         .data(features)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("id", function(d){ return d.id; });           // 为每个图形赋予 id
      svg.append("g")                                        // 绘制经纬网
         .attr("class", "graticule")
         .selectAll("path")
         .data(graticule.lines)
         .enter().append("path")
         .attr("d", path);
    });
  };
}());