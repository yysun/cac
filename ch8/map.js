function map(mapoptions, fn) {
  /* global d3 */
  var options = mapoptions || {},
      width   = options.width || 1080,                   // 定义缺省宽度
      height = options.height || 540,                    // 定义缺省高度
      div_id  = options.id || '#map',                    // 定义地图 div id
      projection = options.projection ||                 // 定义缺省投影为自然地球投影
        d3.geo.naturalEarth()
          .scale((width-1) / 2 / Math.PI)
          //.rotate([-105, 0])
          .translate([width / 2, height / 2]),
      scale = projection.scale(),
      path = d3.geo.path().projection(projection),
      graticule = d3.geo.graticule(),                    // 定义经纬网
      svg = d3.select(div_id)                            // 绘制地图 svg 标签
          .append("svg")
          .style("position", 'absolute')
          .attr("width", width)
          .attr("height", height);
      svg.append("g")
         .attr("class", "background")
         .append("path")                                 // 绘制经纬网背景
         .datum(graticule.outline)
         .attr("d", path);
      if(!options.no_graticule) {
        svg.append("g")                                    // 绘制经纬网
           .attr("class", "graticule")
           .selectAll("path")
           .data(graticule.lines)
           .enter().append("path")
           .attr("d", path);
      }
  var drag = d3.behavior.drag()                          // 定义鼠标拖动
        .on('drag', function () {                        // 地图平移事件
           projection.rotate(
             [projection.rotate()[0] + d3.event.dx,
              projection.rotate()[1] - d3.event.dy]);
           svg.selectAll('path').attr('d', path);
        }),
      zoom = d3.behavior.zoom()                          // 定义鼠标滚动
        .on('zoom', function () {                        // 地图滚动事件
           projection.scale(scale * d3.event.scale);
           svg.selectAll('path').attr('d', path);
        });
  svg.call(drag);                                        // 为地图加载鼠标拖动
  svg.call(zoom);                                        // 为地图加载鼠标滚动

  if(fn) fn(svg, projection, path, graticule);
}







