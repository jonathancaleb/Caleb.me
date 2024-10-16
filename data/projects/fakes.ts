import type { Project } from '~/data/projects';

const fakes: Project[] = [
  {
    name: 'Rove',
    url: 'https://github.com/jonathancaleb/Rove',
    archived: false,
    description: 'The Kotlin Music Player is a mobile application designed to clone the functionality of YouTube Music. Built with Kotlin, it supports various audio formats and features playlist creation, song search, and playback controls. With a modern user interface',
    stars: 3,
    downloads: 2,
    language: 'Kotlin',
    githubUrl: ''
  },
  {
    name: 'PDF Reader',
    url: 'https://github.com/jonathancaleb/PDFRipper',
    archived: false,
    description: 'Python program to automatically extract text from a pdf documnet',
    stars: 2,
    downloads: 0,
    language: 'Python',
    githubUrl: ''
  },
  {
    name: 'Resume Builder',
    url: 'https://workfolio-ten.vercel.app/',
    archived: false,
    description: 'A resume builder built using typescript',
    stars: 4,
    downloads: 2,
    language: 'Next js',
    githubUrl: ''
  },

  {
    name: 'Job App',
    url: 'https://play.google.com/store/apps/details?id=oss.avsi.connect',
    archived: false,
    description: 'AVSI Connect is an innovative platform designed to facilitate job opportunities and foster professional connections within diverse industries. The platform serves as a dynamic marketplace where job seekers can discover employment opportunities.',
    stars: 4,
    downloads: 10,
    language: 'Dart',
    githubUrl: ''
  },
  {
    name: 'CashOrbit',
    url: 'https://github.com/jonathancaleb/cashorbit',
    archived: false,
    description:
      'A user-friendly personal finance app designed to help you track expenses 💸, manage budgets 💰, and achieve your financial goals 🎯. With intuitive features like expense categorization 📊, budget tracking 📅, and financial insights 📈.',
    stars: 5,
    downloads: 0,
    language: 'Dart',
    githubUrl: 'https://github.com/jonathancaleb/cashorbit'
  },
  {
    name: 'EnoFlow',
    url: 'https://enoflow.vercel.app/',
    archived: false,
    description: 'A productivity app inspired by Notion that combines ✍️ note-taking, ✅ task management, 📊 databases, and more—all in one seamless experience. Built with Next.js, Python, and Postgres for a powerful, unified workspace!',
    stars: 6,
    downloads: 0,
    language: '',
    githubUrl: 'https://github.com/jonathancaleb/enoflow'
  },
  {
    name: 'Logistics and Supply system',
    url: 'https://www.traderepubliq.com/',
    archived: false,
    description: 'Developed and implemented a comprehensive supply chain infrastructure tailored for emerging markets, facilitating the efficient acquisition and financing of essential commodities',
    stars: 6,
    downloads: 0,
    language: '',
    githubUrl: ''
  },
  {
    name: 'Coffee analysis project',
    url: 'https://github.com/jonathancaleb/ADAP',
    archived: false,
    description: 'A personal initiative to analyze coffee growth trends in Uganda using Python, data science, and machine learning. This project supports sustainable farming with predictive models and interactive visualizations.',
    stars: 5,
    downloads: 0,
    language: 'Python',
    githubUrl: ''
  }
];

export default fakes;
