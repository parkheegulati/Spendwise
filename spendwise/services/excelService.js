import ExcelJS from 'exceljs';

export const generateIncomeExcel = async (incomes) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Incomes');

  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 10 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Date', key: 'date', width: 15 }
  ];

  incomes.forEach((income, index) => {
    sheet.addRow({
      sno: index + 1,
      name: income.name || 'N/A',
      category: income.categoryName || 'N/A',
      amount: income.amount != null ? Number(income.amount) : 0,
      date: income.date ? String(income.date) : 'N/A'
    });
  });

  return await workbook.xlsx.writeBuffer();
};

export const generateExpenseExcel = async (expenses) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Expenses');

  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 10 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Date', key: 'date', width: 15 }
  ];

  expenses.forEach((expense, index) => {
    sheet.addRow({
      sno: index + 1,
      name: expense.name || 'N/A',
      category: expense.categoryName || 'N/A',
      amount: expense.amount != null ? Number(expense.amount) : 0,
      date: expense.date ? String(expense.date) : 'N/A'
    });
  });

  return await workbook.xlsx.writeBuffer();
};
