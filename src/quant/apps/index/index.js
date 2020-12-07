import $ from 'jquery';
import _ from 'lodash';
import { socketInit, setExchangeInfoCallback, setRateCallback } from '$utils/socket_wcs';
import { initTradingView } from './tradingview';
import { updateChart } from './rateCharts';

var tableTpl = _.template(
    '<tr>' +
    '<td><%=eId%></td>'+
		'<td><%=action%></td>'+
		'<td><%=direction%></td>'+
		'<td><%=openPrice%></td>'+
		'<td><%=diff%></td>'+
		// '<td><%=signal%></td>'+
		// '<td><%=histogram%></td>'+
    '</tr>'
);

// 更新
function updateExchangeInfo(data){
    const {
        index, signal, currTick, diff
		    // macdData
    } = data

		// $('#klineData').prepend('<br>');
		// $('#klineData').prepend(JSON.stringify(signal.signalStr));
    if(signal && signal.action ==='hold') return;
    // const macd = _.last(macdData)


    $('#klineData').prepend(tableTpl({
		    eId: index,
		    action: signal.action,
		    direction: signal.direction,
		    openPrice: currTick[4],
		    diff,
        // DEA: macd.MACD,
        // signal: macd.signal,
		    // histogram: macd.histogram,
    }));
}

function updateRateChart(data) {
		updateChart(data);
}

$(function () {
    socketInit();
    initTradingView();
    setExchangeInfoCallback(updateExchangeInfo);
		setRateCallback(updateRateChart);
})
