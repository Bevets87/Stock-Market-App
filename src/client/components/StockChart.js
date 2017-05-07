import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighChart from 'react-highcharts'

import './StockChart.scss'

class StockChart extends Component {
  shouldComponentUpdate (nextProps) {
    if (nextProps.stocks.length !== this.props.stocks.length ) {
      return true
    } else {
      return false
    }
  }
  render () {
    let { stocks } = this.props
    let stockData = stocks.map(stock => {
      return {
        name: stock.data.dataset.dataset_code,
        data: stock.data.dataset.data.map( stockData => {
          stockData[0] = new Date(stockData[0]).getTime()
          return [ stockData[0], stockData[4] ]
        })
      }
    })
    let chartData = stockData.map( stock => {
      return {
        name: stock.name,
        data: stock.data.reverse()
      }
    })
    let config = {
      title: {
        text: ''
      },
      rangeSelector: {
        selected: 1
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },
      yAxis: {
        labels: {
          formatter: function () {
            return (this.value > 0 ? ' + ' : '') + this.value + '%'
          }
        },
        title: {
          text: ''
        }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%d %b %Y'   //ex- 01 Jan 2016
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b><br/>',
        valueDecimals: 2,
        split: true
      },
      useHighStocks: true,
      series: chartData
    }
    return (
			<div className='chart-container'>
        <h3>stock prices over the past year</h3>
				<ReactHighChart className='chart' config={config} ref='chart' />
			</div>
    )
  }
}

StockChart.propTypes = {
  stocks: PropTypes.array
}

export default StockChart
