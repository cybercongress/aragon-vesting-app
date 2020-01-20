import React, { useState } from 'react';
import styled from 'styled-components';
import { SidePanel, Button, TextInput, Text, theme } from '@aragon/ui';

function CreateClaimSidePanel({ opened, onClose, onSubmit, maxValue }) {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const isValid = amount && amount > 0 && (!maxValue || amount <= maxValue);

  return (
    <SidePanel title="Vest GOLs" opened={opened} onClose={onClose}>
      <AmountTitle size="xsmall" color={theme.textSecondary}>
        Amount <span style={{ color: theme.accent }}>*</span>
      </AmountTitle>
      <AmountInput
        type="number"
        min="0"
        max={maxValue}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <AccountTitle size="xsmall" color={theme.textSecondary}>
        Account <span style={{ color: theme.accent }}>*</span>
      </AccountTitle>
      <AccountInput
        type="text"
        value={account}
        onChange={e => setAccount(e.target.value)}
      />
      <Button
        mode="strong"
        disabled={!isValid}
        onClick={() => onSubmit(amount, account)}
      >
        Vest GOLs
      </Button>
    </SidePanel>
  );
}

const AmountTitle = styled(Text)`
  margin-bottom: 5px;
`;

const AmountInput = styled(TextInput)`
  margin-bottom: 30px;
`;

const AccountTitle = styled(Text)`
  margin-bottom: 5px;
`;

const AccountInput = styled(TextInput)`
  margin-bottom: 30px;
`;

export default CreateClaimSidePanel;
