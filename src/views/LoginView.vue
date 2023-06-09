<script setup lang="ts">
import router from '@/router';
import { reactive, inject } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import type { ILoginRequest } from '@/types/HttpRequestTypes';
import type { ITokenResponse, GenericErrorResponse } from '@/types/HttpResponseTypes';
import { useAuthStore } from '@/stores/AuthorizationStore';
import { genericPostHttpRequest } from '@/apiHttp/RequestsApi'
import type { AxiosResponse } from 'axios'
const authStore = useAuthStore();

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const loginFn = async (credentials: ILoginRequest) => 
	await genericPostHttpRequest<ILoginRequest, ITokenResponse>(
		'/login', credentials, 
		{ client: 'browser'}
	)
const { mutate } = useMutation<ITokenResponse,AxiosResponse<GenericErrorResponse, any>, ILoginRequest>(
	loginFn,
	{
		onError: (error)=>{
			popUpError(error.data.message || 'Unknown login error', 5000)
		},
		onSuccess: (data) => {
			authStore.setHeaderAccessTokenKey(data.accessToken);
			router.push({ name: 'user-home' });
		},
	}
)

const onSubmit = () => {
	mutate({email: loginInput.email, password: loginInput.password});
	resetInput()
}

const loginInput: ILoginRequest = reactive({
	email: '',
	password: ''
})


const resetInput = () =>{
	loginInput.email = '';
	loginInput.password = '';
}
</script>

<template>
	<VContainer fluid class="fill-height">
		<VRow no-gutters align="center" justify="center" class="fill-height">
			<VCol cols="12" md="6" lg="5" sm="6">
				<VRow no-gutters align="center" justify="center">
					<VCol cols="12" md="6">
						<h1>Sign In</h1>
						<p class="text-medium-emphasis">Enter your details to get started</p>

						<VForm @submit.prevent="onSubmit()" class="mt-7">
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="email">Email</label>
								<VTextField
									v-model="loginInput.email"
									prepend-inner-icon="fluent:mail-24-regular"
									id="email"
									name="email"
									type="email"
								/>
							</div>
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="password">Password</label>
								<VTextField
									v-model="loginInput.password"
									prepend-inner-icon="fluent:password-20-regular"
									id="password"
									name="password"
									type="password"
								/>
							</div>
							<div class="mt-5">
								<VBtn type="submit" block min-height="44" class="gradient primary">Sign In</VBtn>
							</div>
						</VForm>
					</VCol>
				</VRow>
			</VCol>
			<VCol class="hidden-md-and-down fill-height" md="6" lg="7">
				<VImg
					:src="'/Vincent_Hancock_at_2008_Wikipedia.jpg'"
					cover
					class="h-100 rounded-xl d-flex align-center justify-center"
				>
					<div class="text-center w-50 text-white mx-auto">
						<h2 class="mb-4">Start your journey today</h2>
						<p>
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, inventore quia.
							Dolorum dolores ad ipsum voluptatum rem, hic placeat, odio, odit numquam quod
							veritatis accusantium assumenda! Sequi, provident in! Iure!
						</p>
					</div>
				</VImg>
			</VCol>
		</VRow>
	</VContainer>
</template>
