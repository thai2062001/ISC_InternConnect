
import SlidebarCompanyAdmin  from '../DefaultLayout/SlidebarCompanyAdmin'
function DefaultLayout({children}) {
    return ( 
        <div>
            <div className="container">
            <SlidebarCompanyAdmin/>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
     );
}

export default DefaultLayout;