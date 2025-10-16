import { useSessionStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';

export default function App() {

   const [loggedIn] = useSessionStorage('loggedIn', undefined);

   const navigate = useNavigate();

   const checkLoggedIn = () => {

      if (loggedIn) {

         navigate('/loggedin', { replace: true });

      } else {

         navigate('/login', { replace: true });

      }

   }

   useEffect(() => { checkLoggedIn() }, [navigate, loggedIn])

   return (<></>)

}