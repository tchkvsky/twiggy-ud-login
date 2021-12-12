import UAuth from '@uauth/js'
import React, {useEffect, useState} from 'react'

const uauth = new UAuth({
  // These can be copied from the bottom of your app's configuration page on unstoppabledomains.com.
  clientID: process.env.REACT_APP_CLIENT_ID!,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET!,

  // These are the scopes your app is requesting from the ud server.
  scope: 'openid email wallet',

  // This is the url that the auth server will redirect back to after every authorization attempt.
  redirectUri: process.env.REACT_APP_REDIRECT_URI!,

  // OPTIONAL: This is the url that the auth server will redirect back to after
  // logging out. If not included, as in this example, the authorization is just
  // removed from the cache when uauth.logout is called.
  // postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
})

const Unstoppable: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [user, setUser] = useState<any>()

  // Check to see if the user is inside the cache
  useEffect(() => {
    setLoading(true)
    uauth
      .user()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Login with a popup and save the user
  const handleLogin = () => {
    setLoading(true)
    uauth
      .loginWithPopup()
      .then(() => uauth.user().then(setUser))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  // Logout and delete user
  const handleLogout = () => {
    setLoading(true)
    uauth
      .logout()
      .then(() => setUser(undefined))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    console.error(error)
    return <>{String(error.stack)}</>
  }

  if (user) {
    return (
      <>
        <button 
          className="rounded-lg bg-blue-400 float-right py-3 px-6 ring-2 transition ease-in-out duration-700 transform hover:-translate-y-1 hover:scale-110 m-3 inline-flex items-center bg-gradient-to-r hover:from-white hover:to-blue-500" 
          onClick={handleLogout}>
          <img className="h-6 w-6 mx-2" src="https://gitcoin.co/dynamic/avatar/unstoppabledomains" alt="Login with Unstoppable" />
          <span>Logout</span>
        </button>
      </>
    )
  }

  return <button 
            className="rounded-lg bg-blue-400 float-right py-3 px-6 ring-2 transition ease-in-out duration-700 transform hover:-translate-y-1 hover:scale-110 m-3 inline-flex items-center bg-gradient-to-r hover:from-white hover:to-blue-500"
            onClick={handleLogin}>
            <img className="h-6 w-6 mx-2" src="https://gitcoin.co/dynamic/avatar/unstoppabledomains" alt="Login with Unstoppable" />
            <span>Login with Unstoppable</span>

          </button>
}

export default Unstoppable