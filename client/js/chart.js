/**
 * Created by yoji on 15/03/09.
 */
var DEF_OPT = {
  dom: "" // 表示用DIV
  , width: 100 // サイズ横
  , height: 100 // サイズ縦
  , title: { // タイトル情報
    caption: ""
    , height: 20
    , fontSize: 16
    , sorted: false
  }
  , axisStyle: {
    width: 14
    , maxValue: 1000
    , valueTitle: '値'
    , kindTitle: '種類'
  }
};

// Chartクラス定義
function Chart(option) {
  this.opt = $.extend(true, {}, DEF_OPT, option);
  this.created = false;
};

// 描画
Chart.prototype.draw = function (data) {
  if (!this.created) {
    this._create(data);
    this.created = true;
  } else {
    this._redraw(data);
  }
};

// 作成
Chart.prototype._create = function (data) {
  throw new Error("Unimplemented");
};

// 再描画
Chart.prototype._redraw = function (data) {
  throw new Error("Unimplemented");
};

// 円グラフ
function PieChart(option) {

  Chart.call(this, option);

};

PieChart.prototype = Object.create(Chart.prototype, {
  constructor: {
    value: PieChart,
    enumerable: false,
    writable: true,
    configurable: true
  },
  // グラフ作成
  _create: {
    value: function (data) {

      var me = this;

      me.flg = 0;
      me.current = new Array(data.length);

      // 半径算出
      var radius = Math.min(me.opt.width, me.opt.height) / 2;

      // 円グラフのサイズを指定
      var arc = d3.svg.arc().innerRadius(radius / 4).outerRadius(radius - 10);

      // 円グラフを生成
      comparator = null;
      if (me.opt.sorted) {
        comparator = function (a, b) {
          return d3.descending(a[0], b[0]);
        }
      }
      var pie = d3.layout.pie().sort(comparator).value(function (d) {
        return d[1];
      });

      // 領域のリセット
      $(me.opt.dom).empty();


      // 色の用意
      // var color = d3.scale.category20();
      // SVGの表示領域を生成
      var height = (me.opt.title.caption) ? height = me.opt.height
      + me.opt.title.height : me.opt.height;

      // 規定オブジェクト生成
      var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", height);

      // タイトル描画
      if (me.opt.title.caption) {
        svg.append("text").attr("class", "title").attr("type", "caption").attr(
            "x", (me.opt.width / 2)).attr("y", me.opt.title.height).attr(
            "text-anchor", "middle").style("font-size",
            me.opt.title.fontSize + "px").style("text-decoration", "underline")
            .text(me.opt.title.caption);
      }

      // 円グラフを描画
      var g = svg.selectAll("path").data(pie(data)).enter().append("g");

      g.on("mouseover", function (d) {
        if (tooltip.style.visibility == "visible") {
          return;
        }
        tooltip.style.visibility = "visible";
        me.flg += 1;

        if (me.flg > 1) {
          return;
        }

        $("#tooltip").fadeIn("slow", function () {
          me.flg = false
        });

      }).on("mousemove", function (d) {

        if ((!d) || (!d.data[0])) {
          return
        }
        tooltip.textContent = d.data[0];
        tooltip.style.top = (event.pageY - 20) + "px";
        tooltip.style.left = (event.pageX - 10) + "px";

      }).on("mouseout", function (d) {
        if (me.flg > 1) {
          return;
        }
        $("#tooltip").fadeOut("slow", function () {
          me.flg -= 1;
          tooltip.style.visibility = "hidden";
        });
      });

      g.append("path") // 円弧はパスで指定する
          .attr("d", arc) // 円弧を設定
          .attr("stroke", "white") // 円グラフの区切り線を白色にする
          .attr("transform",
          "translate(" + me.opt.width / 2 + ", " + ((height / 2) + 20) + ")") // 円グラフをSVG領域の中心にする
          .style("fill", function (d, i) {
            return d.data[2];
            // return color(i);
          })
        // 今の数値を保存します。
          .each(function (d, i) {
            me.current[i] = d;
          });

      // データキャプション表示
      g.append("text").attr("class", "dataCaption").attr("transform",
          function (d) {
            return "translate(" + arc.centroid(d) + ")";
          }).attr("dx", me.opt.width / 2).attr("dy", (height / 2) + 20).style(
          "text-anchor", "middle").text(function (d) {
            return d.data[0];
          });

      me.svg = svg;
      me.arc = arc;
      me.pie = pie;

    }
  },
  _redraw: {
    value: function (data) {

      var me = this;

      var svg = me.svg;
      var pie = me.pie;
      var arc = me.arc;

      // path
      svg.selectAll("path").data(pie(data)).transition() // トランジションを設定するとアニメーションさせることができます。
          .duration(800) // アニメーションの秒数を設定します。
          .attrTween("d", function (d, i) { // アニメーションの間の数値を補完します。
            var interpolate = d3.interpolate(me.current[i], d);
            me.current[i] = interpolate(0);
            return function (t) {
              return arc(interpolate(t));
            };
          });

      // キャプション
      svg.selectAll(".dataCaption").data(pie(data)) // 新しいデータを設定します。
          .text(function (d, i) { // 文字を更新します。
            return d.data[0];
          }).transition() // トランジションを設定。
          .duration(800) // アニメーションの秒数を設定。
          .attrTween(
          // アニメーションの間の数値を補完。
          "transform",
          function (d, i) {
            var interpolate = d3.interpolate(arc.centroid(me.current[i]), arc
                .centroid(d));
            me.current[i] = d;
            return function (t) {
              return "translate(" + interpolate(t) + ")";
            };
          });
    }
  }
});

