import { useSelector } from 'react-redux';

const useAuth = () => {
  const { authUser, token, isLoading } = useSelector((state) => state.auth);
  return {
    authUser,
    token,
    isLoading,
    isAuthenticated: !!authUser && !!token,
  };
};

export default useAuth;
