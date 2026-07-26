import { useState, useContext } from "react";
import moment from "moment";
import { Download, Mail, Upload, FileSpreadsheet } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import CsvImportModal from "./CsvImportModal.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { formatAmount } from "../util/util.js";

const ExpenseList = ({ transactions = [], onDelete, onDownload, onEmail, onRefresh }) => {
    const [openImportModal, setOpenImportModal] = useState(false);
    const { user } = useContext(AppContext);
    const currency = user?.currency || "INR";

    const exportToCsv = () => {
        if (!transactions || transactions.length === 0) return;
        const headers = ["ID", "Name", "Category", "Amount", "Date"];
        const rows = transactions.map(t => [t.id, `"${t.name}"`, `"${t.categoryName || 'General'}"`, t.amount, t.date]);
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `SpendWise_Expenses_${moment().format("YYYY-MM-DD")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h5 className="text-lg font-bold text-gray-900">All Expenses</h5>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="card-btn" onClick={() => setOpenImportModal(true)}>
                            <Upload size={15} /> Import CSV
                        </button>
                        <button className="card-btn" onClick={exportToCsv}>
                            <FileSpreadsheet size={15} /> Export CSV
                        </button>
                        <button className="card-btn" onClick={onEmail}>
                            <Mail size={15} /> Email Excel
                        </button>
                        <button className="card-btn" onClick={onDownload}>
                            <Download size={15} /> Excel
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((expense) => (
                            <TransactionInfoCard
                                key={expense.id}
                                title={expense.name}
                                icon={expense.icon}
                                date={moment(expense.date).format("Do MMM YYYY")}
                                amount={expense.amount}
                                type="expense"
                                onDelete={() => onDelete(expense.id)}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 py-4 col-span-2 text-center">
                            No expenses found for this month.
                        </p>
                    )}
                </div>
            </div>

            <CsvImportModal
                isOpen={openImportModal}
                onClose={() => setOpenImportModal(false)}
                type="expense"
                onSuccess={onRefresh}
            />
        </>
    );
};

export default ExpenseList;
