'use client'

import {signInWithGoogle} from "@/app/(auth)/actions";

function LoginWithGoogleButton(props) {
    return (
        <button
            onClick={() => {
                signInWithGoogle()
            }}
            className="px-4 py-2 my-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
        >
            Sign in with Google
        </button>
    );
}

export default LoginWithGoogleButton;