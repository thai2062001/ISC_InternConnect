import Header from "../components/Header";
import Footer from "../DefaultLayout/Footer/Footer";

function DefaultLayout({children}) {
    return ( 
        <div>
            <Header />
            <div className="container">
                <div className="content">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
     );
}

export default DefaultLayout;