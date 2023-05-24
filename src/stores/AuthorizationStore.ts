import { defineStore } from "pinia";
import type { IHeadersState } from "@/types/StoreTypes";

export const useAuthStore = defineStore({
    id: "authStore",
    state: (): IHeadersState =>({
      authToken: '',
      userId: -1,
      userRole: '',
      isAuthorized: false
    }),
    getters:{
      getAuthToken: (state): string => state.authToken,
      getIsAuthorized: (state): boolean => state.isAuthorized,
      getUserRole: (state): string => state.userRole,
      getCurrentUserId: (state): number => state.userId,
      isLoginUserAdmin: (state): boolean => state.userRole === 'ADMIN',
      isLoginUserSpectator: (state): boolean => state.userRole === 'SPECTATOR',
      isLoginUser: (state): boolean => state.userRole === 'USER',
      hasAuthorizedDetails: (state): boolean => state.userId != -1 && state.userRole != ''
    },
    actions: {
      setUserDetails(userId: number, userRole: string){
        this.userId = userId;
        this.userRole = userRole;
      },
      setHeaderAccessTokenKey(token: string){
        this.authToken = token
        this.isAuthorized = true
      },
      logout(){
        this.authToken = '';
        this.userId = -1;
        this.userRole = '';
        this.isAuthorized = false;
      },
    },
});