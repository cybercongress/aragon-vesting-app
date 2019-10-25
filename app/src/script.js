import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Aragon, { events } from '@aragon/api';
import { addressesEqual } from './lib/web3-utils'
import tokenManagerAbi from './abi/TokenManager';
import tokenAbi from './abi/MiniMeToken';
import retryEvery from './lib/retry-every'

const app = new Aragon();

retryEvery(() =>
  app
    .call('tokenManager')
    .subscribe(initialize, err =>
      console.error(
        `Could not start background script execution due to the contract not loading tokenManager: ${err}`
      )
    )
)

async function initialize(tokenManagerAddress) {
  const tokenManagerContract = app.external(
    tokenManagerAddress,
    tokenManagerAbi
  );
  const tokenAddress = await tokenManagerContract.token().toPromise();
  const tokenContract = app.external(tokenAddress, tokenAbi);

  return createStore(tokenManagerContract, tokenContract);
}

async function createStore(tokenManagerContract, tokenContract) {
  app.store(async (state, { event, returnValues, blockNumber, address }) => {
    let nextState = { ...state };

    // Initial state
    if (state == null) {
      nextState = {
        balanceOf: 0,
        transferableBalanceOf: 0,
      };
    }

    switch (event) {
      case events.ACCOUNTS_TRIGGER:
        return updateConnectedAccount(
          nextState,
          tokenManagerContract,
          tokenContract,
          returnValues
        );
      case events.SYNC_STATUS_SYNCING:
        nextState = { ...nextState, isSyncing: true };
        break;
      case events.SYNC_STATUS_SYNCED:
        nextState = { ...nextState, isSyncing: false };
        break;
      case 'NewLock':
        return newLock(
          nextState,
          tokenManagerContract,
          tokenContract,
          returnValues
        );
      default:
        return state;
    }

    return nextState;
  });
}

async function updateConnectedAccount(
  state,
  tokenManagerContract,
  tokenContract,
  { account }) 
{
  const claimsCount = await tokenManagerContract.vestingsLengths(account).toPromise()
  const claims = []

  for (let i = 0; i < claimsCount; i++) {
    let { amount, start, cliff, vesting } = await tokenManagerContract
      .getVesting(account, i)
      .toPromise()
      claims.push({ 
        amount: amount,
        start: start,
        cliff: cliff,
        vesting: vesting
      })
  }

  return {
    ...state,
    account,
    claims,
    balanceOf: await getBalanceOf(tokenContract, account),
    transferableBalanceOf: await getTransferableBalanceOf(
      tokenManagerContract,
      account
    ),
  };
}

async function newLock(
  state,
  tokenManagerContract,
  tokenContract,
  { vestingId, lockAddress, claim }
) {
  const { account, claims } = state;
  
  if (!(account && addressesEqual(lockAddress, account))) return state

  console.log("claims", claims);
  let { amount, start, cliff, vesting } = await tokenManagerContract
    .getVesting(account, vestingId).toPromise();

  return {
    ...state,
    claims: [...claims, { 
      amount: amount,
      start: start,
      cliff: cliff,
      vesting: vesting
    }],
    balanceOf: await getBalanceOf(tokenContract, account),
    transferableBalanceOf: await getTransferableBalanceOf(
      tokenManagerContract,
      account
    ),
  };
}

async function getBalanceOf(tokenContract, address) {
  return parseInt(await tokenContract.balanceOf(address).toPromise(), 10);
}

async function getTransferableBalanceOf(tokenManagerContract, address) {
  return parseInt(
    await tokenManagerContract.spendableBalanceOf(address).toPromise(),
    10
  );
}
