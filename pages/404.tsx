import { ErrorLayout } from 'components/layouts/error-layout';
import { NextPage } from 'next';
import Head from 'next/head';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuackerNews - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>

      <ErrorLayout>
        <div className="p-2">
          <h1>Page Not Found</h1>
        </div>
      </ErrorLayout>
    </>
  );
};

export default NotFound;
