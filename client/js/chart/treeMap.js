/**
 * TreeMap
 */
define(['chart/chart'], function () {

    this.TreeMap = function TreeMap(option) {

        // Chart共通オプションはChart.js参照
        var DEF_OPT = {
            opacity: 1,
            frame: {
                color: "white",
                width: 2
            },
            fontColor: "white"
        };

        Chart.call(this, option);
        $.extend(true, this.opt, DEF_OPT, option);
    };

    TreeMap.prototype = Object.create(Chart.prototype, {
        constructor: {
            value: TreeMap,
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

                var svg = svgBase
                    .append("svg")
                    .attr("y", top)
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(0,0)");

                var treemap = d3.layout.treemap()
                    .size([width, height])
                    .sticky(true)
                    .value(function (d) {
                        return d.size;
//        })
//        .children(function(d){
//          return d.children;
                    });

                function getColor(d) {
                    if (d.color) {
                        return d.color;
                    } else if (d.parent) {
                        return getColor(d.parent);
                    } else {
                        return "black"
                    }
                }

                var cells = svg.selectAll(".cell")
                    .data(treemap.nodes(data))
                    .enter()
                    .append("g")
                    .attr("class", "cell");

                cells.append("rect")
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("width", function (d) {
                        return d.dx;
                    })
                    .attr("height", function (d) {
                        return d.dy;
                    })
                    .attr("fill", function (d) {
                        // 一番下の子だけ親に合わせて色を変える。
                        return d.children ? null : getColor(d);
                    })
                    .attr("stroke", me.opt.frame.color)
                    .attr("stroke-width", me.opt.frame.width)
                    .attr("opacity", me.opt.opacity); // 重なった円が見えるように透明度をつける。

                cells.append("text")
                    .attr("x", function (d) {
                        // 各rectの真ん中に配置。
                        return d.x + (d.dx / 2);
                    })
                    .attr("y", function (d) {
                        // 各rectの真ん中に配置。
                        return d.y + (d.dy / 2);
                    })
                    .attr("fill", me.opt.fontColor)
                    .attr("text-anchor", "middle")
                    .text(function (d) {
                        // 一番下の子の名前だけ表示。
                        return d.children ? "" : d.name;
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

    return TreeMap;

});
