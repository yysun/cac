/*global d3*/
function map0(map_options, fn) {
  var options = map_options || {},
      width = options.width || 1080,                         // 定义缺省宽度
      height = options.height || 540,                        // 定义缺省高度
      div_id = options.id || '#map',                         // 定义地图 div id
      projection = options.projection || d3.geo.mercator(),  // 定义墨卡托投影
      path = d3.geo.path().projection(projection),           // 定义绘图函数
      zoom = options.zoom || d3.behavior.zoom()              // 定义鼠标交互
        .scale(1 << 9)                                       // 初始缩放为第2级
        .scaleExtent([1 << 9, 1 << 28])                      // 缩放范围为第2-20级
        .translate([width / 2, height / 2]),
      tile = d3.geo.tile().size([width, height]);            // 定义地图片系统
  zoom.on("zoom", zoomed),
  d3.select(div_id).call(zoom);                              // 加载鼠标交互
  zoomed();                                                  // 初始化
  function zoomed() {                                        // 绘图过程
    var tiles = tile                                         // 获取缩放后的地图片系统
          .scale(zoom.scale())
          .translate(zoom.translate())();
    projection                                               // 更新缩放后的投影
        .scale(zoom.scale() / 2 / Math.PI)
        .translate(zoom.translate());
    if (fn) fn(projection, path, tiles);                     // 执行回调函数
  }
}


function map(map_options, fn) {
  var options = map_options || {},
      tmap = d3.select("#map"),                              // 加载鼠标交互
      layers = options.tiles.map(function (l) {              // 切片地图层数据
        var tdiv = tmap.append("div").attr("class", "tiles");
        tdiv.node().url = l;
        tdiv.node().domains = options.domains || [];
        return tdiv;
      });

  map0(map_options, function (projection, path, tiles) {
    layers.forEach(function (layer) {
      var max = Math.pow(2, tiles[0][2]),                    // 地图片矩阵行列个数
          m = matrix(tiles.scale, tiles.translate),          // 生成转换矩阵
          valid_tiles = tiles.filter(function (d) {          // 过滤超界地图片
            return d[0] < max && d[1] < max;
          });
      valid_tiles.scale = tiles.scale / 256;
      layer.style("-webkit-transform", m)                    // 设置坐标转换矩阵
           .style("transform", m);
      var map_tiles = layer.selectAll(".tile")               // selectAll
          .data(valid_tiles, function (d) { return d; }),
          tile_url = layer.node().url,
          domains = layer.node().domains;
      map_tiles.exit().remove();                             // exit
      map_tiles.enter()                                      // enter
        .append("img")                                       // append
        .attr("class", "tile")                               // attr
        .attr("src", function (d) {                          // 按照模板生成地图片网址
          d.img = this;
          return tile_url
           .replace('{x}', d[0])
           .replace('{y}', d[1])
           .replace('{z}', d[2])
           .replace('{s}', domains.length ? domains[(d[0] + d[1]) % domains.length] : '{s}');
        })
        .style("left", function (d) { return (d[0] * 256) + "px"; })
        .style("top", function (d)  { return (d[1] * 256) + "px"; });
      if (fn) fn(projection, path, valid_tiles);             // 执行回调函数
    });
  });
}

function matrix(scale, translate) {                          // 坐标转换矩阵
  var k = scale / 256,
      x = translate[0] * scale,
      y = translate[1] * scale;
  return "matrix(" + [k, 0, 0, k, x, y] + ")";
}
