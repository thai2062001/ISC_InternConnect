


function SchoolManager() {
    function handleLogOutUser(){
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }
    return ( 
                <div>
                    <h1>School Manageer page</h1>
                    <button onClick={handleLogOutUser}> Sign Out</button>
                </div>
     );
}

export default SchoolManager;