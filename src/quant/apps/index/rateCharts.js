const echarts = require('echarts');
import moment from 'moment';
import $ from 'jquery';

// let rateChart = echarts.init(document.getElementById('echarts-rate'));
let countChart = echarts.init(document.getElementById('echarts-count'));


// let option = {
// 		title: {
// 				text: '收益率对比'
// 		},
// 		tooltip: {
// 				trigger: 'axis'
// 		},
// 		legend: {
// 				data: ['本次收益率', '总费用率', '总收益率']
// 		},
// 		grid: {
// 				left: '3%',
// 				right: '4%',
// 				bottom: '3%',
// 				containLabel: true
// 		},
// 		toolbox: {
// 				feature: {
// 						saveAsImage: {}
// 				}
// 		},
// 		xAxis: {
// 				type: 'category',
// 				boundaryGap: false,
// 				data: []
// 		},
// 		yAxis: {
// 				type: 'value'
// 		},
// 		series: []
// };
//
//
// rateChart.setOption(option);

let countOption = {
		title: {
				text: '费用收益对比'
		},
		tooltip: {
				trigger: 'axis'
		},
		legend: {
				data: ['本次收益', '总费用', '总收益']
		},
		grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
		},
		toolbox: {
				feature: {
						saveAsImage: {}
				}
		},
		xAxis: {
				type: 'category',
				boundaryGap: false,
				data: []
		},
		yAxis: {
				type: 'value'
		},
		series: []
};

countChart.setOption(countOption);



let timeArr = [];

let diffArr = [];
let totalFeeArr = [];
let profitArr = [];


// let currRateArr = [];
// let feeRateArr = [];
// let totalRateArr = [];

const format = {
	interval: (v) => {
		return Number(v).toFixed(2)
	}
}

const updateChart = (data) => {

		// currRateArr.push(data.currRate);
		// feeRateArr.push(data.feeRate);
		// totalRateArr.push(data.totalRate);

		diffArr.push(data.diff);
		totalFeeArr.push(data.totalFee);
		profitArr.push(data.profit);


		const time = moment(data.currTick[0]).format('MM-DD HH:mm')
		timeArr.push(time);

		const vinRate = data.vinCount/data.totalCount;
		const vinFail = (data.vinTotal/data.vinCount) / (Math.abs(data.failTotal)/data.failCount);

    $('#total-count').html(`<div style="text-align: left; padding: 20px 20px 0px 20px">
						初始本金: ${window.capital} <br />
						赢利总额: ${format.interval(data.vinTotal)} <br />
						亏损总额：${format.interval(Math.abs(data.failTotal))} <br />
						净利润: ${format.interval(data.profit)} <br />
						收益率：${format.interval(data.profit*100/Number(window.capital))}% <br />
						总次数: ${data.totalCount} <br />
						失败次数: ${data.failCount} <br />
						赢利次数: ${data.vinCount} <br />
						胜率: ${format.interval(100 * vinRate)}% <br />
						盈亏比: ${format.interval(vinFail)} <br />
						胜率*盈亏率: ${format.interval(vinRate * vinFail)} <br />
						<!--夏普比率：<br />-->
						<!--最大回撤：-->
						</div>`
    );

		// let rateSeries = [{
		// 		name: '本次收益率',
		// 		type: 'line',
		// 		data: currRateArr
		// }, {
		// 		name: '总费用率',
		// 		type: 'line',
		// 		data: feeRateArr
		// }, {
		// 		name: '总收益率',
		// 		type: 'line',
		// 		data: totalRateArr
		// }];

		let countSeries = [{
						name: '本次收益',
						type: 'line',
						data: diffArr
				}, {
						name: '总费用',
						type: 'line',
						data: totalFeeArr
				}, {
						name: '总收益',
						type: 'line',
						data: profitArr
				}];


		// rateChart.setOption({
		// 		xAxis: {
		// 				data: timeArr
		// 		},
		// 		series: rateSeries
		// });
		countChart.setOption({
				xAxis: {
						data: timeArr
				},
				series: countSeries
		});
}

export {updateChart}
