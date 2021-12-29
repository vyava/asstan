import Link from "next/link";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./forgot.module.scss";
import { resetFetcher } from "src/fetchers/auth";
import cls from "classnames";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Uygun bir mail adresi giriniz")
        .required("Mail adresi gereklidir")
});

const initialValues = {
    email: ''
};


const ForgotForm = () => {

    let [link, setLink] = useState('');

    const onSubmit = async (values : any) => {
        let result = await resetFetcher({email : values.email})
        setLink(result)
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    dirty
                } = formik;
                return (
                    <section className={styles.root}>
                        <div className={styles.left}></div>
                        <div className={styles.right}>
                            <div className={styles.box}>
                                <h1>Şifrenizi sıfırlayın</h1>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className={styles.email_container}>
                                            <input name="email" placeholder="Mail adresiniz" value={values.email} onChange={handleChange} onBlur={handleBlur} type="email" className={cls(styles.input, styles.email_input)} />
                                        </div>
                                        <p>{JSON.stringify(errors.email)}</p>
                                        {/* <div className={styles.password_container}>
                                    <CustomField name="password" type="password" label="Şifre" className={cls(styles.input, styles.password_input)} />
                                </div> */}
                                        <Link href="map"><a>GİT</a></Link>
                                        <div className={cls(styles.submit_container)}>
                                            <button type="submit" disabled={!isValid} className={cls(styles.login_button)}>Gönder</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                )
            }}
        </Formik>

    )
};

export default ForgotForm;