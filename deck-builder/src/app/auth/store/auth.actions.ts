import { createAction, props } from '@ngrx/store';
import { Registration } from 'src/app/shared/models/registration.model';
import { User } from 'src/app/shared/models/user.model';

export const registrationStart = createAction('[Auth] Sign up start', props<{ registration: Registration }>());
export const registrationFail = createAction('[Auth] Sign up fail', props<{ message: string }>());
export const registrationSuccess = createAction('[Auth] Sign up success', props<{ user: User, redirect: boolean }>());
export const autoLogin = createAction('[Auth] Auto login');
export const logout = createAction('[Auth] Logout');
