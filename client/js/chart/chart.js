/**
 * Created by yoji on 15/03/09.
 */

// Chart基底クラス
define(['jquery', 'd3'], function () {
  this.Chart = function Chart(option) {

    var DEF_OPT = {
      dom: "", // 表示用DIV
      width: 100, // サイズ横
      height: 100, // サイズ縦
      // タイトル情報
      title: {
        caption: "",
        height: 20,
        fontSize: 16,
        margin: 10,
        sorted: false
      },
      // 横
      axisX: {
        max: 1000,
        caption: '値',
      },
      // 縦
      axisY: {
        max: 1000,
        width: 50,
        title: '種類',
      },
      // bar
      bar: {
        weight: Chart.BAR_WEIGHT_NORMAL
      }
    };

    this.opt = $.extend(true, {}, DEF_OPT, option);
    validate(this.opt);
    this.created = false;

    function validate(opt) {
      if ((!opt.dom) || (opt.dom.trim().length == 0)) {
        throw new Error("dom undefined error");
      }

      if (!$(opt.dom).hasClass()) {
        $(opt.dom).addClass("chart-class");
      }

    }

  };

// 定数
// 線種
  Chart.STROKE_TYPE_SOLID = "";
  Chart.STROKE_TYPE_DASH = "10 4";
  Chart.STROKE_TYPE_DOT = "2 2";

// BARの太さ
  Chart.BAR_WEIGHT_THIN = 0.6;
  Chart.BAR_WEIGHT_NORMAL = 0.8;
  Chart.BAR_WEIGHT_THICK = 1;


// データ定義
// pieChart,barChart
// var data = [
// {
// caption:"caption1"
// ,value:"data1" // numericOnly!
// ,color:"color1" // colorcode #98abc5
// },
// ]

// lineChart
// var data = {
// caption : ["caption1","caption2",,,,] // 横軸（データの個数分）
//  ,stroke:[{
//    width : 2,
//    type : Chart.STROKE_TYPE_DOT,
//    color : "#98abc5"
//  },{},{}] // データのバリエーション分
// ,value:[ // 線の数だけデータを容易
// [10,30,40,20,30] // データの個数は横軸の数と合わせる
// ,[100,20,30,50,60]
// ,[100,20,30,50,60]
// ]
// }

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
    throw new Error(this.constructor.name
    + " Create function is not implemented yet.");
  };

// 再描画
  Chart.prototype._redraw = function (data) {
    throw new Error(this.constructor.name
    + " Redraw function is not implemented yet.");
  };

// タイトル描画(返り値ータイトル高さ）
  Chart.prototype._drawTitle = function (svg, opt, left) {

    if (!opt.title.caption) {
      return 0;
    }

    if (!left) {
      left = opt.width / 2;
    }

    svg.append("text")
        .attr("class", "title")
        .attr("type", "caption")
        .attr("x", left)
        .attr("y", opt.title.height)
        .attr("text-anchor", "middle")
        .style("font-size", opt.title.fontSize + "px")
        .style("text-decoration", "underline").text(opt.title.caption);

    return opt.title.height + opt.title.margin;
  };
});


