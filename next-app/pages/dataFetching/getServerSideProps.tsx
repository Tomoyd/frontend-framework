import { GetServerSideProps } from 'next';
interface GetServerSidePropsPageProps {
  name: string;
}
const GetServerSidePropsPage = ({ name }: GetServerSidePropsPageProps) => {
  return <div>{name}</div>;
};

export const getServerSideProps: GetServerSideProps<
  {
    name: string;
  },
  { id: string }
> = async ({ res, req, params, query, locale, locales, defaultLocale }) => {
  res.setHeader('cache-control', 'public, max-age=3120000');
  return {
    props: { name: 'hello' },
  };
};

export default GetServerSidePropsPage;
