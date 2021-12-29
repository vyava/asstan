import Link from "next/link";
import { ErrorMessage, Field, Form } from "formik";
import styles from "./login.module.scss";
import cls from "classnames";

export const CustomField = ({ name, label, type, className }: any) => (
    <>
        <label className={styles.label} htmlFor={name}>{label}</label>
        <Field
            name={name}
            type={type}
            className={className}
        />
        <ErrorMessage name={name} className="text-danger" component="p" />
    </>
);

const EmailPasswordForm = ({ formik }: any) => {
    return (
        <section className={styles.root}>
            <div className={styles.left}></div>
            <div className={styles.right}>
                <div className={styles.box}>
                    <h1>Giriş Yapın</h1>
                    <div>
                        <Form>
                            <div className={styles.email_container}>
                                <CustomField name="email" type="email" label="Mail adresiniz" className={cls(styles.input, styles.email_input)} />
                            </div>
                            <div className={styles.password_container}>
                                <CustomField name="password" type="password" label="Şifre" className={cls(styles.input, styles.password_input)} />
                            </div>
                            <div className={cls(styles.submit_container)}>
                                <button disabled={formik.isSubmitting} type="submit" className={cls(styles.login_button)}>Giriş</button>
                            </div>
                        </Form>
                        <div className="mt-12 text-sm font-display font-semibold text-primary-400 text-center">
                            <Link href="password-reset">
                                <a className={styles.small_link}>Şifremi unuttum</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EmailPasswordForm;