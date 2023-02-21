
import Slidebar from "../DefaultLayout/Slidebar";


function DefaultLayout({children}) {
    return ( 
        <div>
            <div className="container">
            <Slidebar/>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
     );
}

export default DefaultLayout;