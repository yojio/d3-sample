/**
 * RoundTree
 */
define(['chart/chart'], function () {

  this.RoundTree = function RoundTree(option) {

    // Chart共通オプションはChart.js参照
    var DEF_OPT = {
      margin : { // これを入れないと上下・左右のテキストが欠ける（デフォルトは横）
        top : 100,
        right: 100
      },
      stroke: {
        width: 1,
        type: Chart.STROKE_TYPE_DASH,
        color :"gray"
      },
      pointColor : "black",
      fontColor : "black"
    };

    Chart.call(this, option);
    $.extend(true, this.opt, DEF_OPT, option);
  };

  RoundTree.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: RoundTree,
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

        var top = me._drawTitle(svgBase, me.opt);
        var left = 0;
        var width = me.opt.width - me.opt.margin.right;
        var height = this._getHeight(me.opt, 0);

        var diameter = (width > height)?height:width;

        // 基底オブジェクト生成
        var center = {
            x : diameter / 2,
            y : me.opt.margin.top + (diameter / 2)
        }
        var svg = svgBase
          .append("svg")
          .attr("width", me.opt.width)
          .attr("height", me.opt.height)
          .append("g")
          .attr("transform", "translate(" + center.x + "," + center.y + ")");

        var tree = d3.layout.tree()
            .size([360, diameter / 2])
            .separation(function(a, b) {
              return (a.parent == b.parent ? 1 : 2) / a.depth;
            });

        var diagonal = d3.svg.diagonal.radial()
          .projection(function(d) {
            return [d.y, d.x / 180 * Math.PI];
          });

        var nodes = tree.nodes(data);
        var links = tree.links(nodes);

        // 線を引く
        svg.selectAll(".link").data(links).enter().append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("d", diagonal)
        .attr("stroke", function(d){
          if (d.target.color){
            return d.target.color;
          }else{
            return me.opt.stroke.color;
          }
        })
        .attr("stroke-width",function(d){
          if (d.target.strokewidth){
            return d.target.strokewidth;
          }else{
            return me.opt.stroke.width;
          }
        })
        .attr("stroke-dasharray",function(d){
          if (d.target.strokeDasharray != undefined){
            return d.target.strokeDasharray;
          }else{
            return me.opt.stroke.type;
          }
        });

        // 円とテキストを入れるノードのコンテナg。
        var node = svg.selectAll(".node").data(nodes).enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
          });

        node.append("circle")
        .attr("r", 4.5)
        .attr("fill", function(d){
          if (d.color){
            return d.color;
          }else{
            return me.opt.pointColor;
          }
        })
        .attr("stroke", function(d){
          if (d.color){
            return d.color;
          }else{
            return me.opt.pointColor;
          }
        });

        node.append("text")
        .attr("dy", ".31em")
        .attr("fill", function(d){
          if (d.color){
            return d.color;
          }else{
            return me.opt.fontColor;
          }
        })
        .style("text-anchor", function(d) {
          return d.x < 180 ? "start" : "end";
        })
        .attr("transform", function(d) {
          return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        })
        .text(function(d) {
          return d.name;
        });
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

  return RoundTree;

});
