import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginPageUI } from '../../ui/login-page';
import { useDispatch, useSelector } from '../../../services/store';
import { loginUserThunk } from '../../../slices/userSlice';

export interface LoginFormErrors {
  userLogin?: string;
  password?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch()
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginError = useSelector((state) => state.user.loginError)
  const isLoading = useSelector((state) => state.user.isLoading);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Собираем информацию и отправляем
    const username = userLogin
    const data = { username, password }
    dispatch(loginUserThunk(data))
  };
  
  // Если все успешно, то перенаправляем
  if (isAuthenticated) {
    return <Navigate
      to={'/'} />
  }
  
  return (
    <LoginPageUI
      handleSubmit={handleSubmit}
      loginError={loginError}
      login={userLogin}
      setLogin={setUserLogin}
      showPassword={showPassword}
      password={password}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
    />
  );
};