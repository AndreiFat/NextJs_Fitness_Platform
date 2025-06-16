import React from 'react';

function LogoutButton(props) {
    return (
        <form action="/api/auth/logout" method={"post"} className={"p-2 flex justify-center w-full"}>
            <button type={"submit"} className="btn btn-error w-full">Deconectare</button>
        </form>
    );
}

export default LogoutButton;