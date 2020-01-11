import React from 'react';
import styled from 'styled-components';
import { Table, TableRow, TableCell, Text, theme } from '@aragon/ui';
import { formatCurrency } from '../../lib/web3-utils';

function SummaryTable({ total, available }) {
  return (
    <Table>
      <TableRow>
        <TableHeader colSpan="3">
          <Text color={theme.textSecondary} size="small">
            Your balances.
          </Text>
        </TableHeader>
      </TableRow>
      <TableRow>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>Total</Text>
            <br />
            <Text size="xxlarge" color={theme.positive}>
              {formatCurrency(total)}
            </Text>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>Vested</Text>
            <br />
            <Text size="xxlarge">{formatCurrency(total - available)}</Text>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>Available</Text>
            <br />
            <Text size="xxlarge">{formatCurrency(available)}</Text>
          </div>
        </TableCell>
      </TableRow>
    </Table>
  );
}

const TableHeader = styled(TableCell)`
  padding: 10px 20px;
`;

export default SummaryTable;
