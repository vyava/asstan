import { LoginLayout } from "src/layouts/Login";
import LoginForm from "src/components/loginform";

const Login = () => {
    return (
        <LoginLayout title="Login">
            <LoginForm />
        </LoginLayout>
    )
};

export default Login;