import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc'

interface Props {
    cbFunc: any
}


export const GoogleLoginBtn = ({ cbFunc }: Props) => {

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
            );
            const googleUser = {
                username: userInfo.data.given_name,
                fullName: userInfo.data.name,
                password: userInfo.data.sub,
                email: userInfo.data.email
            }
            cbFunc(googleUser)
        },
        onError: errorResponse => console.log(errorResponse),
    })

    return (
        <button className="google-login-btn flex align-center" onClick={() => googleLogin()}>
            <h3>Continue with GOOGLE </h3>
            <span><FcGoogle /></span>
        </button>
    )
}