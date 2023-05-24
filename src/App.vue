<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, provide } from "vue"
import Toast from './components/Toast.vue';
import { useAuthStore } from './stores/AuthorizationStore';
import { AdminLoginUserNav, nonLogInUserNav, SpectatorLoginUserNav, UserLoginUserNav } from './components/NavLinks';
import LogoutBtn from "@/components/LogoutButton.vue";

const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const drawer = ref<boolean>(false)
const navListAdmin = ref(AdminLoginUserNav)
const navListSpectator= ref(SpectatorLoginUserNav)
const navListUser = ref(UserLoginUserNav)
const navListOthers = ref(nonLogInUserNav)


function showNotyficationToast(
  message: string, color: string, icon: string, timeout: number) {
  toastRef.value?.showToast(message, color, icon, timeout);
}

provide(
  "okayToastPopUp", 
  (msg: string, timeout: number) => 
    showNotyficationToast(msg, 'success','mdi-check-circle', timeout)
)

provide(
  "errorToastPopUp", 
  (msg: string, timeout: number) => 
    showNotyficationToast(msg, 'error', 'mdi-close-circle', timeout)
)

provide(
  "warningToastPopUp", 
  (msg: string, timeout: number) => 
    showNotyficationToast(msg, 'warning', 'mdi-alert-circle', timeout)
)

const authStore = useAuthStore();
</script>

<template>
  <VApp id="inspire">
    <VNavigationDrawer app v-model="drawer">
        <VList nav v-if="authStore.isLoginUserAdmin" >
          <RouterLink
            v-for="item, index in navListAdmin" :key="index" :to="item.path">
            <VListItem :prepend-icon="item.icon"
              :title="item.title" :value="item.path">
            </VListItem>
          </RouterLink>
        </VList>
        <VList nav v-else-if="authStore.isLoginUserSpectator" >
          <RouterLink
            v-for="item, index in navListSpectator" :key="index" :to="item.path">
            <VListItem :prepend-icon="item.icon"
              :title="item.title" :value="item.path">
            </VListItem>
          </RouterLink>
        </VList>
        <VList nav v-else-if="authStore.isLoginUser"  >
          <RouterLink
            v-for="item, index in navListUser" :key="index" :to="item.path">
            <VListItem :prepend-icon="item.icon"
              :title="item.title" :value="item.path">
            </VListItem>
          </RouterLink>
        </VList>
        <VList nav v-else >
          <RouterLink
            v-for="item, index in navListOthers" :key="index" :to="item.path">
            <VListItem :prepend-icon="item.icon"
              :title="item.title" :value="item.path">
            </VListItem>
          </RouterLink>
        </VList>

        <template v-slot:append v-if="authStore.isAuthorized">
          <div class="pa-2">
            <LogoutBtn></LogoutBtn>
          </div>
        </template>
    </VNavigationDrawer>

    <VAppBar>
      <VAppBarNavIcon @click="drawer = !drawer" id="menuIconId"></VAppBarNavIcon>
      <VToolbarTitle>Application</VToolbarTitle>
      
    </VAppBar>

    <VMain>
      <VContainer>
        <RouterView />
        <Toast ref="toastRef" :color="'red-lighten-1'" 
          :message="'hello'" :icon="'mdi-check-circle'"/>
      </VContainer>
    </VMain>
  </VApp>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
