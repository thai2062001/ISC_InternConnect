
import Home from './../Home/Home';
import Search from '../Pages/Search/Search';
import UploadCV from '../UploadCV/Upload';
import HeaderOnly from '../Component/Layout/HeaderOnly';
import Profile from '../Profile/Profile';
import HomeAdmin from '../HomeAdmin/HomeAdmin';
import Login from '../Login/Login';
import SignOut from '../SignOut/SignOut';
import SchoolAdmin from '../SchoolAdmin/schoolAdmin';
import MajorAdmin from '../MajorAdmin/majorAdmin';
import CompanyAdmin from '../CompanyAdmin/companyAdmin';
import SlidebarOnly from './../Component/Layout/SlidebarOnly'
import SchoolManager from '../SchoolManager/schoolManager';
import SlidebarSchool from './../Component/Layout/SlidebarSchool'
import CompanyManager from '../CompanyManager/companyManager';
import SlidebarCompany from '../Component/Layout/SlidebarCompany'
import PageDetail from '../PageDetail/pageDetail';
import JobPostCreate from '../JobPostCreate/jobPostCreate';
import AccountSettings from '../SettingsAdmin/settingsAdmin';
import JobApplication from '../JobApplication_Company/jobApplication_company';
import AllJobPost from '../AllJobPost/allJobPost';
import Signup from '../SignUp/Signup';
import AdminLogin from '../AdminLogin/adminLogin';
import HomeLogin from './../HomeLogin/homeLogin';
import HeaderLogin from '../Component/Layout/components/Header/HeaderLogin/headerLogin';
import HomeJobPostDetail from '../HomeJobPostDetails/homeJobPostDetail';

//public routers


const publicRouters = [
    {path: '/',component: Home,layout:HeaderOnly},
    {path: '/:id',component: HomeJobPostDetail,layout:HeaderOnly},
    {path: '/home',component: HomeLogin,layout:HeaderLogin},
    {path: '/settings',component: AccountSettings,layout: null},
    {path: '/search',component: Search},
    {path: '/profile',component: Profile},
    {path: '/uploadcv',component: UploadCV,layout: HeaderOnly},
    {path: '/homeadmin',component: HomeAdmin,layout: SlidebarOnly},
    {path: '/login',component: Login,layout: null},
    {path: '/admin/adminlogin',component: AdminLogin,layout: null},
    {path: '/signout',component: SignOut},
    {path: '/signup',component: Signup,layout: null},
    {path: '/homeadmin/schoolAdmin',component: SchoolAdmin,layout: SlidebarOnly},
    {path: '/homeadmin/majorAdmin',component:MajorAdmin ,layout: SlidebarOnly},
    {path: '/homeadmin/companyAdmin',component:CompanyAdmin ,layout: SlidebarOnly},
    {path: '/homeadmin/jobpost',component:AllJobPost ,layout: SlidebarOnly},
    {path: '/schooladmin',component:SchoolManager ,layout: SlidebarSchool },
    {path: '/companyadmin',component:CompanyManager ,layout: SlidebarCompany },
    {path: '/companyadmin/jobapp',component:JobApplication ,layout: SlidebarCompany },
    {path: '/companyadmin/create',component:JobPostCreate ,layout: SlidebarCompany },
    {path:'/companyadmin/:id' ,component:PageDetail,layout: SlidebarCompany },

]

const privateRouters = [

]

export {publicRouters,privateRouters}


