import c from 'classnames';
import { NextPage } from 'next';
import { FiGithub, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import Heading from '~/components/heading';
import Image from '~/components/image';
import Link from '~/components/link';
import Paragraph from '~/components/paragraph';
import JokeAlert from '~/components/jokeAlert';

const HomePage: NextPage = () => {
  const age = new Date(Date.now() - Date.parse('1999-07-07')).getUTCFullYear() - 1970;

  const githubStarUrl = 'https://github.com/jonathancaleb';
  // const microsoftMvpUrl = 'https://credly.com/badges/04f634b6-189f-4bed-8acb-974541039ef9';

  return (
    <>
      <section
        className={c(
          'flex',
          'flex-col',
          'md:flex-row-reverse',
          'items-center',
          'md:items-start',
          'gap-6'
        )}
      >
        <div className={c('flex-none', 'w-48', 'md:w-56', 'md:mt-12')}>
          <Image src="/1.jpg" alt="picture" priority />
        </div>

        <div>
          <div className={c('text-center', 'md:text-left')}>
            <Heading>👋 Hello!</Heading>
          </div>
          <Paragraph>
            My name is Caleb. I&apos;m a {age}-year-old software
            developer from Kampala, Uganda.
          </Paragraph>
          <Paragraph>
          As a software developer working in a consultancy firm, I focus on developer tooling and infrastructure. 
          My interests span mobile apps, distributed systems, and web applications. 
          I thrive on seeking creative solutions to complex problems, building tools that empower others.
          </Paragraph>
          <Paragraph>
            I&apos;m also an active member of the developer community, at {' '}
            <Link href={githubStarUrl}>GitHub</Link> and {' '} — I spend most of my free time
            building my side<Link href="/projects"> projects</Link>, speaking
            at select <Link href="/speaking">technical conferences</Link>, or exploring my writing skills on <Link href="/blog">my blog</Link>.
          </Paragraph>
        </div>
      </section>

      <section className={c('my-2')}>
        <JokeAlert />
      </section>

      <div className={c('my-8', 'h-1', 'rounded', 'bg-purple-500')} />

      <section className={c('flex', 'justify-center', 'gap-3', 'text-2xl', 'font-light')}>
        <Link variant="discreet" href="https://github.com/jonathancaleb">
          <div className={c('px-2')}>
            <FiGithub strokeWidth={1} />
          </div>
        </Link>
        <Link variant="discreet" href="">
          <div className={c('px-2')}>
            <FiTwitter strokeWidth={1} />
          </div>
        </Link>
        <Link variant="discreet" href="">
          <div className={c('px-2')}>
            <FiYoutube strokeWidth={1} />
          </div>
        </Link>
        <Link variant="discreet" href="">
          <div className={c('px-2')}>
            <FiInstagram strokeWidth={1} />
          </div>
        </Link>
      </section>
    </>
  );
};

export default HomePage;
