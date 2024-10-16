import fakes from '~/data/projects/fakes';

export interface Project {
  name: string;
  url: string;
  archived: boolean;
  description?: string;
  homepageUrl?: string;
  stars: number;
  downloads: number;
  language?: string;
  githubUrl: string;
}

export const loadProjects = async function* () {
  // Use fake data
  for (const project of fakes) {
    await new Promise(resolve => setTimeout(resolve, 0));
    yield project;
  }
};

// You may need to replace this part with your own logic
// as getGitHubRepos and getGitHubDownloads are removed
