


function SignOut() {



    function handleLogOutUser(){
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }
    return ( 
                <div>
                    <button onClick={handleLogOutUser}> Sign Out</button>
                </div>
     );
}

export default SignOut;