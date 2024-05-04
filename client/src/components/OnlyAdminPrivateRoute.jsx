import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.accountType!="Student" ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}