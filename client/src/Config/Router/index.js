import HomePage from '../../Views/HomePage';
import LoginPage from '../../Views/LoginPage';
import AdminPage from '../../Views/AdminPage';
import NotFoundPage from '../../Views/NotFoundPage'

const indexRoutes = [
  //sub routes
  // { path: "/dashboard", name: "HomePage", component: HomePage },

  //main routes
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/admin", name: "AdminPage", component: AdminPage },
  { path: "/trade", name: "HomePage", component: HomePage },

  // home path must come last
  { path: "/", name: "NotFoundPage", component: NotFoundPage },
];

export default indexRoutes;
