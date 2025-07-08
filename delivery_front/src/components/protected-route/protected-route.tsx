import { useSelector } from '../../services/store';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement; // Дочерний элемент, который нужно защитить
  onlyUnAuth?: boolean; // Флаг, указывающий что маршрут только для НЕавторизованных
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Если статус аутентификации еще не проверен, показываем заглушку загрузки
  if (!isAuthChecked) {
    return <div>Загрузка</div>;
  }

  // Если маршрут только для неавторизованных, но пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    // Получаем путь, откуда пришел пользователь, или корневой путь
    const from = location.state?.from || { pathname: '/' };

    // Перенаправляем пользователя на предыдущую страницу
    return <Navigate replace to={from} />;
  }

  // Если маршрут для авторизованных, но пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  // Если все проверки пройдены, рендерим дочерний элемент
  return children;
};