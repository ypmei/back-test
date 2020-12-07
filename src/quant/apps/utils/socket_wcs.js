let ws;
let onExchangeRealtimeCallback;
let updateExchangeInfoCallback;
let updateRateCallback;
let updateKlineShapeCallback;

const startSocket = () => {
  ws = new WebSocket(`ws://${window.wsHost}`);
    // ws = new WebSocket("ws://47.240.18.158:8000");

  ws.onopen = function () {
      console.log("ws open");
      ws.send('client: hello, server');
  }

  ws.onclose = function () {
      console.log('ws close');
  }

  ws.onerror = (error) => {
    console.log(`websocket error happened. Error: ${JSON.stringify(error)}`);
  };

  ws.onmessage = (message) => {
    const msgData = JSON.parse(message.data);
    const {currTick, type } = msgData

    if(type === 'order') {
      // 更新页面数据
      updateExchangeInfoCallback && updateExchangeInfoCallback(msgData);
      updateKlineShapeCallback && updateKlineShapeCallback(msgData);

    }

    if(type === 'rate') {
        // 更新页面数据
        updateRateCallback && updateRateCallback(msgData);
    }

    if(type === 'tick') {
        let tickerData = [currTick]
        tickerData.forEach((i, index) => {
            onExchangeRealtimeCallback && onExchangeRealtimeCallback({
                time: Number(i[0]),
                low: Number(i[1]),
                high: Number(i[2]),
                open: Number(i[3]),
                close: Number(i[4]),
                volume: Number(i[5]),
            })
        });
    }
  };
};

export const socketInit = () => {
  startSocket();
};

export const setExchangeRealtimeCallback = (callback) => {
  onExchangeRealtimeCallback = callback;
};

export const setExchangeInfoCallback = (callback) => {
    updateExchangeInfoCallback = callback
}

export const setRateCallback = (callback) => {
		updateRateCallback = callback
}


export const setKlineShapeCallback = (callback) => {
  updateKlineShapeCallback = callback;
}
