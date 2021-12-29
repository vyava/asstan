import { Formik, useFormikContext } from "formik";

let { values, submitForm, setFieldValue } = useFormikContext();

const CustomForm = ({target} : any) => {

    const handleSubmit = (form : any) => {
        console.log(form);
    }
    
    return (
        <Formik initialValues={{}} onSubmit={handleSubmit}></Formik>
    )
};

export { submitForm, setFieldValue };
export default CustomForm;