import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useApi from '../services/api';

const Logout = () => {
  const api = useApi();
  const history = useHistory();

  useEffect(() => {
    const doLogout = async () => {
      await api.logout();
      history.push('/login');
    }
    doLogout();
  // eslint-disable-next-line
  }, []);
  return null;
}
export default Logout;