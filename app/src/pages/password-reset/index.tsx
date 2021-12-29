import { LoginLayout } from "src/layouts/Login";
import ForgotForm from "src/components/forgotForm";

const ForgotPassword = () => {
    return (
        <LoginLayout title="Şifremi unuttum">
            <ForgotForm />
        </LoginLayout>
    )
};

export default ForgotPassword;