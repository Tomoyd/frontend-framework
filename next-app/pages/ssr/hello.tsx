interface HelloProps {
  name: string;
}
const Hello = ({ name }: HelloProps) => {
  return <div>hello: {name}</div>;
};

export async function getServerSideProps() {
  // const res = await fetch('http://localhost:3000/api/hello');
  // const { name } = await res.json();
  return { props: { name: '888' } };
}

export default Hello;
