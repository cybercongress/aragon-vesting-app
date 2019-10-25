import React from 'react';
import styled from 'styled-components';
import { Table, TableRow, TableCell, Text, theme } from '@aragon/ui';

function SummaryTable({ total, available }) {
  return (
    <Table>
      <TableRow>
        <TableHeader colSpan="3">
          <Text color={theme.textSecondary} size="xsmall">
            Your THC balance and claimed CYB tokens
          </Text>
        </TableHeader>
      </TableRow>
      <TableRow>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>Total THC</Text>
            <br />
            <Text size="xxlarge" color={theme.positive}>
              {total}
            </Text>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>CYBs claimed</Text>
            <br />
            <Text size="xxlarge">{total - available}</Text>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Text color={theme.textSecondary}>CYBs available to claim</Text>
            <br />
            <Text size="xxlarge">{available}</Text>
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
