import { isAxiosError } from "axios";
import api from "../config/axios";
import { LoginForm, userSchema } from "../types";

export async function login(formData: LoginForm) {
    try {
        const { data } = await api.post<string>('/auth/login', formData);
        localStorage.setItem('AUTH_TOKEN', data);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api('/auth/me');
        const response = userSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw Error(error.response.data.message);
        }
    }
}