import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import AuthService from "../../services/auth";
import EmailPasswordForm from "./EmailPasswordForm";

const LoginForm = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string(),
      })}
      onSubmit={async ({ email, password }, { setSubmitting, setErrors }) => {
        try {
          let result = await AuthService.login({
            email,
            password,
          });

          console.log("result : " + JSON.stringify(result))
          // LOGIN FETCH
          // localStorage.setItem("user", result);
          setSubmitting(false);
          router.push("/");
        } catch (error) {
          setSubmitting(false);
        }
      }}
    >
      {(formik) => <EmailPasswordForm formik={formik} />}
    </Formik>
  );
};

export default LoginForm;