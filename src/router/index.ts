import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthorizationStore'
import { routeRefresh } from '@/apiHttp/AxiosConf'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/Register.vue'
import UserHomeView from '@/views/UserHome.vue'
import UsersListView from '@/views/admin/UsersListView.vue'
import UserView from '@/views/admin/SingleUserView.vue'
import CurrentUserDetails from '@/views/user&spectator/EditUserDetails.vue'
import LeaguesListView from '@/views/LeaguesListView.vue'
import SingleLeagueVue from '@/views/SingleLeague.vue'
import LeaguesGenerateViewVue from '@/views/admin/LeaguesGenerateView.vue'
import UserMatchesVue from '@/views/UserMatches.vue'
import LeagueGroupVue from '@/views/LeagueGroup.vue'
import LeaguesGroupsSummaryVue from '@/views/LeaguesGroupsSummary.vue'
import NewClubViewVue from '@/views/admin/NewClubView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/user-home',
      name: 'user-home',
      component: UserHomeView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/users-list',
      name: 'users-list',
      component: UsersListView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/my-details',
      name: 'logInDetails',
      component: CurrentUserDetails,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/leagues',
      name: 'leagues',
      component: LeaguesListView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/league',
      name: 'league',
      component: SingleLeagueVue,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/leagues/generate',
      name: 'leagues-generator',
      component: LeaguesGenerateViewVue,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/user/matches',
      name: 'user-matches',
      component: UserMatchesVue,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/league-groups',
      name: 'League Groups',
      component: LeagueGroupVue,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/league-groups-summary',
      name: 'League Groups Summary',
      component: LeaguesGroupsSummaryVue,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/clubs',
      name: 'Clubs',
      component: NewClubViewVue,
      meta: {
        requireAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if(to.matched.some(record => record.meta.requiresAuth === true)) {
    if(authStore.getIsAuthorized === true){
      next();
    }else{
      const refreshSuccesfull = await routeRefresh()
      if(refreshSuccesfull===true){
        next();
      }else{
        next({name: 'login'});
      }
    }
  } 
  else {
    next();
  }
})

export default router
