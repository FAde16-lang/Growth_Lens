import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        industry: 'retail'
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const finishOnboarding = () => {
        // Save onboarding status if needed
        localStorage.setItem('onboarding_complete', 'true');
        navigate('/dashboard');
    };

    const Steps = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold mb-4">Welcome to BizManager! 👋</h2>
                        <p className="text-slate-600 mb-8">Let's get your workspace ready. It will only take a minute.</p>
                        <button onClick={nextStep} className="btn btn-primary w-full">Let's Go</button>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6">What's your business called?</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 text-slate-700">Business Name</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                placeholder="e.g. Gupta General Store"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={prevStep} className="btn btn-secondary flex-1">Back</button>
                            <button onClick={nextStep} disabled={!formData.businessName} className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                🎉
                            </div>
                            <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                            <p className="text-slate-600">Your dashboard is ready for action.</p>
                        </div>
                        <button onClick={finishOnboarding} className="btn btn-primary w-full shadow-glow">
                            Go to Dashboard
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="glass-card p-8 md:p-12 w-full max-w-lg relative z-10">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                    ))}
                </div>

                <Steps />
            </div>
        </div>
    );
};

export default Onboarding;
