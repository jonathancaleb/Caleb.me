import fakes from '~/data/projects/fakes';
import { getNuGetDownloads } from '~/data/projects/nuget';
import { isProduction } from '~/utils/env';

export type Project = {
  name: string;
  url: string;
  archived: boolean;
  description?: string;
  homepageUrl?: string;
  stars: number;
  downloads: number;
  language?: string;
};

export const loadProjects = async function* () {
  // Use fake data in development
  if (!isProduction()) {
    yield* fakes;
    return;
  }

  // You may need to replace this part with your own logic
  // as getGitHubRepos and getGitHubDownloads are removed
};
