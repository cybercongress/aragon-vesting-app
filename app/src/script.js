import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'

const app = new Aragon()

app.store(async (state, { event, returnValues, blockNumber, address }) => {
  let nextState = { ...state }

  // Initial state
  if (state == null) {
    nextState = {
      balanceOf: 0,
      transferableBalanceOf: 0,
    }
  } 

  switch (event) {
    case events.ACCOUNTS_TRIGGER:
        return updateConnectedAccount(nextState, returnValues)
    case events.SYNC_STATUS_SYNCING:
      nextState = { ...nextState, isSyncing: true }
      break
    case events.SYNC_STATUS_SYNCED:
      nextState = { ...nextState, isSyncing: false }
      break
    case 'NewLock':
      return newLock(nextState, returnValues)
    default:
      return state
  }

  return nextState
})

async function updateConnectedAccount(state, { account }) {
  return {
    ...state,
    account,
  }
}

async function newLock(state, { vestingId, lockAddress, amount }) {
  const { account } = state
  console.log('lock_info', vestingId, lockAddress, amount)
  return {
    ...state,
    balanceOf: await getBalanceOf(account),
    transferableBalanceOf: await getTransferableBalanceOf(account),
  }
}

async function getBalanceOf(address) {
  return parseInt(await app.call('balanceOf', address).toPromise(), 10)  
}

async function getTransferableBalanceOf(address) {
  return parseInt(await app.call('transferableBalanceOf', address).toPromise(), 10)
}
