import c from 'classnames';
import type { GetStaticProps, NextPage } from 'next';
import { FiArchive, FiCode, FiExternalLink, FiGithub } from 'react-icons/fi';
import Heading from '~/components/heading';
import Link from '~/components/link';
import Meta from '~/components/meta';
import type { Project } from '~/data/projects';
import { loadProjects } from '~/data/projects';
import { bufferIterable } from '~/utils/async';
import { deleteUndefined } from '~/utils/object';

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: NextPage<ProjectsPageProps> = ({ projects }) => {
  return (
    <>
      <Meta title="Projects" />

      <section className={c('text-center', 'max-w-3xl', 'mx-auto')}>
        <Heading>Projects</Heading>

        <div
          className={c('text-lg', 'text-gray-600', 'dark:text-gray-300', 'leading-relaxed', 'my-4')}
        >
          These are the open-source projects that I&apos;ve built. Most of these started out of
          personal necessity and have grown into tools that I hope others find useful.
        </div>

        {/* Stats */}
        <div
          className={c(
            'flex',
            'justify-center',
            'gap-8',
            'mt-8',
            'text-sm',
            'text-gray-600',
            'dark:text-gray-400'
          )}
        >
          <div className={c('flex', 'items-center', 'gap-2')}>
            <div className={c('w-2', 'h-2', 'bg-purple-500', 'rounded-full')} />
            <span>{projects.length} Projects</span>
          </div>
          <div className={c('flex', 'items-center', 'gap-2')}>
            <div className={c('w-2', 'h-2', 'bg-green-500', 'rounded-full')} />
            <span>{projects.filter((p) => !p.archived).length} Active</span>
          </div>
        </div>
      </section>

      <section
        className={c(
          'mt-12',
          'grid',
          'gap-6',
          'sm:grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-3'
        )}
      >
        {projects.map((project, i) => (
          <article
            key={i}
            className={c(
              'group',
              'relative',
              'flex',
              'flex-col',
              'bg-white',
              'dark:bg-gray-800',
              'rounded-xl',
              'shadow-sm',
              'border',
              'border-gray-200',
              'dark:border-gray-700',
              'hover:shadow-lg',
              'hover:shadow-purple-500/10',
              'dark:hover:shadow-purple-500/20',
              'transition-all',
              'duration-300',
              'hover:-translate-y-1',
              'overflow-hidden'
            )}
          >
            {/* Archive status */}
            {project.archived && (
              <div
                className={c(
                  'absolute',
                  'top-3',
                  'right-3',
                  'z-10',
                  'flex',
                  'items-center',
                  'gap-1',
                  'px-2',
                  'py-1',
                  'bg-gray-500',
                  'text-white',
                  'text-xs',
                  'font-medium',
                  'rounded-full',
                  'shadow-sm'
                )}
              >
                <FiArchive className={c('w-3', 'h-3')} />
                Archived
              </div>
            )}

            <div className={c('flex', 'flex-col', 'h-full', 'p-6')}>
              {/* Project header */}
              <div className={c('mb-4')}>
                <h3
                  className={c(
                    'text-xl',
                    'font-bold',
                    'text-gray-900',
                    'dark:text-white',
                    'mb-3',
                    'group-hover:text-purple-600',
                    'dark:group-hover:text-purple-400',
                    'transition-colors',
                    'duration-200'
                  )}
                  title={project.name}
                >
                  {project.name}
                </h3>

                {/* Language badge */}
                {project.language && (
                  <div
                    className={c(
                      'inline-flex',
                      'items-center',
                      'gap-1',
                      'px-2',
                      'py-1',
                      'bg-purple-100',
                      'dark:bg-purple-900',
                      'text-purple-700',
                      'dark:text-purple-300',
                      'text-xs',
                      'font-medium',
                      'rounded-md'
                    )}
                  >
                    <FiCode className={c('w-3', 'h-3')} />
                    {project.language}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className={c('flex-1', 'mb-6')}>
                <p
                  className={c(
                    'text-gray-600',
                    'dark:text-gray-300',
                    'text-sm',
                    'leading-relaxed',
                    'line-clamp-3'
                  )}
                >
                  {project.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className={c('flex', 'gap-3', 'mt-auto')}>
                {/* Live Project Link */}
                <Link href={project.url}>
                  <div
                    className={c(
                      'flex',
                      'items-center',
                      'justify-center',
                      'gap-2',
                      'flex-1',
                      'px-4',
                      'py-2',
                      'bg-purple-600',
                      'hover:bg-purple-700',
                      'text-white',
                      'text-sm',
                      'font-medium',
                      'rounded-lg',
                      'transition-colors',
                      'duration-200'
                    )}
                  >
                    <FiExternalLink className={c('w-4', 'h-4')} />
                    View Live
                  </div>
                </Link>

                {/* GitHub Link */}
                <Link href={project.githubUrl || project.url}>
                  <div
                    className={c(
                      'flex',
                      'items-center',
                      'justify-center',
                      'w-10',
                      'h-10',
                      'bg-gray-100',
                      'dark:bg-gray-700',
                      'text-gray-600',
                      'dark:text-gray-300',
                      'rounded-lg',
                      'hover:bg-gray-200',
                      'dark:hover:bg-gray-600',
                      'transition-colors',
                      'duration-200'
                    )}
                  >
                    <FiGithub className={c('w-5', 'h-5')} />
                  </div>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const projects = await bufferIterable(loadProjects());

  // Remove undefined values because they cannot be serialized
  deleteUndefined(projects);

  // Sort by name alphabetically, with non-archived projects first
  projects.sort((a, b) => {
    if (a.archived !== b.archived) {
      return a.archived ? 1 : -1; // Non-archived first
    }
    return a.name.localeCompare(b.name); // Then alphabetically
  });

  return {
    props: {
      projects
    }
  };
};

export default ProjectsPage;
