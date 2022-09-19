import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

interface PostProps {
  id: string;
  name: string;
}
const Post = (props: PostProps) => {
  const router = useRouter();
  console.log('props>>', props);
  const { id, name } = router.query;
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {id || null}--
      {name || null}
      {props.id || null}--{props.name || null}
    </div>
  );
};
export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'hello' } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PostProps,
  { id: string }
> = async ({ params }) => {
  return { props: { name: '123', id: params?.id || '' }, revalidate: 1 };
};
export default Post;
10;