// horizontal bar chart
function HorizontalBarChart(option) {

  Chart.call(this, option);

};

HorizontalBarChart.prototype = Object.create(Chart.prototype, {
  constructor: {
    value: PieChart,
    enumerable: false,
    writable: true,
    configurable: true
  },
  // グラフ作成
  _create: {
    value: function (data) {

      var me = this;

      var titleWidth = 50;
      var width = me.opt.width - 20 - titleWidth; // 実際の出力サイズ(最後のメモリ分だけバッファを作成）
      me.barScale = width / me.opt.axisStyle.maxValue;   // 比率
      var yBarSize = me.opt.axisStyle.width;  // 棒グラフの縦幅

      // 領域のリセット
      $(me.opt.dom).empty();

      // 規定オブジェクト生成
      var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

      // タイトル描画
      var top = 0;
      if (me.opt.title.caption) {
        svg.append("text").attr("class", "title").attr("type", "caption").attr(
            "x", (me.opt.width / 2)).attr("y", me.opt.title.height).attr(
            "text-anchor", "middle").style("font-size",
            me.opt.title.fontSize + "px").style("text-decoration", "underline")
            .text(me.opt.title.caption);
        top = me.opt.title.height + 4;
      }
      var scaleHeight = data.length * yBarSize + 2 + top;

      // 目盛りを表示するためにスケールを設定
      var xScale = d3.scale.linear()  // スケールを設定
          .domain([0, me.opt.axisStyle.maxValue])   // 元のサイズ
          .range([0, width]);

      var yScale = d3.scale.linear()  // スケールを設定
          .domain([0, data.length * 2])   // 元のサイズ
          .range([scaleHeight, top]);

      // 目盛りを設定し表示する
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (8 + titleWidth) + ", " + scaleHeight + ")")
          .call(d3.svg.axis()
              .scale(xScale)  // スケールを適用する
              .orient("bottom")   // 目盛りの表示位置を下側に指定
              .tickPadding(5)
              .innerTickSize(0)  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );

      var cnt = 0;
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (7 + titleWidth) + ", 0)")
          .call(d3.svg.axis()
              .scale(yScale)  // スケールを適用する
              .tickValues(function () {
                return _.range(0, data.length * 2);
              })
              .tickFormat(function (d, i) {
                if (i % 2 > 0) {
                  cnt += 1;
                  return data[cnt - 1][0];
                } else {
                  return "";
                }
              })
              .orient("left")
              .tickPadding(5)
              .innerTickSize(0)  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );

      svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
          .data(data) // データを設定
          .enter()
          .append("rect") // SVGでの四角形を示す要素を生成
          .attr("stroke", "white") // 円グラフの区切り線を白色にする
          .attr("x", titleWidth)   // 横棒グラフなのでX座標は0。これはSVG上での座標
          .attr("y", function (d, i) {   // Y座標を配列の順序に応じて計算
            return top + ((data.length - i) * yBarSize) - yBarSize;
          })
          .attr("width", function (d) { // 横幅を配列の内容に応じて計算
            return (d[1] * me.barScale) + "px";
          })
          .attr("height", yBarSize)   // 棒グラフの高さを指定
        // .attr("style", "fill:rgb(255,0,0)") // 棒グラフの色を赤色に設定
          .attr("transform", "translate(8, 0)")
          .style("fill", function (d, i) {
            return d[2];
          })
      me.svg = svg;
    }
  },
  _redraw: {
    value: function (data) {

      var me = this;
      var svg = me.svg;

      // データを更新する処理
      svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
          .data(data) // データを設定
          .transition()
          .attr("width", function (d) { // 横幅を配列の内容に応じて計算
            return (d[1] * me.barScale) + "px";
          })

    }
  }
});

