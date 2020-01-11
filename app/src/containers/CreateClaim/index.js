import React, { useState } from 'react';
import { useAragonApi } from '@aragon/api-react';
import { Button } from '@aragon/ui';

import CreateClaimSidePanel from '../../components/CreateClaimSidePanel';

function CreateClaim({ containerStyle, ...props }) {
  const [sidePanelOpened, setSidePanelOpened] = useState(false);
  const { api, appState } = useAragonApi();
  const { transferableBalanceOf } = appState;

  return (
    <div style={containerStyle}>
      <Button
        mode="strong"
        disabled={!transferableBalanceOf}
        onClick={() => setSidePanelOpened(true)}
        {...props}
      >
        Create vesting
      </Button>
      <CreateClaimSidePanel
        maxValue={transferableBalanceOf}
        opened={sidePanelOpened}
        onClose={() => setSidePanelOpened(false)}
        onSubmit={(amount, account) => {
          setSidePanelOpened(false);
          api.lock(amount, account).toPromise();
        }}
      />
    </div>
  );
}

export default CreateClaim;
