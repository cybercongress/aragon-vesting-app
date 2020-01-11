import { toChecksumAddress } from 'web3-utils';

const MILLISECONDS_IN_SECOND = 1000;

const DEFAULT_DECIMAL_DIGITS = 3;
const DEFAULT_CURRENCY = 'GOL';

const PREFIXES = [
  {
    prefix: 'T',
    power: 10 ** 12,
  },
  {
    prefix: 'G',
    power: 10 ** 9,
  },
  {
    prefix: 'M',
    power: 10 ** 6,
  },
  {
    prefix: 'K',
    power: 10 ** 3,
  },
];

export function roundCurrency(value, decimalDigits = 0) {
  return value
    .toFixed(decimalDigits)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

export function formatCurrency(
  value,
  currency = DEFAULT_CURRENCY,
  decimalDigits = DEFAULT_DECIMAL_DIGITS
) {
  const { prefix = '', power = 1 } =
    PREFIXES.find(({ power }) => value >= power) || {};

  return `${roundCurrency(value / power, decimalDigits)} ${prefix}${currency}`;
}

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
