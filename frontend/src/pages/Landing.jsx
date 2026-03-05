import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden relative">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            {/* Navbar */}
            <nav className="container mx-auto py-6 flex justify-between items-center relative z-10">
                <h1 className="text-2xl font-bold text-gradient">BizManager</h1>
                <div>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-secondary mr-4"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate('/login?mode=signup')}
                        className="btn btn-primary"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-4 pt-20 pb-16 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                        v2.0 Now Available
                    </span>
                    <h1 className="text-5xl md:text-6xl leading-tight mb-6">
                        Manage Your Business <br />
                        <span className="text-gradient">Like a Pro.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        The all-in-one desktop solution for inventory, sales, and customer management.
                        Now faster, smarter, and more beautiful.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login?mode=signup')}
                            className="btn btn-primary btn-lg"
                        >
                            Start Free Trial
                        </button>
                        <button className="btn btn-secondary btn-lg">
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Hero Image/Card */}
                <div className="md:w-1/2 relative animate-fade-in-up delay-200">
                    <div className="glass-card p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                        {/* Mock Dashboard UI */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Total Revenue</h3>
                                <p className="text-sm text-slate-500">This Month</p>
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">₹45,231.00</div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50/50">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        ₹
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold">New Order #{1000 + i}</h4>
                                        <p className="text-xs text-slate-500">Just now</p>
                                    </div>
                                    <div className="font-bold text-sm">+ ₹1,200</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="bg-white py-20 relative z-10">
                <div className="container mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-3xl font-bold mb-4">Why Choose BizManager?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Everything you need to run your business efficiently, packaged in a beautiful interface.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Inventory control', icon: '📦', desc: 'Track stock in real-time.' },
                            { title: 'Smart Analytics', icon: '📊', desc: 'Insights that help you grow.' },
                            { title: 'Offline Ready', icon: '⚡', desc: 'Works even without internet.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-slate-100">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
