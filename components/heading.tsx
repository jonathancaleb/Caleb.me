import type { FC, PropsWithChildren } from 'react';
import { FiLink } from 'react-icons/fi';
import Link from '~/components/link'; // Import type for Link component
import c from 'classnames'; // Import classnames utility function

type HeadingProps = PropsWithChildren<{
  id?: string;
  level?: 1 | 2 | 3 | 4 | 5; // Specify valid values for heading level
}>;

const Heading: FC<HeadingProps> = ({ id, level = 1, children }) => {
  const Proxy = `h${level}` as const; // Ensure Proxy element type matches the specified level

  return (
    <Proxy
      id={id}
      className={c(
        'group',
        'my-4',
        {
          'text-3xl': level === 1,
          'text-2xl': level === 2,
          'text-xl': level === 3,
          'text-lg': level === 4,
        },
        'font-semibold'
      )}
    >
      <span className={c({ 'mr-2': !!id })}>{children}</span>

      {id && (
        <span className={c('sm:invisible', 'group-hover:visible', 'text-base')}>
          <Link href={`#${id}`}> {/* Create link with href pointing to id */}
            <FiLink className={c('inline', 'align-baseline')} /> {/* Render FiLink icon */}
          </Link>
        </span>
      )}
    </Proxy>
  );
};

export default Heading;
