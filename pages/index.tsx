import { createSSGHelpers } from '@trpc/react/ssg';
import { PostsList } from 'components/posts-list';
import { prisma } from 'lib/prisma';
import { trpc } from 'lib/trpc';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { appRouter } from 'server/router';
import superjson from 'superjson';

const IndexPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ page }) => {
  const postsQuery = trpc.useQuery(['post.all', { page }]);

  if (postsQuery.isLoading && !postsQuery.data) {
    return <div>Loading...</div>;
  }

  if (postsQuery.isError || !postsQuery.data) {
    return <div>Something went wrong...</div>;
  }

  const hasMorePages = page * postsQuery.data.perPage < postsQuery.data.totalCount;

  return (
    <>
      <Head>
        <title>QuackerNews</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PostsList posts={postsQuery.data.posts} hasMorePages={hasMorePages} nextPageUrl={`/news?p=${page + 1}`} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession({ ctx });
  const pageParam = parseInt(ctx.query.page as string, 10);
  const page = isNaN(pageParam) ? 1 : pageParam;

  const ssg = await createSSGHelpers({
    router: appRouter,
    // @TODO(shawk): get user id from session
    ctx: { prisma, user: session?.user },
    transformer: superjson,
  });

  await ssg.fetchQuery('post.all', { page });

  return { props: { trpcState: ssg.dehydrate(), page } };
};

export default IndexPage;
