import { assets } from "../assets/assets.js";

const ProductShowcase = () => {
    return (
        <section className="pb-20 md:pb-32 bg-white">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="relative p-3 bg-gradient-to-tr from-purple-100 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl shadow-purple-900/25 border border-purple-100">
                    <img
                        src={assets.landing}
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-gray-200/60"
                        alt="SpendWise App Dashboard Preview"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x600/E2E8F0/4A5568?text=Image+Not+Found'; }}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;