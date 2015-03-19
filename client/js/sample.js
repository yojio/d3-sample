function Sample() {

}

// pieChart,barChartサンプルデータ
Sample.DATA = [{
  caption: "項目1",
  value: "",
  color: "#98abc5"
}, {
  caption: "項目2",
  value: "",
  color: "##8a89a6"
}, {
  caption: "項目3",
  value: "",
  color: "#7b6888"
}, {
  caption: "項目4",
  value: "",
  color: "#6b486b"
}, {
  caption: "項目5",
  value: "",
  color: "#a05d56"
}];

// lineChartサンプルデータ(データ-１系統）
Sample.LINE_DATA = {
  caption: ["", "1/25", "2/25", "3/25", "4/25"],
  color: ["#98abc5"],
  data: [[10, 30, 40, 20, 30]]
};

// lineChartサンプルデータ(データ-3系統）
Sample.LINE_DATA_MULTI = {
  caption: ["", "1/25", "2/25", "3/25", "4/25"],
  color: ["#98abc5", "#a05d56", "#8a89a6"],
  data: [[10, 30, 40, 20, 30], [100, 20, 30, 50, 60],
    [100, 20, 30, 50, 60]]
}
