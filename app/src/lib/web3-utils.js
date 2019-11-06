import { toChecksumAddress } from 'web3-utils';

const MILLISECONDS_IN_SECOND = 1000;

// Check address equality without checksums
export function addressesEqual(first, second) {
  return (
    first && second && toChecksumAddress(first) === toChecksumAddress(second)
  );
}

export function convertDate(date) {
  return new Date(parseInt(date, 10) * MILLISECONDS_IN_SECOND);
}

export { isAddress, toChecksumAddress, toUtf8, soliditySha3 } from 'web3-utils';
