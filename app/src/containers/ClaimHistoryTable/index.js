import React from 'react';
import { useAragonApi } from '@aragon/api-react';
import { Text, DataView, Link } from '@aragon/ui';
import { formatCurrency } from '../../lib/web3-utils';

const PAGINATION = 10;
const DEFAULT_PROOF = 'Processing...';

function truncStringPortion(str, firstCharCount = str.length, endCharCount = 0, dotCount = 3) {
	var convertedStr="";
	convertedStr+=str.substring(0, firstCharCount);
	convertedStr += ".".repeat(dotCount);
	convertedStr+=str.substring(str.length-endCharCount, str.length);
	return convertedStr;
}

function ClaimHistoryTable({ style = {}, ...props }) {
  const { appState } = useAragonApi();
  const { userClaims } = appState;

  return (
    <div style={{ wordBreak: 'break-all', ...style }} {...props}>
      {userClaims && userClaims.length > 0 && (
        <DataView
          fields={[
            { label: 'ID', align: 'start' },
            { label: 'Amount', align: 'start' },
            { label: 'Date', align: 'start' },
            { label: 'CYBER Recipient', align: 'start' },
            { label: 'Proof TX', align: 'start' },
          ]}
          entries={userClaims.map(l => [
            l.vestingId,
            l.amount,
            l.start,
            l.account,
            l.proof,
          ])}
          renderEntry={([vestingId, amount, start, account, proof]) => [
            <Text style={{ width: '30px' }}>{vestingId}</Text>,
            <Text style={{ minWidth: '90px', maxWidth: '130px' }}>{formatCurrency(amount, 'GOL', 5)}</Text>,
            <Text style={{ width: '170px' }}>{start.toLocaleString()}</Text>,
            <Link
              style={{}}
              href={`https://cyber.page/network/euler/contract/${account}`}
            >
              {account}
            </Link>,
            proof ? (
              <Link
                style={{}}
                href={`https://cyber.page/network/euler/tx/${proof}`}
              >
                {truncStringPortion(proof, 6, 6, 3)}
              </Link>
            ) : (
              <Text style={{}}>{DEFAULT_PROOF}</Text>
            ),
          ]}
          mode="table"
          entriesPerPage={PAGINATION}
        />
      )}
    </div>
  );
}

export default ClaimHistoryTable;
