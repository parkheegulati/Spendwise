import { useContext } from "react";
import { Sparkles, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
import { formatAmount } from "../util/util.js";

const SmartInsightsCard = ({ insights }) => {
    const { user } = useContext(AppContext);
    const currency = user?.currency || "INR";

    if (!insights) return null;

    const { savingsRate = 0, topExpenseCategory = "None", topCategoryAmount = 0, insightsList = [] } = insights;

    return (
        <div className="bg-purple-50/80 border border-purple-200/70 text-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-600/20">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h4 className="text-base font-bold tracking-wide text-purple-950">SpendWise Smart Financial Insights</h4>
                    <p className="text-xs text-purple-700/80 font-medium">AI-driven monthly summary & advice</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Savings Rate Card */}
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mb-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <span>Savings Rate</span>
                    </div>
                    <span className="text-2xl font-extrabold text-green-700">{savingsRate}%</span>
                    <p className="text-[11px] text-gray-400 mt-1">of monthly income saved</p>
                </div>

                {/* Top Category Card */}
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mb-1">
                        <Award size={16} className="text-amber-600" />
                        <span>Top Expense Category</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 truncate block">{topExpenseCategory}</span>
                    <p className="text-[11px] text-gray-400 mt-1">{formatAmount(topCategoryAmount, currency)} spent</p>
                </div>

                {/* Financial Health Badge */}
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mb-1">
                        <AlertTriangle size={16} className="text-purple-600" />
                        <span>Financial Status</span>
                    </div>
                    <span className={`text-lg font-bold ${savingsRate >= 30 ? 'text-emerald-600' : savingsRate > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {savingsRate >= 30 ? '🌟 Excellent' : savingsRate > 0 ? '👍 Stable' : '⚠️ Alert'}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">Based on monthly cashflow</p>
                </div>
            </div>

            {/* Bullets */}
            {insightsList.length > 0 && (
                <div className="space-y-2 mt-4 pt-3 border-t border-purple-200/60 text-xs text-purple-950 font-medium">
                    {insightsList.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <p>{tip}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartInsightsCard;
