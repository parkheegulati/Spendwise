import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Target, Zap, ArrowRight } from "lucide-react";

const About = () => {
    const values = [
        {
            icon: ShieldCheck,
            title: "Privacy First",
            description: "Your financial records belong strictly to you. Secure authentication and encrypted sessions ensure data peace of mind.",
            badgeColor: "bg-purple-100 text-purple-700 border border-purple-200"
        },
        {
            icon: Sparkles,
            title: "Intelligent Simplicity",
            description: "We eliminate complex accounting jargon and replace it with clear, visual insights that anyone can understand.",
            badgeColor: "bg-emerald-100 text-emerald-700 border border-emerald-200"
        },
        {
            icon: Target,
            title: "Goal Oriented",
            description: "From setting monthly category spending targets to building a consistent savings habit, SpendWise keeps you on track.",
            badgeColor: "bg-amber-100 text-amber-700 border border-amber-200"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Log expenses, import bank CSV statements, and generate report exports in seconds without friction.",
            badgeColor: "bg-blue-100 text-blue-700 border border-blue-200"
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col justify-between">
            <div>
                <Header />

                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-purple-50/60 to-white text-center">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            About SpendWise
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Master Your Money with <span className="text-purple-700">Clarity & Confidence</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                            SpendWise was created to solve a simple problem: personal finance should be effortless, visual, and intelligent. We empower individuals to manage incomes, control expenses, track subscriptions, and achieve true financial freedom.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-16 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Principles</h2>
                            <p className="text-gray-500 mt-2 text-sm md:text-base">Why thousands choose SpendWise for daily financial tracking.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((val, idx) => {
                                const Icon = val.icon;
                                return (
                                    <div key={idx} className="p-6 rounded-2xl border border-gray-200/70 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${val.badgeColor}`}>
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{val.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{val.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Team / Mission Banner */}
                <section className="py-16 bg-slate-900 text-white">
                    <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Our Mission</span>
                            <h2 className="text-3xl font-bold mt-2 leading-tight">Built for Smart, Stress-Free Financial Growth</h2>
                            <p className="text-slate-300 text-sm mt-3 max-w-xl">
                                Whether you're saving for a home, tracking monthly subscriptions, or monitoring daily spending habits, SpendWise provides the exact tools you need in one place.
                            </p>
                        </div>
                        <Link
                            to="/signup"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-purple-600/30 whitespace-nowrap flex items-center gap-2"
                        >
                            Start Free Trial <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-8 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} SpendWise. All rights reserved.
            </footer>
        </div>
    );
};

export default About;
