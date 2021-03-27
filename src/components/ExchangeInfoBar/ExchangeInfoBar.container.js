import { connect } from 'react-redux'

import ExchangeInfoBar from './ExchangeInfoBar'

const mapStateToProps = () => {
  return {
    ticker: {
      lastPrice: 56021,
      dailyChange: '12%',
      dailyChangePerc: 0.12,
      high: 59000,
      low: 53000,
      volume: 213
    },
    activeMarket: {
      quote: 'USD',
      base: 'BTC'
    }
  }
}

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeInfoBar)
