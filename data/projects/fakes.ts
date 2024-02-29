import { Project } from '~/data/projects';

const fakes: Project[] = [
  {
    name: 'Job App',
    url: 'https://play.google.com/store/apps/details?id=oss.avsi.connect',
    archived: false,
    description: 'Avsi connect is a platform for jobs, proffessional connections.',
    stars: 1,
    downloads: 10,
    language: 'Dart'
  },
  {
    name: 'Loan App',
    url: 'https://play.google.com/store/apps/details?id=ke.co.solarrays.ug',
    archived: false,
    description: 'A loan app that enables users to borrow and process loans within the shortest period of time.',
    stars: 5,
    downloads: 100,
    language: 'Dart'
  },
  {
    name: 'Company Website',
    url: 'https://galaxyconcepts.org',
    archived: false,
    description: 'A website built for a construction company.',
    stars: 1,
    downloads: 0,
    language: 'SCSS'
  },
  
];

export default fakes;
