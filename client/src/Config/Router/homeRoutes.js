// import SettingsPage from '../views/SettingsPage'
import ProfilePage from '../../Views/ProfilePage'
import TradePage from '../../Views/TradePage'

const homeRoutes = [
  // { path: '/settings', name: 'SettingsPage', component: SettingsPage},
  { path: '/profile', name: 'ProfilePage', component: ProfilePage},

  // home path must come last
  { path: "/",name: 'TradePage', component: TradePage },
];

export default homeRoutes;
