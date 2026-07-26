import { Sparkles, Target, Repeat, Globe, BarChart3, FileSpreadsheet, ShieldCheck } from "lucide-react";

const FeaturesShowcase = () => {
    const features = [
        {
            icon: Sparkles,
            title: "AI Financial Insights",
            description: "Automated savings rate calculations, top category alerts, and personalized monthly recommendations.",
            color: "text-purple-600 bg-purple-50 border-purple-100"
        },
        {
            icon: Target,
            title: "Monthly Category Budgets",
            description: "Set spending limits per category with real-time green, orange, and red over-budget alerts.",
            color: "text-green-600 bg-green-50 border-green-100"
        },
        {
            icon: Repeat,
            title: "Subscriptions Tracker",
            description: "Monitor fixed monthly bills (Netflix, Rent, Gym) and never miss a payment with due-date badges.",
            color: "text-blue-600 bg-blue-50 border-blue-100"
        },
        {
            icon: Globe,
            title: "Multi-Currency Support",
            description: "Track finances in your preferred currency: ₹ INR, $ USD, € EUR, £ GBP, or ¥ JPY.",
            color: "text-amber-600 bg-amber-50 border-amber-100"
        },
        {
            icon: BarChart3,
            title: "Interactive Analytics",
            description: "Visualize cashflow using dynamic pie charts, category breakdowns, and monthly line graphs.",
            color: "text-indigo-600 bg-indigo-50 border-indigo-100"
        },
        {
            icon: FileSpreadsheet,
            title: "CSV Import & Excel Exports",
            description: "Bulk upload past bank statements via CSV and export monthly excel reports with one click.",
            color: "text-rose-600 bg-rose-50 border-rose-100"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 mb-3">
                        ✨ Everything You Need
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        What <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SpendWise</span> Offers
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-600">
                        A complete suite of intelligent financial tools designed to keep you in total control of your money.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-purple-700 group-hover:translate-x-1 transition-transform">
                                    <span>Included in SpendWise</span> →
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Footer Banner */}
                <div className="mt-16 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-base">Private & Zero Setup Required</h4>
                            <p className="text-xs text-gray-500">Your financial data stays secure with JWT authentication & zero external bloat.</p>
                        </div>
                    </div>
                    <a
                        href="/signup"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 whitespace-nowrap"
                    >
                        Get Started Free
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FeaturesShowcase;
