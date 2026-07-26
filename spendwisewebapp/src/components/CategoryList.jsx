import { useContext } from "react";
import { Layers2, Pencil, AlertCircle } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
import { formatAmount } from "../util/util.js";

const CategoryList = ({ categories, onEditCategory, categoryBudgets = [] }) => {
    const { user } = useContext(AppContext);
    const currency = user?.currency || "INR";

    const getBudgetInfo = (catId) => {
        return categoryBudgets.find(b => b.id === catId);
    };

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Category Sources & Monthly Budgets</h4>
            </div>

            {categories.length === 0 ? (
                <p className="text-gray-500">
                    No categories added yet. Add some to get started!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => {
                        const budgetDetails = getBudgetInfo(category.id);
                        const hasBudget = category.type === 'expense' && category.budget > 0;
                        const percentSpent = budgetDetails?.percentSpent || 0;
                        const totalSpent = budgetDetails?.totalSpent || 0;
                        const isOver = budgetDetails?.isOverBudget;

                        return (
                            <div
                                key={category.id}
                                className="group relative flex flex-col p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-white shadow-sm rounded-full flex-shrink-0">
                                        {category.icon ? (
                                            <span className="text-2xl">
                                                <img src={category.icon} alt={category.name} className="h-6 w-6 object-contain" />
                                            </span>
                                        ) : (
                                            <Layers2 className="text-purple-800" size={22} />
                                        )}
                                    </div>

                                    <div className="flex-1 flex items-center justify-between min-w-0">
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold truncate">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-gray-400 capitalize">
                                                {category.type}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onEditCategory(category)}
                                            className="text-gray-400 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>

                                {hasBudget && (
                                    <div className="mt-3 pt-3 border-t border-gray-200/60">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-500 font-medium">Spent: {formatAmount(totalSpent, currency)}</span>
                                            <span className={`font-semibold ${isOver ? 'text-red-600 flex items-center gap-1' : 'text-gray-600'}`}>
                                                {isOver && <AlertCircle size={12} />}
                                                Budget: {formatAmount(category.budget, currency)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${
                                                    isOver ? 'bg-red-600' : percentSpent >= 75 ? 'bg-amber-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min(percentSpent, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-1 text-right">
                                            {isOver ? (
                                                <span className="text-red-600 font-bold">Over budget by {formatAmount(totalSpent - category.budget, currency)}</span>
                                            ) : (
                                                `${percentSpent}% used`
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoryList;