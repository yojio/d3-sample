/**
 * HeatMap
 */
define(['chart/chart'], function () {
    this.HeatMap = function HeatMap(option) {

        // Chart共通オプションはChart.js参照
        var DEF_OPT = {
            // 横軸
            axisX: {
                title: "Level of mastery",
                category: ["None", "Novice", "Beginner", "Competent", "Proficient", "Expert"], // TODO 初期はから配列に
                height: 70
            },
            // 縦軸
            axisY: {
                title: "Days to review",
                category: ["0", "1", "5", "15", "30", "90+"],
                width: 50
            },
            // 値範囲
            range: {
                minValue: 0,
                minColor: "#FFFFFF",
                maxValue: 60,
                maxColor: "#4B75B9"
            }
        };

        Chart.call(this, option);
        $.extend(true, this.opt, DEF_OPT, option);
    };

    /*
     * draw時、データ定義サンプル
     */
    HeatMap.prototype = Object.create(Chart.prototype, {
        constructor: {
            value: HeatMap,
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
                var width = me.opt.width - me.opt.axisY.width - 55;
                var top = me._drawTitle(svg, me.opt, (width / 2) + left);
                var height = this._getHeight(me.opt, top);
                svg.attr("viewport-fill", "red");

                // 縦軸作成
                me._createAxisY(svg, me.opt, top, left, height, width);

                // 横軸作成
                me._createAxisX(svg, me.opt, top, left, height, width);

                return;

                me.barScale = height / me.opt.axisY.max;   // 比率
                var barAreaSize = width / data.length;
                var barSize = barAreaSize * (0.8 * me.opt.barWeight);  // 棒グラフの縦幅

                svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
                    .data(data) // データを設定
                    .enter()
                    .append("rect") // SVGでの四角形を示す要素を生成
                    .attr("stroke", function (d, i) {
                        return d.color;
                    })
                    .attr("x", function (d, i) {
                        return left + (i * barAreaSize) + ((barAreaSize - barSize) / 2);
                    })
                    .attr("y", function (d) {
                        var value = ((height + top) - (d.value * me.barScale));
                        return ((value >= 0) ? value : 0) + "px";
                    })
                    .attr("width", barSize)
                    .attr("height", function (d) {
                        var value = (d.value * me.barScale) - 1;
                        return ((value >= 0) ? value : 0) + "px";
                    })
                    .attr("transform", "translate(0, 0)")
                    .style("fill", function (d, i) {
                        return d.color;
                    });

                me.svg = svg;
                me.top = top;
                me.height = height;
            }
        },
        _redraw: {
            value: function (data) {

                var me = this;
                var svg = me.svg;
                var top = me.top;
                var height = me.height;

                // データを更新する処理
                svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
                    .data(data) // データを設定
                    .transition()
                    .duration(800) // 動作時間
                    .attr("y", function (d) {
                        var value = ((height + top) - (d.value * me.barScale));
                        return ((value >= 0) ? value : 0) + "px";
                    })
                    .attr("height", function (d) {
                        var value = (d.value * me.barScale) - 1;
                        return ((value >= 0) ? value : 0) + "px";
                    })

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
            value: function _createAxisY(svg, opt, top, left, height, width) {

                var yScale = d3.scale.linear() // スケールを設定
                    .domain([0, opt.axisY.category.length * 2]) // 元のサイズ
                    .range([height, 0]);

                var cnt = 0;

                svg.append("g")
                    .attr("class", "axis heatmap")
                    .style("font-size", "15px")
                    .attr("transform", "translate(" + left + "," + top + ")")
                    .call(d3.svg.axis()
                        .scale(yScale) // スケールを適用する
                        .tickValues(function () {
                            return _.range(0, opt.axisY.category.length * 2 + 1);
                        })
                        .tickFormat(function (d, i) {
                            return (d % 2 > 0) ? opt.axisY.category[cnt++] : "";
                        })
                        .orient("left")
                        .tickPadding(5)
                        .tickSize(0, 0)// 目盛線の長さ（内側,外側）
                );

                var yScale = d3.scale.linear() // スケールを設定
                .domain([0, opt.axisY.category.length]) // 元のサイズ
                .range([height, 0]);

                svg.append("g")
                .attr("class", "axis heatmap")
                .style("font-size", "15px")
                .attr("transform", "translate(" + left + "," + top + ")")
                .call(d3.svg.axis()
                    .scale(yScale) // スケールを適用する
                    .tickValues(function () {
                        return _.range(0, opt.axisY.category.length + 1);
                    })
                    .tickFormat(function (d, i) {
                        return "";
                    })
                    .orient("left")
                    .tickPadding(5)
                    .tickSize(-width, 0)// 目盛線の長さ（内側,外側）
                );

                var data = [60,50,40,30,20,10,0];

                var yScale = d3.scale.linear() // スケールを設定
                .domain([0, data.length - 1]) // 元のサイズ
                .range([height, 0]);

                svg.append("g")
                .attr("class", "axis heatmap")
                .style("font-size", "15px")
                .attr("transform", "translate(" + (left + width + 30) + "," + top + ")")
                .call(d3.svg.axis()
                    .scale(yScale) // スケールを適用する
                    .tickValues(function () {
                        return _.range(0, data.length);
                    })
                    .tickFormat(function (d, i) {
                        return data[d];
                    })
                    .orient("right")
                    .tickPadding(5)
                    .tickSize(0, 0)// 目盛線の長さ（内側,外側）
                );

                var text = opt.axisY.title.split("").reverse().join("");
                var userAgent = window.navigator.userAgent.toLowerCase();

                svg.append("text")
                .attr("class", "vTitle")
                .attr("type", "caption")
                .attr("x", 10)
                .attr("y", top + 180)
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("text-decoration", "")
                .style("writing-mode", "tb")
                .style("glyph-orientation-vertical", "270")
                .text(text);
                // firefoxだとうまくうごかない
                if (userAgent.indexOf('firefox') != -1) {
                  var tmp = $(".vTitle");
                  tmp.css({
                    'transform': 'rotate(270deg)'
                  })
                }

                var gradient = svg.append("svg:defs")
                .append("svg:linearGradient")
                  .attr("id", "gradient")
                  .attr("x1", "0%")
                  .attr("y1", "0%")
                  .attr("x2", "0%")
                  .attr("y2", "100%")

              gradient.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", "#FFFFFF")
                .attr("stop-opacity", 1)

              gradient.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", "#4B75B9")
                .attr("stop-opacity", 1)

              svg.append("rect")
                .attr("class", "sampleClass")
                .attr("x", left + width + 10)
                .attr("y", top)
                .attr("width", 20)
                .attr("height", height)
                .attr("fill", "url(#gradient)")

            }
        },
        // 縦軸
        _createAxisX: {
            value: function (svg, opt, top, left, height, width) {

                // 目盛りを表示するためにスケールを設定
                var xScale = d3.scale.linear() // スケールを設定
                    .domain([0, opt.axisX.category.length * 2]) // 元のサイズ
                    .range([0, width - 1]);

               var cnt = 0;

                // 目盛りを設定し表示する
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + left + ", " + (height + top) + ")")
                    .call(d3.svg.axis().scale(xScale) // スケールを適用する
                        .tickValues(function () {
                            return _.range(0, opt.axisX.category.length * 2);
                        })
                        .tickFormat(function (d, i) {
                            return (i % 2 > 0) ? opt.axisX.category[cnt++] : "";
                        })
                        .orient("bottom") // 目盛りの表示位置を下側に指定
                        .tickPadding(10)
                        .tickSize(0, 0)// 目盛線の長さ（内側,外側）
                );

                // 目盛りを表示するためにスケールを設定
                var xScale = d3.scale.linear() // スケールを設定
                    .domain([0, opt.axisY.category.length]) // 元のサイズ
                    .range([0, width - 1]);

               var cnt = 0;

                // 目盛りを設定し表示する
                svg.append("g")
                    .attr("class", "axis heatmap2")
                    .attr("transform", "translate(" + left + ", " + (height + top) + ")")
                    .call(d3.svg.axis().scale(xScale) // スケールを適用する
                        .tickValues(function () {
                            return _.range(0, opt.axisY.category.length + 1);
                        })
                        .tickFormat(function (d, i) {
                            return "";
                        })
                        .orient("bottom") // 目盛りの表示位置を下側に指定
                        .tickPadding(7)
                        .tickSize(5, 0)// 目盛線の長さ（内側,外側）
                );

                svg.append("text")
                .attr("class", "hTitle")
                .attr("type", "caption")
                .attr("x", left + 225)
                .attr("y", (height + top) + 50)
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("text-decoration", "")
                .text(opt.axisX.title);

            }
        }
    });

    return HeatMap;

});
