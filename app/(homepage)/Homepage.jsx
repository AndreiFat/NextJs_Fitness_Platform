import React from 'react';
import UserInfo from "@/components/auth/UserInfo";
import Link from "next/link";

function Homepage() {
    return (
        <div>
            <UserInfo/>
            {/*<div className="@container">*/}
            {/*    <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">*/}
            {/*        <div className="bg-accent text-center rounded py-2">01</div>*/}
            {/*        <div className="bg-accent text-center rounded py-2">02</div>*/}
            {/*        <div className="bg-accent text-center rounded py-2">03</div>*/}
            {/*        <div className="col-span-2 bg-accent text-center rounded py-2">04</div>*/}
            {/*        <div className="bg-accent text-center rounded py-2">05</div>*/}
            {/*        <div className="bg-accent text-center rounded py-2">06</div>*/}
            {/*        <div className="col-span-2 bg-accent text-center rounded py-2">07</div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <button className="btn btn-primary"><Link href={"/accountSettings"}>Edit your account</Link></button>
        </div>
    );
}

export default Homepage;