import c from 'classnames';
import { NextPage } from 'next';
import Heading from '~/components/heading';
import Meta from '~/components/meta';
import Paragraph from '~/components/paragraph';

const JokePage: NextPage = () => {
  return (
    <>
      <Meta title="#ByteMe" />

      <section>
        <Heading>#ByteMe</Heading>

        <div>
          <div className={c('h-10', 'bg-teal-500')} />
          <div className={c('h-10', 'bg-gray-200')} />
        </div>

        <Paragraph>
          {' '}
          Dang it, I broke myself! But no worries—I am undergoing repair. Be back soon. 😄🤖{' '}
        </Paragraph>
      </section>

      <div className={c('my-6', 'text-xl', 'text-center', 'font-light')}>
        Glory to Algorithms! Glory to Debuggers!
      </div>
    </>
  );
};

export default JokePage;
