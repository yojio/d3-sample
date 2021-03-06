/**
 * NormalTree
 */
define(['chart/chart'], function () {

    this.NormalTree = function NormalTree(option) {

        // Chart共通オプションはChart.js参照
        var DEF_OPT = {
            margin: { // これを入れないと上下・左右のテキストが欠ける（デフォルトは横）
                left: 100,
                right: 100
            },
            type: NormalTree.TYPE_TREE,
            stroke: {
                width: 1,
                type: Chart.STROKE_TYPE_DASH,
                color: "gray"
            },
            pointColor: "black",
            fontColor: "black"
        };

        Chart.call(this, option);
        $.extend(true, this.opt, DEF_OPT, option);
    };

    // ツリー形状
    NormalTree.TYPE_TREE = 0;
    NormalTree.TYPE_CLUSTER = 1;

    NormalTree.prototype = Object.create(Chart.prototype, {
        constructor: {
            value: NormalTree,
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

                var svg = svgBase
                    .append("svg")
                    .attr("width", me.opt.width)
                    .attr("height", me.opt.height)
                    .append("g")
                    .attr("transform", "translate(" + me.opt.margin.left + ",0)");

                var left = 0;
                var width = me.opt.width - (me.opt.margin.left + me.opt.margin.right);
                var height = this._getHeight(me.opt, top);

                // Treeノードが最底辺に並ぶ。（通常はtree()を利用）
                var cluster;
                if (me.opt.type == NormalTree.TYPE_TREE) {
                    cluster = d3.layout.tree().size([height, width]);
                } else {
                    cluster = d3.layout.cluster().size([height, width]);
                }

                // 曲線でつなぐ
                var diagonal = d3.svg.diagonal().projection(function (d) {
                    return [d.y, d.x];
                });

                // cluster.nodesで、childrenのname分だけ、name/children/parent/depth/x/yを作る。
                var nodes = cluster.nodes(data);

                // nodesから、diagonal用データ構造を作る　＝　[{ source:{x:10,y:20}, target:{x:100,y:200} }]など
                var links = cluster.links(nodes);

                // 線を引く
                svg.selectAll(".link").data(links).enter().append("path")
                    .attr("class", "link")
                    .attr("fill", "none")
                    .attr("d", diagonal)
                    .attr("stroke", function (d) {
                        if (d.target.color) {
                            return d.target.color;
                        } else {
                            return me.opt.stroke.color;
                        }
                    })
                    .attr("stroke-width", function (d) {
                        if (d.target.strokewidth) {
                            return d.target.strokewidth;
                        } else {
                            return me.opt.stroke.width;
                        }
                    })
                    .attr("stroke-dasharray", function (d) {
                        if (d.target.strokeDasharray != undefined) {
                            return d.target.strokeDasharray;
                        } else {
                            return me.opt.stroke.type;
                        }
                    });

                // 円とテキストを入れるノードのコンテナg。
                var node = svg.selectAll(".node").data(nodes).enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                node.append("circle")
                    .attr("r", 4.5)
                    .attr("fill", function (d) {
                        if (d.color) {
                            return d.color;
                        } else {
                            return me.opt.pointColor;
                        }
                    })
                    .attr("stroke", function (d) {
                        if (d.color) {
                            return d.color;
                        } else {
                            return me.opt.pointColor;
                        }
                    });

                node.append("text")
                    .attr("dx", function (d) {
                        return d.children ? -8 : 8;
                    })
                    .attr("dy", 3)
                    .attr("fill", function (d) {
                        if (d.color) {
                            return d.color;
                        } else {
                            return me.opt.fontColor;
                        }
                    })
                    .style("text-anchor", function (d) {
                        return d.children ? "end" : "start";
                    })
                    .text(function (d) {
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

    return NormalTree;

});
