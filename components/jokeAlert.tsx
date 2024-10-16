import c from 'classnames';
import { FC } from 'react';
import Link from '~/components/link';

const JokeAlert: FC = () => {
  return (
    <section
      className={c(
        'p-4',
        'border',
        'border-l-blue-500',
        'border-t-blue-500',
        'border-r-yellow-400',
        'border-b-yellow-400',
        'dark:border-l-blue-300',
        'dark:border-t-blue-300',
        'dark:border-r-yellow-500',
        'dark:border-b-yellow-500',
        'rounded',
        'space-y-1'
      )}
    >
      <div className={c('font-semibold')}>👩‍💻 Code Hard, Nap Harder, Dream in Binary</div>

      <div>Because even our subconscious runs on zeros and ones. 😄🌙💤</div>

      <div className={c('font-semibold')}>
        <Link href="/joke">Interact with my joke bot</Link>
      </div>
    </section>
  );
};

export default JokeAlert;
