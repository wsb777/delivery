import { useEffect, type FC} from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/login-page'
import { ReportPage } from '../pages/report-page/report-page'
import { ProtectedRoute } from '../protected-route/protected-route'
import { useDispatch } from '../../services/store'
import { authThunk } from '../../slices/userSlice'

export const App:FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authThunk())
  },[])

  return (
      <Routes>
        <Route path='/login' element={<ProtectedRoute onlyUnAuth><LoginPage/></ProtectedRoute>}/>
        <Route path='/' element={<ProtectedRoute><ReportPage/></ProtectedRoute>}/>
      </Routes>
  )
}