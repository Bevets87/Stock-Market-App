import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighCharts from 'react-highcharts'

import './StockChart.scss'

class StockChart extends Component {
  constructor (props) {
    super (props)
    this.state = {
      initialChartData: null
    }
  }
  componentDidMount () {
    const { stocks } = this.props
    let stockData = stocks.map( stock => {
      return {
        name: stock.data.dataset.dataset_code,
        data: stock.data.dataset.data.map( stockData => {
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
    this.setState({
      initialChartData: chartData
    })
  }
  shouldComponentUpdate (nextProps) {
    if (nextProps.stocks.length > this.props.stocks.length ) {
      return true
    } else {
      return false
    }
  }
  render () {
    const { stocks } = this.props
    let stockData = stocks.map( stock => {
      return {
        name: stock.data.dataset.dataset_code,
        data: stock.data.dataset.data.map( stockData => {
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
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Stock prices over the last year'
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b><br/>',
        valueDecimals: 2,
        split: true
      },
      series: chartData
    }
    return (
			<div className='chart-container'>
				<ReactHighCharts className='chart' config={config} ref='chart' />
			</div>
    )
  }
}

StockChart.propTypes = {
  stocks: PropTypes.array
}

export default StockChart
