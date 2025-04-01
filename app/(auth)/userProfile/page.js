import {sendPasswordReset} from "@/app/(auth)/actions";
import EmailInput from "@/components/auth/forms/EmailInput";

export const metadata = {
    title: "User Profile Page",
    description: "Page for User Profile Page",
};

export default function UserProfilePage() {
    return (
        <>
            <h1>User Profile Page</h1>
            <p>This is the User Profile Page page.</p>
            <div className={"flex justify-center p-4"}>
                <div className="w-full grid grid-cols-4 gap-4">
                    <form action={sendPasswordReset}>
                        <EmailInput/>
                        <button type={"submit"} className={"btn btn-soft btn-accent mt-3"}>Reset Password</button>
                    </form>
                </div>
            </div>
        </>
    );
}