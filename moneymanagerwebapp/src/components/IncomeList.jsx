import { useState, useContext } from "react";
import { Download, LoaderCircle, Mail, Upload, FileSpreadsheet } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";
import CsvImportModal from "./CsvImportModal.jsx";
import { AppContext } from "../context/AppContext.jsx";

const IncomeList = ({ transactions = [], onDelete, onDownload, onEmail, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const { user } = useContext(AppContext);

    const exportToCsv = () => {
        if (!transactions || transactions.length === 0) return;
        const headers = ["ID", "Name", "Category", "Amount", "Date"];
        const rows = transactions.map(t => [t.id, `"${t.name}"`, `"${t.categoryName || 'General'}"`, t.amount, t.date]);
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `SpendWise_Incomes_${moment().format("YYYY-MM-DD")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEmail = async () => {
        setLoading(true);
        try {
            await onEmail();
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h5 className="text-lg font-bold text-gray-900">Income Sources</h5>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="card-btn" onClick={() => setOpenImportModal(true)}>
                            <Upload size={15} /> Import CSV
                        </button>
                        <button className="card-btn" onClick={exportToCsv}>
                            <FileSpreadsheet size={15} /> Export CSV
                        </button>
                        <button disabled={loading} className="card-btn" onClick={handleEmail}>
                            {loading ? (
                                <>
                                    <LoaderCircle className="w-4 h-4 animate-spin" />
                                    Emailing...
                                </>
                            ) : (
                                <>
                                    <Mail size={15} /> Email Excel
                                </>
                            )}
                        </button>
                        <button disabled={loading} className="card-btn" onClick={handleDownload}>
                            {loading ? (
                                <>
                                    <LoaderCircle className="w-4 h-4 animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={15} /> Excel
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((income) => (
                            <TransactionInfoCard
                                key={income.id}
                                title={income.name}
                                icon={income.icon}
                                date={moment(income.date).format('Do MMM YYYY')}
                                amount={income.amount}
                                type="income"
                                onDelete={() => onDelete(income.id)}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 py-4 col-span-2 text-center">
                            No incomes found for this month.
                        </p>
                    )}
                </div>
            </div>

            <CsvImportModal
                isOpen={openImportModal}
                onClose={() => setOpenImportModal(false)}
                type="income"
                onSuccess={onRefresh}
            />
        </>
    );
};

export default IncomeList;