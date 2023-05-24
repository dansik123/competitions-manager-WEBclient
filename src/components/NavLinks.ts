
export const adminLinks = [
    {
        icon: 'mdi-view-dashboard',
        title: 'Home',
        path: '/'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'About',
        path: '/about'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Login',
        path: '/login'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Register',
        path: '/register'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'User home',
        path: '/user-home'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'User list',
        path: '/users-list'
    }   
]

const authPagesLinks = [
    {
        icon: 'mdi-view-dashboard',
        title: 'Login',
        path: '/login'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Register',
        path: '/register'
    }
]

export const nonLoginUserLinks = [
    {
        icon: 'mdi-view-dashboard',
        title: 'Home',
        path: '/'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'About',
        path: '/about'
    }
]

const anyLoginUserNavLinks = [
    {
        icon: 'mdi-view-dashboard',
        title: 'User home',
        path: '/user-home'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'User details',
        path: '/my-details'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Leagues',
        path: '/leagues'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'League groups',
        path: '/league-groups'
    },   
    {
        icon: 'mdi-view-dashboard',
        title: 'My Matches',
        path: '/user/matches'
    }
]

const onlyAdminUserNavLinks = [
    {
        icon: 'mdi-view-dashboard',
        title: 'User list',
        path: '/users-list'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Leagues generator',
        path: '/leagues/generate'
    },
    {
        icon: 'mdi-view-dashboard',
        title: 'Clubs',
        path: '/clubs'
    }
]

export const nonLogInUserNav = [
    ...nonLoginUserLinks,
    ...authPagesLinks
]

export const AdminLoginUserNav = [
    ...nonLoginUserLinks, 
    ...onlyAdminUserNavLinks, 
    ...anyLoginUserNavLinks
]

export const UserLoginUserNav = [
    ...nonLoginUserLinks, 
    ...anyLoginUserNavLinks
]

export const SpectatorLoginUserNav = [
    ...nonLoginUserLinks, 
    ...anyLoginUserNavLinks
]
