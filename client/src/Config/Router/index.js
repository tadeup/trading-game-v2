import HomePage from '../../Views/HomePage';
import LoginPage from '../../Views/LoginPage';
// import NotFoundPage from '../views/NotFoundPage'

const indexRoutes = [
  //sub routes
  // { path: "/dashboard", name: "HomePage", component: HomePage },

  //main routes
  { path: "/login", name: "LoginPage", component: LoginPage },

  // home path must come last
  { path: "/", name: "HomePage", component: HomePage },
];

export default indexRoutes;
