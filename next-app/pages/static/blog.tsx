type BlogProps = {
  name: string;
};

const Blog = ({ name }: BlogProps) => {
  return <div>{name}</div>;
};

export const getStaticProps = async () => {
  // const res = await fetch('http://localhost:3000/api/hello');
  // const { name } = await res.json();
  return { props: { name: '456' } };
};

export default Blog;
