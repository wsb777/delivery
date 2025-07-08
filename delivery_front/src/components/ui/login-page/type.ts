import type { Dispatch, SetStateAction } from "react"

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface LoginPageUIProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loginError: string;
    login: string;
    setLogin: SetState<string>;
    showPassword: boolean;
    password: string;
    setPassword: SetState<string>;
    setShowPassword: SetState<boolean>;
    isLoading: boolean;
  }