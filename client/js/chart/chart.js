/**
 * Created by yoji on 15/03/09.
 */

// Chart基底クラス
function Chart(option) {

  var DEF_OPT = {
    dom : "", // 表示用DIV
    width : 100, // サイズ横
    height : 100, // サイズ縦
    stroke : {
      width : 2, // 枠線の太さ
      type  : 1
    },
    title : { // タイトル情報
      caption : "",
      height : 20,
      fontSize : 16,
      margin : 4,
      sorted : false
    },
    axis : {
      max : 1000,
      xWidth : 14,
      yWidth : 50,
      xTitle : '値',
      yTitle : '種類',
    }
  };

  this.opt = $.extend(true, {}, DEF_OPT, option);
  validate(this.opt);
  this.created = false;

  function validate(opt) {
    if ((!opt.dom) || (opt.dom.trim().length == 0)) {
      throw new Error("dom undefined error");
    }
  }

};

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
// ,color:["#98abc5","#a05d56",,,,] // データのバリエーション分
// ,data:[ // 線の数だけデータを容易
// [10,30,40,20,30] // データの個数は横軸の数と合わせる
// ,[100,20,30,50,60]
// ,[100,20,30,50,60]
// ]
// }

// 描画
Chart.prototype.draw = function(data) {
  if (!this.created) {
    this._create(data);
    this.created = true;
  } else {
    this._redraw(data);
  }
};

// 作成
Chart.prototype._create = function(data) {
  throw new Error(this.constructor.name
      + " Create function is not implemented yet.");
};

// 再描画
Chart.prototype._redraw = function(data) {
  throw new Error(this.constructor.name
      + " Redraw function is not implemented yet.");
};

// タイトル描画(返り値ータイトル高さ）
Chart.prototype._drawTitle = function(svg, opt, left) {

  if (!opt.title.caption) {
    return 0;
  }

  if (!left) {
    left = opt.width / 2;
  }

  svg.append("text")
    .attr("class", "title")
    .attr("type", "caption")
    .attr("x",left)
    .attr("y", opt.title.height)
    .attr("text-anchor", "middle")
    .style("font-size", opt.title.fontSize + "px")
    .style("text-decoration","underline").text(opt.title.caption);

  return opt.title.height + opt.title.margin;
};
