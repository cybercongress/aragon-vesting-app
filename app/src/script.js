import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { of } from 'rxjs'
import AragonApi from '@aragon/api'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const api = new AragonApi()

api.store(
  async (state, event) => {
    let newState

    switch (event.event) {
      case INITIALIZATION_TRIGGER:
        newState = { 
          balanceOf: await getBalanceOf(),
          transferableBalanceOf: await getTransferableBalanceOf()
        }
        break
      case 'NewLock':
        newState = {
          balanceOf: await getBalanceOf(),
          transferableBalanceOf: await getTransferableBalanceOf()
        }
        break
      default:
        newState = state
    }

    return newState
  },
  [
    // Always initialize the store with our own home-made event
    of({ event: INITIALIZATION_TRIGGER }),
  ]
)

async function getBalanceOf() {
  return parseInt(await api.call('balanceOf', "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7").toPromise(), 10)
}

async function getTransferableBalanceOf() {
  return parseInt(await api.call('transferableBalanceOf', "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7").toPromise(), 10)
}
