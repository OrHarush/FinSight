import * as XLSX from 'xlsx';

import { ExportTransactionsQuery } from '../../schemas/transactionExportSchemas';
import * as transactionService from './transactionService';

const HEADERS = ['תאריך עסקה', 'שם בית עסק', 'סכום חיוב'];

const buildSignedAmount = (type: string, amount: number) => (type === 'Income' ? -amount : amount);

const applyDateFormat = (ws: XLSX.WorkSheet, rowCount: number) => {
  for (let r = 1; r <= rowCount; r++) {
    const ref = XLSX.utils.encode_cell({ c: 0, r });
    const cell = ws[ref];

    if (cell) {
      cell.t = 'd';
      cell.z = 'dd/mm/yyyy';
    }
  }
};

export const exportByMonth = async (
  userId: string,
  query: ExportTransactionsQuery
): Promise<Buffer> => {
  const { data } = await transactionService.findAll(userId, {
    targetYear: query.targetYear,
    targetMonth: query.targetMonth,
    from: query.from,
    to: query.to,
    sort: 'desc',
  });

  const exportable = data.filter(tx => tx.type !== 'Transfer');

  const rows = exportable.map(tx => [
    new Date(tx.date),
    tx.name ?? '',
    buildSignedAmount(tx.type, tx.amount),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows], { cellDates: true });

  applyDateFormat(ws, rows.length);

  ws['!cols'] = [{ wch: 14 }, { wch: 32 }, { wch: 14 }];
  ws['!views'] = [{ RTL: true, state: 'frozen', topLeftCell: 'A2', ySplit: 1 }];

  const wb = XLSX.utils.book_new();
  wb.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};
