import TradePage from '../../Views/TradePage';
import LoginPage from '../../Views/LoginPage';
// import NotFoundPage from '../views/NotFoundPage'

const indexRoutes = [
  //sub routes
  // { path: "/dashboard", name: "HomePage", component: HomePage },

  //main routes
  { path: "/login", name: "LoginPage", component: LoginPage },

  // home path must come last
  { path: "/", name: "TradePage", component: TradePage },
];

export default indexRoutes;
