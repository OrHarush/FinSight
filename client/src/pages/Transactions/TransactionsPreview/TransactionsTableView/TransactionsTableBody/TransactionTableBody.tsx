import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { TableBody, TableCell, TableRow } from '@mui/material';

import EntityEmpty from '@/components/entities/EntityEmpty';
import { useCategories } from '@/hooks/entities/useCategories';
import GhostTransactionRow from '@/pages/Transactions/TransactionsPreview/GhostTransactionRow';
import { ExpandedTransactionDto } from '@/types/Transaction';
import type { GhostContributionDto } from '@/types/Goal';

import TransactionTableRow from './TransactionTableRow';

interface TransactionTableBodyProps {
  transactions: ExpandedTransactionDto[];
  ghosts?: GhostContributionDto[];
  onLogContribution: (ghost: GhostContributionDto) => void;
  onOpenGhostDialog: (ghost: GhostContributionDto) => void;
}

const FALLBACK_GOAL_COLOR = '#9ca3af';

const TransactionTableBody = ({
  transactions,
  ghosts = [],
  onLogContribution,
  onOpenGhostDialog,
}: TransactionTableBodyProps) => {
  const { categories } = useCategories();

  const resolveGoalColor = (categoryId: string): string =>
    categories.find(c => c._id === categoryId)?.color ?? FALLBACK_GOAL_COLOR;

  const pendingGhosts = ghosts.filter(ghost => !ghost.satisfied);
  const hasContent = transactions.length > 0 || pendingGhosts.length > 0;

  return (
    <TableBody>
      {pendingGhosts.map(ghost => (
        <GhostTransactionRow
          key={`ghost-${ghost.goalId}`}
          ghost={ghost}
          color={resolveGoalColor(ghost.categoryId)}
          onLogContribution={onLogContribution}
          onOpenDialog={onOpenGhostDialog}
        />
      ))}
      {!hasContent && (
        <TableRow sx={{ height: '100%' }}>
          <TableCell colSpan={7} align="center" sx={{ verticalAlign: 'middle', border: 0 }}>
            <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />
          </TableCell>
        </TableRow>
      )}
      {transactions.map(tx => (
        <TransactionTableRow key={tx._id} transaction={tx} />
      ))}
    </TableBody>
  );
};

export default TransactionTableBody;
