import AdminAssetsPage from '../../Views/AdminAssetsPage'
import AdminUsersPage from '../../Views/AdminUsersPage'

const adminRoutes = [
    { path: '/users', name: 'AdminUsersPage', component: AdminUsersPage},

    // home path must come last
    { path: "/",name: 'AdminAssetsPage', component: AdminAssetsPage },
];

export default adminRoutes;
