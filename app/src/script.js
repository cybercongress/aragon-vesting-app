import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Aragon, { events } from '@aragon/api';
import { addressesEqual, convertDate } from './lib/web3-utils';
import tokenManagerAbi from './abi/TokenManager';
import tokenAbi from './abi/MiniMeToken';
import retryEvery from './lib/retry-every';

const app = new Aragon();

retryEvery(() =>
  app
    .call('tokenManager')
    .subscribe(initialize, err =>
      console.error(
        `Could not start background script execution due to the contract not loading tokenManager: ${err}`
      )
    )
);

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
        claims: [],
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
      case 'NewProof':
        return newProof(nextState, returnValues);
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
  { account }
) {
  if (account && addressesEqual(state.account, account)) {
    return state;
  }

  return {
    ...state,
    account,
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
  { vestingId, lockAddress, amount, account }
) {
  if (!addressesEqual(state.account, lockAddress)) {
    return state;
  }

  const {
    start,
    cliff,
    vesting,
    revokable,
  } = await tokenManagerContract
    .getVesting(state.account, vestingId)
    .toPromise();
  const parsedAmount = parseInt(amount, 10);

  const balanceOf =
    state.balanceOf === undefined
      ? await getBalanceOf(tokenContract, state.account)
      : state.balanceOf;

  const transferableBalanceOf =
    state.transferableBalanceOf === undefined
      ? await getTransferableBalanceOf(tokenManagerContract, state.account)
      : state.transferableBalanceOf - parsedAmount;

  return {
    ...state,
    claims: [
      ...(state.claims || []),
      {
        vestingId,
        account,
        revokable,
        lockAddress,
        start: convertDate(start),
        cliff: convertDate(cliff),
        vesting: convertDate(vesting),
        amount: parsedAmount,
      },
    ],
    balanceOf,
    transferableBalanceOf,
  };
}

async function newProof(
  state,
  { claimer, vestingId, proofTx }
) {
  if (!addressesEqual(state.account, claimer)) {
    return state;
  }

  const index = parseInt(vestingId, 10);
  const claim = state.claims && state.claims[index];

  if (!claim) {
    return state;
  }

  return {
    ...state,
    claims: [
      ...state.claims.slice(0, index),
      {
        ...claim,
        proof: proofTx,
      },
      ...state.claims.slice(index + 1),
    ],
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
