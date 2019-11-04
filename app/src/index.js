import React from 'react';
import ReactDOM from 'react-dom';
import { AragonApi } from '@aragon/api-react';
import App from './App';
import { addressesEqual } from './lib/web3-utils';

const reducer = state => {
  if (state === null) {
    return {
      balanceOf: 0,
      transferableBalanceOf: 0,
      isSyncing: true,
      userClaims: null,
    };
  }

  if (state.claims && state.account) {
    return {
      ...state,
      userClaims: state.claims
        .filter(({ lockAddress }) => addressesEqual(state.account, lockAddress))
        .reverse(),
    };
  }

  return state;
};

ReactDOM.render(
  <AragonApi reducer={reducer}>
    <App />
  </AragonApi>,
  document.getElementById('root')
);
