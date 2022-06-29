<template>
  <div id="container"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
interface KlineOptions {
  ohlc: unknown[][];
  volume: unknown[][];
  groupingUnits: [string, number[]][];
}
function createKLine({ ohlc, volume, groupingUnits }: KlineOptions) {
  Highcharts.stockChart('container', {
    rangeSelector: {
      selected: 1,
    },
    title: {
      text: 'AAPL Historical',
    },
    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'OHLC',
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],
    tooltip: {
      split: true,
    },
    series: [
      {
        type: 'candlestick',
        name: 'AAPL',
        data: ohlc,
        dataGrouping: {
          units: groupingUnits,
        },
      },
      {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits,
        },
      },
    ],
  });
}
onMounted(() => {
  // 缓存
  const hData = (window as any)._hData as KlineOptions;
  if (hData) {
    createKLine(hData);
    return;
  }
  Highcharts.getJSON(
    'https://demo-live-data.highcharts.com/aapl-ohlcv.json',
    function (data: unknown[][]) {
      // split the data set into ohlc and volume
      var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [
          [
            'week', // unit name
            [1], // allowed multiples
          ],
          ['month', [1, 2, 3, 4, 6]],
        ],
        i = 0;

      for (i; i < dataLength; i += 1) {
        ohlc.push([
          data[i][0], // the date
          data[i][1], // open
          data[i][2], // high
          data[i][3], // low
          data[i][4], // close
        ]);

        volume.push([
          data[i][0], // the date
          data[i][5], // the volume
        ]);
      }

      (window as any)._hData = {
        volume,
        ohlc,
        groupingUnits,
      };

      // create the chart
      createKLine((window as any)._hData);
    }
  );
});
</script>
<style>
#container {
  width: calc(100vw - 4rem);
  height: 500px;
}
</style>
