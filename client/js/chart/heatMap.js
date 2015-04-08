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
                maxColor: "#6EB7DB"
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

                var colorScale = d3.scale.linear().domain([0, 60]).range(["#FFFFFF", "#6EB7DB"]); //カラースケールを作成

                var temp = new Array(me.opt.axisX.category.length);
                for (var i=0;i<me.opt.axisX.category.length;i++){
                  temp[i] = new Array(me.opt.axisY.category.length);

                  for (var k=0;k<me.opt.axisY.category.length;k++){
                    temp[i][k] = {x:i,y:k};
                  }
                }
//                var temp = new Array(2);
//                for (var i=0;i<2;i++){
//                  temp[i] = new Array(2);
//
//                  for (var k=0;k<2;k++){
//                    temp[i][k] = {x:i,y:k};
//                  }
//                }
                temp = d3.merge(temp);
                temp.splice(0, 0, {x:-1,y:-1});

                var boxSize = {
                    width:width / me.opt.axisX.category.length
                    ,height:height / me.opt.axisY.category.length
                };

                var rect = svg.selectAll("rect")
                .data(temp)
                .enter()
                .append("g");

                rect.append("rect") // SVGでの四角形を示す要素を生成
                .attr("transform", "translate(" + (left) + ", " + (top + height) + ")")
                .attr("stroke",function(d,i){
                    var index = d.x;
                    var key = me.opt.axisX.category[index];
                    var values = data[key];
                    var value = values[d.y];
                    if (value!=""){
                      return "#6EB7DB";/*colorScale(d)*/
                    }else{
                      return "none";
                    }
                })
                .attr("fill",function(d,i){
                    var index = d.x;
                    var key = me.opt.axisX.category[index];
                    var values = data[key];
                    var value = values[d.y];
                    if (value!=""){
                      return colorScale(value);
                    }else{
                      return "none";
                    }
                })
                  .attr("x", function (d, i) {
                        return (boxSize.width * d.x);
                    })
                    .attr("y", function (d) {
                      return - (boxSize.height + (boxSize.height * d.y));
                    })
                    .attr("width", boxSize.width)
                    .attr("height",boxSize.height)
                ;

                // データキャプション表示
                rect.append("text")
                    .attr("class", "dataCaption")
                    .attr("transform", "translate(" + (left - 1) + ", " + (top + height) + ")")
                    .attr("dx", function (d, i) {
                      if (d.x <= 0){
                        return boxSize.width / 2;
                      }else{
                        return (boxSize.width * d.x) + (boxSize.width / 2);
                      }
                    })
                    .attr("dy", function (d) {
                      if (d.y <= 0){
                        return -(boxSize.height / 2);
                      }else{
                        return -((boxSize.height * d.y) + boxSize.height / 2);
                      }
                    })
                    .attr("dominant-baseline","central")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                      var index = d.x;
                      var key = me.opt.axisX.category[index];
                      var values = data[key];
                      var value = values[d.y];
                      return value;
                    });

                // データキャプション表示
                rect.append("text")
                    .attr("class", "heatmaprectsign")
                    .attr("transform", "translate(" + (left - 1) + ", " + (top + height) + ")")
                    .attr("dx", function (d, i) {
                      if (d.x <= 0){
                        return boxSize.width / 2;
                      }else{
                        return (boxSize.width * d.x) + (boxSize.width / 2);
                      }
                    })
                    .attr("dy", function (d) {
                      if (d.y <= 0){
                        return 0;
                      }else{
                        return -(boxSize.height * d.y);
                      }
                    })
                    .attr("dominant-baseline","text-before-edge")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                      var index = d.x;
                      var key = me.opt.axisX.category[index];
                      var values = data[key];
                      var value = values[d.y];
                      if (value!=""){
                        return "^";
                      }else{
                        return "";
                      }
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
                .attr("stop-color", "#6EB7DB")
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
                    .range([0, width]);

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
                    .domain([0, opt.axisX.category.length]) // 元のサイズ
                    .range([0, width]);

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
