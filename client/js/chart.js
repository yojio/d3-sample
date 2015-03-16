/**
 * Created by yoji on 15/03/09.
 */
var DEF_OPT = {
  dom: ""           // 表示用DIV
  , width: 100      // サイズ横
  , height: 100     // サイズ縦
  , title: {       // タイトル情報
    caption: ""
    , height: 20
    , fontSize: 16
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
    this.create(data);
    this.created = true;
  } else {
    this.redraw(data);
  }
};

// 作成
Chart.prototype.create = function (data) {
  throw new Error("Unimplemented");
};

// 再描画
Chart.prototype.redraw = function (data) {
  alert("bbbb");
  throw new Error("Unimplemented");
};

// 円グラフ
function PieChart(option) {

  Chart.call(this, option);

  // グラフ作成
  this.create = function (data) {

    var radius = Math.min(this.opt.width, this.opt.height) / 2;

    // 円グラフのサイズを指定
    var arc = d3.svg.arc().innerRadius(radius / 4).outerRadius(radius - 10);
    // 円グラフを生成
    var pie = d3.layout.pie().sort(null).value(function (d) {
      return d[1];
    });
    // 領域のリセット
    $(this.dom).empty();
    // 色の用意 TODO 色はパラメータでもらう
    var color = d3.scale.category20();
    // SVGの表示領域を生成
    var height = (this.opt.title.caption) ? height += this.opt.title.height : this.opt.height;

    // 規定オブジェクト生成
    var svg = d3
        .select(this.opt.dom)
        .append("svg")
        .attr("width", this.opt.width)
        .attr("height", height);

    // タイトル描画
    if (this.opt.title.caption) {
      svg.append("text")
          .attr("x", (this.opt.width / 2))
          .attr("y", this.opt.title.height)
          .attr("text-anchor", "middle")
          .style("font-size", this.opt.title.fontSize + "px")
        // .style("text-decoration", "underline")
          .text(this.opt.title.caption);
    }

    // 円グラフを描画
    var g = svg.selectAll("path").data(pie(data)).enter().append("g");

    g.append("path") // 円弧はパスで指定する
        .attr("d", arc) // 円弧を設定
        .attr("stroke", "white") // 円グラフの区切り線を白色にする
        .attr(
        "transform",
        "translate(" + this.opt.width / 2 + ", " + ((height / 2) + 20) + ")") // 円グラフをSVG領域の中心にする
        .style("fill", function (d, i) {
          // return d.data[2];
          return color(i);
        })
      // 今の数値を保存します。
        .each(function (d, i) {
          //me._current[i] = d;
        });

    // データキャプション表示
    g.append("text")
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dx", this.opt.width / 2)
        .attr("dy", (height / 2) + 20)
        .style("text-anchor", "middle").text(function (d) {
          return d.data[0];
        });

    // アニメーション http://tukumemo.com/d3-pie-chart/
  }

  this.redraw = function (data) {
    alert("ccc");
  };
};

PieChart.prototype = Object.create(Chart.prototype, {
  constructor: {
    value: PieChart,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
