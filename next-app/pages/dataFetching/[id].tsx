import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

const GeStaticPathsPage = () => {
  const router = useRouter();
  // router.pathname = '';
  return <div>hello</div>;
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = () => {
  return {
    paths: [{ params: { id: 'he' } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  { name: string },
  { id: string }
> = () => {
  return {
    props: {
      name: '小明',
    },
  };
};

export default GeStaticPathsPage;
