
import Home from './../Home/Home';
import Search from '../Pages/Search/Search';
import UploadCV from '../UploadCV/Upload';
import HeaderOnly from '../Component/Layout/HeaderOnly';
import Profile from '../Profile/Profile';
import HomeAdmin from '../HomeAdmin/HomeAdmin';
import Login from '../Login/Login';

//public routers
const publicRouters = [
    {path: '/',component: Home},
    {path: '/search',component: Search},
    {path: '/profile',component: Profile},
    {path: '/uploadcv',component: UploadCV,layout: HeaderOnly},
    {path: '/homeadmin',component: HomeAdmin,layout:null},
    {path: '/login',component: Login,layout: HeaderOnly},

]

const privateRouters = [

]

export {publicRouters,privateRouters}