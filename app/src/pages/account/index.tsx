import { MainLayout } from "src/layouts/Main";

import { useQuery, useMutation } from "react-query";
import { useFormik } from "formik";
import { meFetcher, updateMeFetcher } from "src/fetchers/auth";

const Profile = () => {

    const {data} = useQuery('meFetch', meFetcher);

    const mutation = useMutation(data => {
        return updateMeFetcher(data)
    })

    const { handleSubmit, handleChange, values } = useFormik({
        initialValues: {
            name : data?.name,
            email : data?.email?.address,
            distributor : data?.distributor

        },
        onSubmit: values => {
            console.log(values);
            // @ts-ignore
            mutation.mutate(values)
        }
    });

    return (
        <MainLayout title="Hesap Ayarları">
            <h1>Profile Page</h1>
            <form onSubmit={handleSubmit}>
                <div className="lg:col-span-2 w-1/2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                            <label htmlFor="full_name">İsim Soyisim</label>
                            <input type="text" name="name" onChange={handleChange('name')} value={values.name} id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                        </div>

                        <div className="md:col-span-5">
                            <label htmlFor="email">Email Adres</label>
                            <input type="text" name="email" disabled onChange={handleChange} value={values.email} id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@domain.com" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="country">Distribütör</label>
                            <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                <select className="form-select block w-full mt-1" onChange={handleChange} name="distributor">
                                    <option selected>{values.distributor}</option>
                                    <option>Option 2</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-5 text-right">
                            <div className="inline-flex items-end">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Kaydet</button>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </MainLayout>
    );
};

Profile.title = "Profil"

export default Profile;