// LineChart
function LineChart(option) {

  Chart.call(this, option);

};

LineChart.prototype = Object.create(Chart.prototype, {
  constructor: {
    value: PieChart,
    enumerable: false,
    writable: true,
    configurable: true
  },
  // グラフ作成
  _create: {
    value: function (data) {

      var me = this;
      var titleWidth = 50;
      var width = me.opt.width - 20 - titleWidth; // 実際の出力サイズ(最後のメモリ分だけバッファを作成）

      // 領域のリセット
      $(me.opt.dom).empty();

      // 規定オブジェクト生成
      var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

      // タイトル描画
      var top = 0;
      if (me.opt.title.caption) {
        svg.append("text").attr("class", "title").attr("type", "caption").attr(
            "x", (me.opt.width / 2)).attr("y", me.opt.title.height).attr(
            "text-anchor", "middle").style("font-size",
            me.opt.title.fontSize + "px").style("text-decoration", "underline")
            .text(me.opt.title.caption);
        top = me.opt.title.height + 4;
      }

      var scaleHeight = data.length * me.opt.axisStyle.width + top;

      // 目盛りを表示するためにスケールを設定
      var xScale = d3.scale.linear()  // スケールを設定
          .domain([0, data.length - 1])   // 元のサイズ
          .range([0, width]);

      var yScale = d3.scale.linear()  // スケールを設定
          .domain([0, me.opt.axisStyle.maxValue])   // 元のサイズ
          .range([scaleHeight, top]);


      // 目盛りを設定し表示する
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (7 + titleWidth) + ", " + scaleHeight + ")")
//        .attr("transform", "translate(" + (8 + titleWidth) + ", "+scaleHeight+")")
          .call(d3.svg.axis()
              .scale(xScale)  // スケールを適用する
              .tickValues(function () {
                return _.range(0, data.length);
              })
              .tickFormat(function (d, i) {
                return data[d][0];
              })
              .orient("bottom")   // 目盛りの表示位置を下側に指定
              .tickPadding(5)
              .innerTickSize(-(scaleHeight - top))  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (7 + titleWidth) + ", 0)")
          .call(d3.svg.axis()
              .scale(yScale)  // スケールを適用する
              .orient("left")
              .tickPadding(5)
              .innerTickSize(-width)  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );

      me.line = d3.svg.line()
          .x(function (d, i) {
            return titleWidth + 7 + (i * (width / (data.length - 1)));
          })  // 横方向はSVG領域に合わせて調整。データは最低2個あるのが前提
          .y(function (d) {
            return (scaleHeight - top) - (d[1] * ((scaleHeight - top) / me.opt.axisStyle.maxValue)) + top;
          });  // 縦方向は数値そのままでスケール等しない

      // 折れ線グラフを描画
      me.linePath = svg.append("path")
          .attr("d", me.line(data))  // 線を描画
          .attr("stroke", "black")    // 線の色を指定
          .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される

      me.svg = svg;
    }
  },
  _redraw: {
    value: function (data) {

      var me = this;
      var svg = me.svg;

      me.linePath
          .transition()
          .duration(800)
          .attr('d', me.line(data));


    }
  }
});

