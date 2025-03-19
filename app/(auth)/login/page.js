import {login, signup} from "@/app/(auth)/actions";

export const metadata = {
    title: "Login",
    description: "Page for Login",
};

export default function LoginPage() {
    return (
        <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email:
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password:
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex justify-between">
                <button
                    formAction={login}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Log in
                </button>
                <button
                    formAction={signup}
                    className="w-full ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                >
                    Sign up
                </button>
            </div>
        </form>
    )
}
