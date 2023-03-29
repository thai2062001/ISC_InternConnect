
import Home from './../Home/Home';
import Search from '../Pages/Search/Search';
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
import Settings from '../Settings/settings';
import ForgotPW from '../Login/ForgotPW/forgotPW';
import AuForgot from '../Login/ForgotPW/AuForgot/auForgot';
import VerifyAccount from '../SignUp/VerifyAccount/verify';
import SkillAdmin from '../Skill_Admin/skillAdmin';
import CreateCV from '../CreateCV/createCV';
import StatusCV from '../Home/StatusCV/statusCV';
import Favorite_JobApp from '../Home/Favorite_JobApp/favorite_JobApp';
import IntroduceCompany from '../CompanyManager/IntroduceCompany/introduceCompany';
import SchoolUpdate from '../SchoolManager/schoolUpdate/schoolUpdate';
import TermOfServices from '../TermofServices/termofservice';
import Company from '../Home/Company/company';
import DetailCompany from '../Home/DetailCompany/detailCompany';
//public routers


const publicRouters = [
    {path: '/',component: Home,layout:HeaderOnly},
    {path: '/:id',component: HomeJobPostDetail,layout:HeaderOnly},

    {path: '/listcompany',component: Company,layout:HeaderOnly},
    {path: '/listcompany/:id',component: DetailCompany,layout:HeaderOnly},

    {path: '/accountSettings',component: Settings,layout:HeaderOnly},
    {path: '/services',component: TermOfServices,layout:HeaderOnly},
    {path: '/statuscv',component: StatusCV,layout:HeaderOnly},
    {path: '/favorite_jobapp',component: Favorite_JobApp,layout:HeaderOnly},
    // {path: '/home',component: HomeLogin,layout:HeaderLogin},
    {path: '/settings',component: AccountSettings,layout: null},
    {path: '/createcv',component: CreateCV,layout: null},
    {path: '/search',component: Search},
    {path: '/profile',component: Profile},
    {path: '/login',component: Login,layout: null},
    {path: '/auth/forgot-password/',component: ForgotPW,layout: null},
    {path: '/auth/forgot-password/:email',component:AuForgot ,layout: null},
    {path: '/admin/adminlogin',component: AdminLogin,layout: null},
    {path: '/signout',component: SignOut},
    {path: '/signup',component: Signup,layout: null},
    {path: '/auth/confirm/:mailsend',component: VerifyAccount,layout: null},
    {path: '/homeadmin',component: HomeAdmin,layout: SlidebarOnly},
    {path: '/homeadmin/schoolAdmin',component: SchoolAdmin,layout: SlidebarOnly},
    {path: '/homeadmin/majorAdmin',component:MajorAdmin ,layout: SlidebarOnly},
    {path: '/homeadmin/companyAdmin',component:CompanyAdmin ,layout: SlidebarOnly},
    {path: '/homeadmin/jobpost',component:AllJobPost ,layout: SlidebarOnly},
    {path: '/homeadmin/skill',component:SkillAdmin ,layout: SlidebarOnly},
    {path: '/schooladmin',component:SchoolManager ,layout: SlidebarSchool },
    {path: '/schooladmin/updateinfo',component:SchoolUpdate ,layout: SlidebarSchool },
    {path: '/companyadmin',component:CompanyManager ,layout: SlidebarCompany },
    {path: '/companyadmin/companyinfo',component:IntroduceCompany ,layout: SlidebarCompany },
    {path: '/companyadmin/jobapp',component:JobApplication ,layout: SlidebarCompany },
    {path: '/companyadmin/create',component:JobPostCreate ,layout: SlidebarCompany },
    {path:'/companyadmin/:id' ,component:PageDetail,layout: SlidebarCompany },

]

const privateRouters = [

]

export {publicRouters,privateRouters}


