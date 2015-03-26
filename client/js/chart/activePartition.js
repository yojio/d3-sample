/**
 * ActivePartition
 */
define(['chart/chart'], function () {

  this.ActivePartition = function ActivePartition(option) {

    // Chart共通オプションはChart.js参照
    var DEF_OPT = {
        opacity : 1,
        frame : {
          color : "white",
          width : 2
        },
        fontColor : "white"
    };

    Chart.call(this, option);
    $.extend(true, this.opt, DEF_OPT, option);
  };

  ActivePartition.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: ActivePartition,
      enumerable: false,
      writable: true,
      configurable: true
    },
    // グラフ作成
    _create: {
      value: function (data) {

        var me = this;

        // 領域のリセット
        $(me.opt.dom).empty();

        // 基底オブジェクト生成
        var svgBase = d3.select(me.opt.dom)
          .append("svg")
          .attr("width", me.opt.width)
          .attr("height", me.opt.height)
          .append("g")
          .attr("transform", "translate(0,0)");

        var left = 0;
        var width = me.opt.width;
        var top = me._drawTitle(svgBase, me.opt);
        var height = this._getHeight(me.opt, top);
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([0, height]);

        var svg = svgBase
        .append("svg")
        .attr("y", top)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

        var partition = d3.layout.partition()
          .value(function(d) {
            return d.size;
          });

        var getColor = function(d){
          if (d.color){
            return d.color;
          }else if (d.parent){
            return getColor(d.parent);
          }else{
            return "#98abc5"
          }
        }

        var cells = svg.selectAll(".cell")
          .data(partition.nodes(data)) // ここでdataにdx,dy等を設定
          .enter()
          .append("g")
          .attr("class","cell")
          .attr("transform", function(d) {
            return "translate(" + x(d.y) + "," + y(d.x) + ")";
          })
          .on("click", click);

        var kx = width / data.dx;
        var ky = height / 1;

        cells.append("rect")
          .attr("width", data.dy * kx)
          .attr("height", function(d) {
            return d.dx * ky;
          })
          .attr("fill",getColor)
          .attr("stroke", me.opt.frame.color)
          .attr("stroke-width",me.opt.frame.width)
          .attr("class", function(d) {
            return d.children ? "parent" : "child";
          });

        cells.append("text")
          .attr("transform", transform)
          .attr("fill", me.opt.fontColor)
          .style("opacity", function(d) {
            return d.dx * ky > 20 ? 1 : 0; // 領域サイズが小さすぎる場合は非表示
          })
          .text(function(d) {
            return d.name;
          });

        d3.select(window).on("click", function() { click(data); })

        function click(d){
          if (!d.children) return;

          kx = (d.y ? width - 40 : width) / (1 - d.y);
          ky = height / d.dx;
          x.domain([d.y, 1]).range([d.y ? 40 : 0, width]);
          y.domain([d.x, d.x + d.dx]);

          var t = cells.transition()
            //.duration(d3.event.altKey ? 7500 : 750) altキーが押されていたら
            .duration(800)
            .attr("transform", function(d) {
              return "translate(" + x(d.y) + "," + y(d.x) + ")";
            });

          t.select("rect")
            .attr("width", d.dy * kx)
            .attr("height", function(d) {
              return d.dx * ky;
            });

          t.select("text")
            .attr("transform", transform)
            .style("opacity", function(d) {
              return d.dx * ky > 20 ? 1 : 0;
            });

          d3.event.stopPropagation();
        }

        function transform(d) {
          return "translate(8," + ((d.dx * ky / 2) + 5) + ")";
        }

      }
    },
    _redraw: {
      value: function (data) {
        this._create(data);
      }
    },
    // 高さ取得
    _getHeight: {
      value: function (opt, top) {
        return opt.height - top;
      }
    }
  });

  return ActivePartition;

});
