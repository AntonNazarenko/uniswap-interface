 import { Token } from '@uniswap/sdk'
 import React, { useCallback, useEffect, useMemo, useState } from 'react'
 import { Button } from '@material-ui/core';
 import AdvancedSwapDetailsDropdown from '../components/swap/AdvancedSwapDetailsDropdown'
 import { Chart } from '../components/swap/styleds'
 import TokenWarningModal from '../components/TokenWarningModal'
 import { SwapPoolTabs } from '../components/NavigationTabs'
 
 import { useCurrency, useAllTokens } from '../hooks/Tokens'
 import useToggledVersion, { Version } from '../hooks/useToggledVersion'
 import useWrapCallback, { WrapType } from '../hooks/useWrapCallback'
 import { Field } from '../state/swap/actions'
 import {
   useDefaultsFromURLSearch,
   useDerivedSwapInfo,
   useSwapState
 } from '../state/swap/hooks'
 import { useIsTransactionUnsupported } from 'hooks/Trades'
 import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
 import { RouteComponentProps } from 'react-router-dom'
 
 import Pool from './Pool'
 import Vote from './Vote'
 
 import ExchangeInfoBar from '../components/ExchangeInfoBar'
 
 export default function Swap({ history }: RouteComponentProps) {
   const loadedUrlParams = useDefaultsFromURLSearch()
   const CHART_URL = 'https://bitfinexcom.github.io/bfx-hf-tradingview'
 
   // token warning stuff
   const [loadedInputCurrency, loadedOutputCurrency] = [
     useCurrency(loadedUrlParams?.inputCurrencyId),
     useCurrency(loadedUrlParams?.outputCurrencyId)
   ]
   const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
   const urlLoadedTokens: Token[] = useMemo(
     () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
     [loadedInputCurrency, loadedOutputCurrency]
   )
   const handleConfirmTokenWarning = useCallback(() => {
     setDismissTokenWarning(true)
   }, [])
 
   // dismiss warning if all imported tokens are in active lists
   const defaultTokens = useAllTokens()
   const importTokensNotInDefault =
     urlLoadedTokens &&
     urlLoadedTokens.filter((token: Token) => {
       return !Boolean(token.address in defaultTokens)
     })
 
   const { typedValue } = useSwapState()
   const {
     v1Trade,
     v2Trade,
     currencies,
   } = useDerivedSwapInfo()
 
   const { wrapType } = useWrapCallback(
     currencies[Field.INPUT],
     currencies[Field.OUTPUT],
     typedValue
   )
   const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
   const toggledVersion = useToggledVersion()
   const tradesByVersion = {
     [Version.v1]: v1Trade,
     [Version.v2]: v2Trade
   }
   const trade = showWrap ? undefined : tradesByVersion[toggledVersion]

 
   // reset if they close warning without tokens in params
   const handleDismissTokenWarning = useCallback(() => {
     setDismissTokenWarning(true)
     history.push('/swap/')
   }, [history])
 
 
   // mark when a user has submitted an approval, reset onTokenSelection for input field
    
   const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)
 
   const [currentForm, setCurrentForm] = useState<'swap' | 'liquidity' | 'pair'>('swap')
 
   const changeForm = (formName: 'swap' | 'liquidity' | 'pair') => () => {
     setCurrentForm(formName);
   }

//    useEffect(() )
 
   return (
     <>
       <TokenWarningModal
         isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
         tokens={importTokensNotInDefault}
         onConfirm={handleConfirmTokenWarning}
         onDismiss={handleDismissTokenWarning}
       />
       <SwapPoolTabs active={'swap'} />
       <div className='page-container' style={{
         display: 'flex',
         marginBottom: '10px',
       }}>
         <div className='sidemenu' style={{ width: '580px', marginRight: '10px' }}>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <Button variant='contained' style={{ borderRadius: '0px' }} disabled={currentForm === 'swap'} onClick={changeForm('swap')}>Swap</Button>
             <Button variant='contained' style={{ borderRadius: '0px' }} disabled={currentForm === 'liquidity'} onClick={changeForm('liquidity')}>Add Liquidity</Button>
             <Button variant='contained' style={{ borderRadius: '0px' }} disabled={currentForm === 'pair'} onClick={changeForm('pair')}>Create a pair</Button>
           </div>
           {<div>
             <iframe
             style={{
               display: currentForm === 'pair' || currentForm === 'liquidity' || currentForm === 'swap' ? 'block' : 'none',
               width: '100%',
               height: '1100px',
             }} src={
                 currentForm === 'pair' ? 'http://localhost:3000/#/create/ETH' : 
                 currentForm === 'liquidity' ? 'http://localhost:3000/#/add/ETH' : 
                 'http://localhost:3000/#/swap'} frameBorder='0'></iframe>
           </div>}
         </div>
         <div className='content' style={{
           width: '100%',
           display: 'block',
         }}>
           <ExchangeInfoBar />
           <Chart>
             <iframe
               src={`${CHART_URL}/?wsID=tBTCUSD&base=BTC&quote=USD`}
               title='thumbnails'
               frameBorder='0'
               style={{
                 width: '100%',
                 height: '100%',
               }} />
           </Chart>
         </div>
       </div>
       <Vote />
       {!swapIsUnsupported ? (
         <AdvancedSwapDetailsDropdown trade={trade} />
       ) : (
         <UnsupportedCurrencyFooter show={swapIsUnsupported} currencies={[currencies.INPUT, currencies.OUTPUT]} />
       )}
     </>
   )
 }
 