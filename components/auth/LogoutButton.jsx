import React from 'react';

function LogoutButton(props) {
    return (
        <form action="/api/auth/logout" method={"post"}>
            <button type={"submit"} className={'btn'}>Logout</button>
        </form>
    );
}

export default LogoutButton;