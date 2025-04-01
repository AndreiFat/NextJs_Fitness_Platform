import React from 'react';

function LogoutButton(props) {
    return (
        <form action="/api/auth/logout" method={"post"} className={"p-2 flex justify-center"}>
            <button type={"submit"} className="btn btn-error w-50">Logout</button>
        </form>
    );
}

export default LogoutButton;