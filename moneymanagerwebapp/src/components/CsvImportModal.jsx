import { useState } from "react";
import Modal from "./Modal.jsx";
import { Upload, FileText, CheckCircle2, AlertCircle, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";

const CsvImportModal = ({ isOpen, onClose, type = "expense", onSuccess }) => {
    const [parsedData, setParsedData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith(".csv") && !file.type.includes("csv") && !file.type.includes("text/plain")) {
            toast.error("Please select a valid .csv file");
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (evt) => {
            const text = evt.target.result;
            parseCsvText(text);
        };

        reader.readAsText(file);
    };

    const parseCsvText = (csvText) => {
        const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== "");
        if (lines.length <= 1) {
            toast.error("CSV file is empty or missing data rows");
            return;
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("title") || h.includes("description"));
        const amountIdx = headers.findIndex(h => h.includes("amount") || h.includes("price") || h.includes("cost"));
        const dateIdx = headers.findIndex(h => h.includes("date"));
        const catIdx = headers.findIndex(h => h.includes("category"));

        const items = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (cols.length < 2) continue;

            const name = nameIdx !== -1 ? cols[nameIdx] : cols[0];
            const amount = amountIdx !== -1 ? parseFloat(cols[amountIdx]) : parseFloat(cols[1]);
            const date = dateIdx !== -1 ? cols[dateIdx] : (cols[2] || new Date().toISOString().split("T")[0]);
            const categoryName = catIdx !== -1 ? cols[catIdx] : (cols[3] || "General");

            if (name && !isNaN(amount)) {
                items.push({ name, amount, date, categoryName });
            }
        }

        if (items.length === 0) {
            toast.error("No valid transaction rows found in CSV");
        } else {
            setParsedData(items);
            toast.success(`Found ${items.length} valid transactions!`);
        }
    };

    const handleImportSubmit = async () => {
        if (parsedData.length === 0) return;
        setLoading(true);

        try {
            const endpoint = type === "expense" ? "/expenses/bulk" : "/incomes/bulk";
            const response = await axiosConfig.post(endpoint, { items: parsedData });
            if (response.status === 201) {
                toast.success(`Successfully imported ${parsedData.length} ${type}s!`);
                setParsedData([]);
                setFileName("");
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error("Bulk import failed:", error);
            toast.error(error.response?.data?.message || "Failed to import CSV transactions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Bulk Import ${type === 'expense' ? 'Expenses' : 'Incomes'} via CSV`}>
            <div className="space-y-4">
                <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 hover:bg-purple-50 rounded-2xl p-6 text-center transition-all cursor-pointer relative">
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="mx-auto text-purple-600 mb-2" size={32} />
                    <p className="text-sm font-semibold text-gray-800">
                        {fileName ? fileName : "Click or drag a .csv file to upload"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Expected columns: Name, Amount, Date, Category</p>
                </div>

                {parsedData.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between my-2">
                            <span className="text-xs font-bold text-gray-700">Preview ({parsedData.length} items):</span>
                            <span className="text-xs text-green-600 flex items-center gap-1 font-semibold">
                                <CheckCircle2 size={14} /> Ready to import
                            </span>
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                            {parsedData.slice(0, 10).map((row, idx) => (
                                <div key={idx} className="p-2.5 text-xs flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-gray-800">{row.name}</span>
                                        <span className="text-gray-400 ml-2">({row.categoryName})</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-900">₹{row.amount}</span>
                                        <span className="text-gray-400 block text-[10px]">{row.date}</span>
                                    </div>
                                </div>
                            ))}
                            {parsedData.length > 10 && (
                                <p className="text-center text-[11px] text-gray-400 py-1 bg-gray-50">
                                    + {parsedData.length - 10} more rows
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleImportSubmit}
                        disabled={parsedData.length === 0 || loading}
                        className={`add-btn add-btn-fill ${parsedData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            `Import ${parsedData.length} Rows`
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CsvImportModal;
