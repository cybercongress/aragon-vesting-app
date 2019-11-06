import React from 'react';
import { useAragonApi } from '@aragon/api-react';
import { Text, DataView } from '@aragon/ui';

const PAGINATION = 10;
const DEFAULT_PROOF = 'Processing by cyber~Congress';

function ClaimHistoryTable(props) {
  const { appState } = useAragonApi();
  const { userClaims } = appState;

  return (
    <div {...props}>
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
            <Text style={{ minWidth: '60px' }}>{vestingId}</Text>,
            <Text style={{ minWidth: '60px' }}>{amount}</Text>,
            <Text>{start.toLocaleString()}</Text>,
            <Text>{account}</Text>,
            <Text>{proof || DEFAULT_PROOF}</Text>,
          ]}
          mode="table"
          entriesPerPage={PAGINATION}
        />
      )}
    </div>
  );
}

export default ClaimHistoryTable;
