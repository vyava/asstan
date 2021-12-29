import { NextPage } from 'next'
import MainLayout from "src/layouts/Main";

const HomePage: NextPage = () : JSX.Element => {
  return (
    <MainLayout title="Bayiler">
      <h1>Home Page</h1>
    </MainLayout>
  );
};

export default HomePage;