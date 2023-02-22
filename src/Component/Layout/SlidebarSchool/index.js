
import SlidebarSchoolAdmin from "../DefaultLayout/SlidebarSchoolAdmin";


function DefaultLayout({children}) {
    return ( 
        <div>
            <div className="container">
            <SlidebarSchoolAdmin/>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
     );
}

export default DefaultLayout;