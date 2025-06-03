import React from 'react';
import FooterComponent from "@/components/layout/FooterComponent";

function Homepage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero min-h-screen bg-gradient-to-br from-primary/50 to-secondary/50 text-white">
                <div className="hero-content text-center flex-col">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-extrabold mb-4">Your AI-Powered Fitness Marketplace</h1>
                        <p className="text-lg mb-6">
                            Discover top-tier fitness products, manage your health goals, and get personalized AI
                            coaching—all in one place.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button className="btn btn-accent px-6">Explore Products</button>
                            <button className="btn btn-outline px-6">Try AI Coach</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-primary">What You Can Do Here</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">🏋️ Fitness Products</h3>
                            <p className="text-base-content/70">
                                Shop from a curated selection of supplements, equipment, and fitness gear trusted by
                                pros.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">📈 Fitness Management</h3>
                            <p className="text-base-content/70">
                                Track your goals, meals, and workouts with easy-to-use tools and dashboards built for
                                results.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">🤖 AI Integration</h3>
                            <p className="text-base-content/70">
                                Get personalized meal plans, workout suggestions, and progress insights powered by AI.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-base-200 py-16">
                <div className="text-center max-w-xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to transform your fitness journey?</h2>
                    <p className="text-base-content/70 mb-6">
                        Sign up now and let our AI-driven platform guide you every step of the way.
                    </p>
                    <button className="btn btn-primary px-8">Get Started Now</button>
                </div>
            </section>

            <FooterComponent/>
        </div>
    );
}

export default Homepage;