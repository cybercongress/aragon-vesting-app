import React from 'react';
import { useAragonApi } from '@aragon/api-react';

import SummaryTable from '../../components/SummaryTable';

function ClaimTable(props) {
  const { appState } = useAragonApi();
  const { balanceOf, transferableBalanceOf } = appState;

  return (
    <SummaryTable
      total={balanceOf}
      available={transferableBalanceOf}
      {...props}
    />
  );
}

export default ClaimTable;
