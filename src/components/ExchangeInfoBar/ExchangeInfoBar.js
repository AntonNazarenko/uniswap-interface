import React from 'react'

import ExchangeInfoBarItem from './ExchangeInfoBarItem'
import quotePrefix from '../../utils/quote_prefix'

import { propTypes, defaultProps } from './ExchangeInfoBar.props'
import './style.css'

export default class ExchangeInfoBar extends React.PureComponent {
  static propTypes = propTypes
  static defaultProps = defaultProps

  render() {
    const { activeMarket, ticker } = this.props
    const { lastPrice, dailyChange, dailyChangePerc, high, low, volume } = ticker

    return (
      <div className="hfui-exchangeinfobar__wrapper">
        <ul>
          <ExchangeInfoBarItem
            text
            vertical
            label="Last Price"
            value={lastPrice || '-'}
            valuePrefix={quotePrefix(activeMarket.quote)}
          />

          <ExchangeInfoBarItem
            text
            vertical
            label="24h Change"
            value={dailyChange || '-'}
            valuePrefix={quotePrefix(activeMarket.quote)}
            dataClassName={dailyChange ? (dailyChange < 0 ? 'hfui-red' : 'hfui-green') : ''}
          />

          <ExchangeInfoBarItem
            text
            vertical
            label="24h Change %"
            valueSuffix="%"
            value={dailyChangePerc ? dailyChangePerc * 100 : '-'}
            dataClassName={dailyChangePerc ? (dailyChangePerc < 0 ? 'hfui-red' : 'hfui-green') : ''}
          />

          <ExchangeInfoBarItem
            text
            vertical
            label="24h High"
            valuePrefix={quotePrefix(activeMarket.quote)}
            value={high || '-'}
          />

          <ExchangeInfoBarItem
            text
            vertical
            label="24h Low"
            valuePrefix={quotePrefix(activeMarket.quote)}
            value={low || '-'}
          />

          <ExchangeInfoBarItem text vertical label="24h Volume" value={volume || '-'} />
        </ul>
      </div>
    )
  }
}
