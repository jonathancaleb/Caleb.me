import type { Project } from '~/data/projects';

const fakes: Project[] = [
  {
    name: 'Rove',
    url: 'https://github.com/jonathancaleb/Rove',
    archived: false,
    description:
      'The Kotlin Music Player is a mobile application designed to clone the functionality of YouTube Music. Built with Kotlin, it supports various audio formats and features playlist creation, song search, and playback controls. With a modern user interface',
    stars: 3,
    downloads: 2,
    language: 'Kotlin',
    githubUrl: 'https://github.com/jonathancaleb/Rove'
  },
  {
    name: 'PDF Reader',
    url: 'https://github.com/jonathancaleb/PDFRipper',
    archived: false,
    description: 'Python program to automatically extract text from a pdf documnet',
    stars: 2,
    downloads: 0,
    language: 'Python',
    githubUrl: 'https://github.com/jonathancaleb/PDFRipper'
  },
  {
    name: 'Resume Builder',
    url: 'https://workfolio-ten.vercel.app/',
    archived: false,
    description: 'A resume builder built using typescript',
    stars: 4,
    downloads: 2,
    language: 'Next js',
    githubUrl: 'https://github.com/jonathancaleb/workfolio'
  },

  {
    name: 'Job App',
    url: 'https://play.google.com/store/apps/details?id=oss.avsi.connect',
    archived: false,
    description:
      'AVSI Connect is an innovative platform designed to facilitate job opportunities and foster professional connections within diverse industries. The platform serves as a dynamic marketplace where job seekers can discover employment opportunities.',
    stars: 4,
    downloads: 10,
    language: 'Dart',
    githubUrl: 'https://github.com/jonathancaleb/avsi-connect'
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
    description:
      'A productivity app inspired by Notion that combines ✍️ note-taking, ✅ task management, 📊 databases, and more—all in one seamless experience. Built with Next.js, Python, and Postgres for a powerful, unified workspace!',
    stars: 6,
    downloads: 0,
    language: 'Typescript',
    githubUrl: 'https://github.com/jonathancaleb/enoflow'
  },
  {
    name: 'Logistics and Supply system',
    url: 'https://www.traderepubliq.com/',
    archived: false,
    description:
      'Developed and implemented a comprehensive supply chain infrastructure tailored for emerging markets, facilitating the efficient acquisition and financing of essential commodities',
    stars: 6,
    downloads: 0,
    language: 'Typescript',
    githubUrl: 'https://github.com/jonathancaleb/traderepubliq'
  },
  {
    name: 'Coffee analysis project',
    url: 'https://github.com/jonathancaleb/ADAP',
    archived: false,
    description:
      'A personal initiative to analyze coffee growth trends in Uganda using Python, data science, and machine learning. This project supports sustainable farming with predictive models and interactive visualizations.',
    stars: 5,
    downloads: 0,
    language: 'Python',
    githubUrl: 'https://github.com/jonathancaleb/ADAP'
  },
  {
    name: 'Andúril',
    url: 'https://anduril.onrender.com/',
    archived: false,
    description:
      '🗡️ Andúril – A personal productivity tool built to stay on top of my GitHub workflow. Inspired by tools like ZenHub and Zerocracy, this is an evolving side project to explore and understand how developer productivity can live inside GitHub.',
    stars: 0,
    downloads: 0,
    language: 'Typescript',
    githubUrl: 'https://github.com/jonathancaleb/Anduril'
  },
  {
    name: 'TAASA - Emergency Response',
    url: 'https://play.google.com/store/apps/details?id=com.sos.taasa',
    archived: false,
    description:
      'TAASA - Emergency Response & Incident Management. Streamline emergency response operations with real-time coordination, comprehensive incident management, and seamless communication tools designed for first responders and emergency management teams.',
    stars: 0,
    downloads: 0,
    language: 'React Native',
    githubUrl: 'https://github.com/jonathancaleb/taasa'
  }
];

export default fakes;
