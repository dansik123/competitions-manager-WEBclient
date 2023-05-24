<script setup lang="ts">
	import { useMutation } from "vue-query";
	import type { IRegisterRequest } from "@/types/HttpRequestTypes";
	import type { GenericResponse, GenericErrorResponse } from "@/types/HttpResponseTypes";
	import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
    import { reactive, inject } from 'vue';
	import router  from "@/router";
	import type { AxiosError } from 'axios';

	const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

    const registerInput: IRegisterRequest = reactive({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    })


	const registerFn = async (registerData: IRegisterRequest) => 
		await genericPostHttpRequestNoParams<IRegisterRequest, GenericResponse>(
			'/register', registerData);
	const { mutate } = useMutation<GenericResponse, AxiosError<GenericErrorResponse, any>, IRegisterRequest>(
		registerFn,
		{
			onError: (error)=>{
				popUpError(error.response?.data.message || 'Unknown register error', 5000)
			},
			onSuccess: (data) => {
				resetInput()
				console.log(data.message)
				router.push({ name: 'home' });
			},
		}
	)
    
	const onSubmit = () => {
		mutate({
            firstname: registerInput.firstname,
            lastname: registerInput.lastname,
            email: registerInput.email,
            password: registerInput.password,
        });
	}

	const resetInput = () =>{
        registerInput.firstname='';
        registerInput.lastname='';
		registerInput.email = '';
		registerInput.password = '';

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
								<label class="label text-grey-darken-2" for="fistName">First name</label>
								<VTextField
									v-model="registerInput.firstname"
									prepend-inner-icon="fluent:mail-24-regular"
									id="firstname"
									name="firstname"
									type="text"
								/>
							</div>
                            <div class="mt-1">
								<label class="label text-grey-darken-2" for="lastname">Last name</label>
								<VTextField
									v-model="registerInput.lastname"
									prepend-inner-icon="fluent:mail-24-regular"
									id="lastname"
									name="lastname"
									type="text"
								/>
							</div>
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="email">Email</label>
								<VTextField
									v-model="registerInput.email"
									prepend-inner-icon="fluent:mail-24-regular"
									id="email"
									name="email"
									type="email"
								/>
							</div>
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="password">Password</label>
								<VTextField
									v-model="registerInput.password"
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
					src="https://wallpaper.dog/large/5557744.jpg"
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
