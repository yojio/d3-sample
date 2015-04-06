/**
 * LineChart
 */
define(['chart/chart'], function () {
    this.LineChart = function LineChart(option) {

        // Chart共通オプションはChart.js参照
        var DEF_OPT = {
            // 横軸
            axisX: {
                height: 20
            },
            // 横軸
            axisY: {
                max: 500,
                width: 50
            },
            // 右側余裕
            rightMargin: 20
        };

        Chart.call(this, option);
        $.extend(true, this.opt, DEF_OPT, option);
    };

    /* draw時、データ定義サンプル
     ＊ lineChartサンプルデータ(データ-3系統）
     Sample.DATA = {
     caption: ["", "1/25", "2/25", "3/25", "4/25"],  横軸
     stroke: [{width: 3,type: Chart.STROKE_TYPE_SOLID,color: "#98abc5"},{系統の個数分配列}],
     value: [[10, 30, 40, 20, 30],[...]] データの個数分配列（横軸定義数と同数） × 系統の個数分配列
     };
     */
    LineChart.prototype = Object.create(Chart.prototype, {
        constructor: {
            value: LineChart,
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
                var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

                // グラフ出力サイズ（タイトル・縦ラベル幅を除外）
                var left = me.opt.axisY.width;
                var width = me.opt.width - me.opt.axisY.width - me.opt.rightMargin;
                var top = me._drawTitle(svg, me.opt, (width / 2) + left);
                var height = this._getHeight(me.opt, top);

                // 縦軸作成
                me._createAxisY(svg, me.opt, top, left, height, width);

                // 横軸作成
                me._createAxisX(svg, me.opt, top, left, height, width, data);

                // 線描画
                me.linePath = new Array(data.value.length);
                me.line = new Array(data.value.length);

                for (var i = 0; i < data.value.length; i++) {
                    var line = d3.svg.line()
                        .x(function (d, k) {
                            return left + (k * (width / (data.caption.length - 1)));
                        })
                        .y(function (d) {
                            return (height + top) - (d * (height / me.opt.axisY.max));
                        })
                        .interpolate("linear"); // エッジがシャープな

                    // 折れ線グラフを描画
                    var linePath = svg.append("path")
                        .attr("d", line(data.value[i])) // 線を描画
                        .attr("stroke", (data.stroke[i].color) ? data.stroke[i].color : "black") // 線の色を指定
                        .attr("fill", "none") // 塗り潰しなし。指定しないと黒色で塗り潰される
                        .attr("stroke-dasharray", (data.stroke[i].type) ? data.stroke[i].type : Chart.STROKE_TYPE_SOLID)
                        .attr("stroke-width", (data.stroke[i].width) ? data.stroke[i].width : 1);

                    me.line[i] = line;
                    me.linePath[i] = linePath;
                }
            }
        },
        _redraw: {
            value: function (data) {

                var me = this;

                for (var i = 0; i < data.value.length; i++) {
                    me.linePath[i]
                        .transition()
                        .duration(800)
                        .attr('d', me.line[i](data.value[i]));
                }

            }
        },
        // 高さ取得
        _getHeight: {
            value: function (opt, top) {
                return opt.height - top - opt.axisX.height; // x軸フォント高さ
            }
        },
        // 縦軸
        _createAxisY: {
            value: function (svg, opt, top, left, height, width) {

                var yScale = d3.scale.linear() // スケールを設定
                    .domain([0, opt.axisY.max]) // 元のサイズ
                    .range([height, 0]);

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + left + "," + top + ")")
                    .call(d3.svg.axis()
                        .scale(yScale) // スケールを適用する
                        .orient("left").tickPadding(5)
                        .tickSize(-width, 0)// 目盛線の長さ（内側,外側）
                );

            }
        },
        // 横軸
        _createAxisX: {
            value: function _createAxisX(svg, opt, top, left, height, width, data) {

                // 目盛りを表示するためにスケールを設定
                var xScale = d3.scale.linear() // スケールを設定
                    .domain([0, data.caption.length - 1]) // 元のサイズ
                    .range([0, width]);

                // 目盛りを設定し表示する
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + left + ", " + (height + top) + ")")
                    .call(d3.svg.axis().scale(xScale) // スケールを適用する
                        .tickValues(function () {
                            return _.range(0, data.caption.length);
                        })
                        .tickFormat(function (d, i) {
                            return data.caption[d];
                        })
                        .orient("bottom") // 目盛りの表示位置を下側に指定
                        .tickPadding(7)
                        .tickSize(-height, 0)// 目盛線の長さ（内側,外側）
                );

                svg.append("line")
                    .attr("x1", left + width)
                    .attr("y1", top)
                    .attr("x2", left + width)
                    .attr("y2", height + top)
                    .attr("stroke-width", 0.2)
                    .attr("stroke", "black");

            }
        }
    });

    return LineChart;

});
