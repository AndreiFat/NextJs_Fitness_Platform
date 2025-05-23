import React from 'react';
import FooterComponent from "@/components/layout/FooterComponent";

function Homepage() {
    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello there</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
            {/*<div className="container mx-auto">*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">*/}
            {/*        <div className="bg-accent text-center rounded p-2">01</div>*/}
            {/*        <div className="bg-accent text-center rounded p-2">02</div>*/}
            {/*        <div className="bg-accent text-center rounded p-2">03</div>*/}
            {/*        <div className="col-span-2 bg-accent text-center rounded p-2">04</div>*/}
            {/*        <div className="bg-accent text-center rounded p-2">05</div>*/}
            {/*        <div className="bg-accent text-center rounded p-2">06</div>*/}
            {/*        <div className="col-span-2 bg-accent text-center rounded p-2">07</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <FooterComponent></FooterComponent>
        </div>
    );
}

export default Homepage;