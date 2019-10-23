import React from 'react';
import styled from 'styled-components';
import { useAragonApi } from '@aragon/api-react';
import { Main, Text, AppView } from '@aragon/ui';

import ClaimTable from './containers/ClaimTable';
import CreateClaim from './containers/CreateClaim';

function App() {
  const { appState } = useAragonApi();
  const { isSyncing } = appState;

  return (
    <Main>
      <AppContainer
        appBar={
          <Header>
            <Text size="xlarge">Claim CYB tokens</Text>
            <ClaimButton />
          </Header>
        }
      >
        {isSyncing && <Syncing />}
        <ClaimTable />
      </AppContainer>
    </Main>
  );
}

const AppContainer = styled(AppView)`
  padding: 0 70px;
`;

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 30px;
`;

const ClaimButton = styled(CreateClaim)`
  font-size: 16px;
  padding: 10px 40px;
`;

export default App;
