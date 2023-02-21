
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

//public routers
const publicRouters = [
    {path: '/',component: Home},
    {path: '/search',component: Search},
    {path: '/profile',component: Profile},
    {path: '/uploadcv',component: UploadCV,layout: HeaderOnly},
    {path: '/homeadmin',component: HomeAdmin},
    {path: '/login',component: Login,layout: null},
    {path: '/signout',component: SignOut},
    {path: '/homeadmin/schoolAdmin',component: SchoolAdmin},
    {path: '/homeadmin/majorAdmin',component:MajorAdmin },
    {path: '/homeadmin/companyAdmin',component:CompanyAdmin },,


]

const privateRouters = [

]

export {publicRouters,privateRouters}