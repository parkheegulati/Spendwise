import { useState, useEffect, useContext } from "react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus, Trash2, Calendar, CreditCard, LoaderCircle, Layers } from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import Input from "../components/Input.jsx";
import EmojiPickerPopup from "../components/EmojiPickerPopup.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { formatAmount } from "../util/util.js";

const Subscriptions = () => {
    useUser();
    const { user } = useContext(AppContext);
    const currency = user?.currency || "INR";

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    const [newSub, setNewSub] = useState({
        name: "",
        amount: "",
        billingCycle: "monthly",
        dueDate: 1,
        category: "Entertainment",
        icon: ""
    });

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_SUBSCRIPTIONS);
            setSubscriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
            toast.error("Failed to load subscriptions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        if (!newSub.name.trim() || !newSub.amount) {
            toast.error("Name and amount are required");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_SUBSCRIPTION, newSub);
            if (response.status === 201) {
                toast.success("Subscription added successfully!");
                setOpenAddModal(false);
                setNewSub({ name: "", amount: "", billingCycle: "monthly", dueDate: 1, category: "Entertainment", icon: "" });
                fetchSubscriptions();
            }
        } catch (error) {
            console.error("Error adding subscription:", error);
            toast.error(error.response?.data?.message || "Failed to add subscription");
        }
    };

    const handleDeleteSubscription = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_SUBSCRIPTION(id));
            toast.success("Subscription deleted");
            fetchSubscriptions();
        } catch (error) {
            console.error("Error deleting subscription:", error);
            toast.error("Failed to delete subscription");
        }
    };

    const totalMonthlyCommitment = subscriptions.reduce((sum, item) => sum + item.amount, 0);

    const getDueBadge = (dueDate) => {
        const today = new Date().getDate();
        if (dueDate === today) {
            return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Due Today</span>;
        }
        const diff = dueDate - today;
        if (diff > 0 && diff <= 5) {
            return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Due in {diff} days</span>;
        }
        return <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Day {dueDate} of month</span>;
    };

    return (
        <Dashboard activeMenu="Subscriptions">
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recurring Bills & Subscriptions</h2>
                        <p className="text-xs text-gray-500 mt-1">Track monthly fixed costs, due dates, and software subscriptions.</p>
                    </div>
                    <button
                        onClick={() => setOpenAddModal(true)}
                        className="add-btn add-btn-fill flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                        <Plus size={16} />
                        Add Subscription
                    </button>
                </div>

                {/* Total Commitment Card */}
                <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <CreditCard size={28} />
                        </div>
                        <div>
                            <span className="text-xs text-purple-200 uppercase font-semibold tracking-wider">Total Monthly Commitment</span>
                            <h3 className="text-3xl font-extrabold mt-0.5">{formatAmount(totalMonthlyCommitment, currency)}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm bg-white/20 px-3 py-1.5 rounded-full font-medium">{subscriptions.length} Active Subscriptions</span>
                    </div>
                </div>

                {/* Subscriptions Grid */}
                <div className="card p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Active Subscriptions</h5>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoaderCircle className="animate-spin text-purple-600" size={28} />
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <p className="text-sm text-gray-500 py-6 text-center">No subscriptions added yet. Click "Add Subscription" to start tracking.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-700">
                                                    {sub.icon ? (
                                                        <img src={sub.icon} alt={sub.name} className="w-5 h-5 object-contain" />
                                                    ) : (
                                                        <Layers size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold text-gray-900 text-sm">{sub.name}</h6>
                                                    <p className="text-xs text-gray-400">{sub.category}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteSubscription(sub.id)}
                                                className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-baseline justify-between my-2">
                                            <span className="text-xl font-bold text-gray-900">{formatAmount(sub.amount, currency)}</span>
                                            <span className="text-xs text-gray-400 capitalize">/ {sub.billingCycle}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar size={14} />
                                            <span>Due date</span>
                                        </div>
                                        {getDueBadge(sub.dueDate)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal to add subscription */}
                <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Add Recurring Subscription">
                    <form onSubmit={handleAddSubscription} className="space-y-4">
                        <EmojiPickerPopup
                            icon={newSub.icon}
                            onSelect={(icon) => setNewSub({ ...newSub, icon })}
                        />

                        <Input
                            label="Subscription / Bill Name"
                            placeholder="e.g. Netflix, Spotify, Rent, Gym"
                            value={newSub.name}
                            onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                        />

                        <Input
                            label="Monthly Amount"
                            type="number"
                            placeholder="e.g. 499"
                            value={newSub.amount}
                            onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                        />

                        <Input
                            label="Due Day of Month (1 - 31)"
                            type="number"
                            placeholder="e.g. 5"
                            value={newSub.dueDate}
                            onChange={(e) => setNewSub({ ...newSub, dueDate: e.target.value })}
                        />

                        <Input
                            label="Category"
                            placeholder="e.g. Entertainment, Utilities, Housing"
                            value={newSub.category}
                            onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
                        />

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setOpenAddModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="add-btn add-btn-fill"
                            >
                                Save Subscription
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Subscriptions;