//ArrayLineChart
function ArrayLineChart(option) {

  Chart.call(this, option);

};

ArrayLineChart.prototype = Object.create(Chart.prototype, {
  constructor: {
    value: PieChart,
    enumerable: false,
    writable: true,
    configurable: true
  },
  // グラフ作成
  _create: {
    value: function (data) {

      var me = this;
      var titleWidth = 50;
      var width = me.opt.width - 20 - titleWidth; // 実際の出力サイズ(最後のメモリ分だけバッファを作成）

      // 領域のリセット
      $(me.opt.dom).empty();

      // 規定オブジェクト生成
      var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

      // タイトル描画
      var top = 0;
      if (me.opt.title.caption) {
        svg.append("text").attr("class", "title").attr("type", "caption").attr(
            "x", (me.opt.width / 2)).attr("y", me.opt.title.height).attr(
            "text-anchor", "middle").style("font-size",
            me.opt.title.fontSize + "px").style("text-decoration", "underline")
            .text(me.opt.title.caption);
        top = me.opt.title.height + 4;
      }

      var scaleHeight = data.caption.length * me.opt.axisStyle.width + top;

      // 目盛りを表示するためにスケールを設定
      var xScale = d3.scale.linear()  // スケールを設定
          .domain([0, data.caption.length - 1])   // 元のサイズ
          .range([0, width]);

      var yScale = d3.scale.linear()  // スケールを設定
          .domain([0, me.opt.axisStyle.maxValue])   // 元のサイズ
          .range([scaleHeight, top]);


      // 目盛りを設定し表示する
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (7 + titleWidth) + ", " + scaleHeight + ")")
//        .attr("transform", "translate(" + (8 + titleWidth) + ", "+scaleHeight+")")
          .call(d3.svg.axis()
              .scale(xScale)  // スケールを適用する
              .tickValues(function () {
                return _.range(0, data.caption.length);
              })
              .tickFormat(function (d, i) {
                return data.caption[d];
              })
              .orient("bottom")   // 目盛りの表示位置を下側に指定
              .tickPadding(5)
              .innerTickSize(-(scaleHeight - top))  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );


      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + (7 + titleWidth) + ", 0)")
          .call(d3.svg.axis()
              .scale(yScale)  // スケールを適用する
              .orient("left")
              .tickPadding(5)
              .innerTickSize(-width)  // 目盛線の長さ（内側）
              .outerTickSize(0) // 目盛線の長さ（外側）
      );

      me.linePath = new Array(data.data.length);
      me.line = new Array(data.data.length);

      for (var i = 0; i < data.data.length; i++) {
        me.line[i] = d3.svg.line()
            .x(function (d, k) {
              return titleWidth + 7 + (k * (width / (data.caption.length - 1)));
            })  // 横方向はSVG領域に合わせて調整。データは最低2個あるのが前提
            .y(function (d) {
              return (scaleHeight - top) - (d * ((scaleHeight - top) / me.opt.axisStyle.maxValue)) + top;
            });  // 縦方向は数値そのままでスケール等しない

        // 折れ線グラフを描画
        me.linePath[i] = svg.append("path")
            .attr("d", me.line[i](data.data[i]))  // 線を描画
            .attr("stroke", data.color[i])    // 線の色を指定
            .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される

        me.svg = svg;
      }
    }
  },
  _redraw: {
    value: function (data) {

      var me = this;
      var svg = me.svg;

      for (var i = 0; i < data.data.length; i++) {
        me.linePath[i]
            .transition()
            .duration(800)
            .attr('d', me.line[i](data.data[i]));
      }

    }
  }
});

