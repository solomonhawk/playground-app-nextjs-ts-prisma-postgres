import { Post } from 'components/post';
import { useRequiredQueryParam } from 'helpers/hooks/use-required-query-param';
import { trpc } from 'lib/trpc';
import { GetServerSideProps, NextPage } from 'next';

import Head from 'next/head';

const Item: NextPage = () => {
  const id = useRequiredQueryParam<string>('id', { redirectTo: '/' });
  const postQuery = trpc.useQuery(['post.byId', { id }]);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQuery.isError || !postQuery.data) {
    return <div>Something went wrong...</div>;
  }

  return (
    <>
      <Head>
        <title>QuackerNews - {postQuery.data.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Post post={postQuery.data} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  if (!ctx.query.id) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return { props: {} };
};

export default Item;
