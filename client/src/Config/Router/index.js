import HomePage from '../../Views/HomePage';
import LoginPage from '../../Views/LoginPage';
import AdminPage from '../../Views/AdminPage';
// import NotFoundPage from '../views/NotFoundPage'

const indexRoutes = [
  //sub routes
  // { path: "/dashboard", name: "HomePage", component: HomePage },

  //main routes
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/admin", name: "AdminPage", component: AdminPage },

  // home path must come last
  { path: "/trade", name: "HomePage", component: HomePage },
];

export default indexRoutes;
