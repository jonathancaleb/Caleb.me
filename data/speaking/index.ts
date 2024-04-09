export type SpeakingEngagement = {
  title: string;
  kind: 'talk' | 'workshop' | 'podcast';
  event: string;
  date: string;
  language: 'english';
  eventUrl?: string;
  presentationUrl?: string;
  recordingUrl?: string;
};

const engagements: SpeakingEngagement[] = [
  {
    title: 'Presentation of avsi job app',
    kind: 'talk',
    event: '3Shape Meetup',
    date: '2019-05-24',
    language: 'english',
    eventUrl: 'https://facebook.com/Lifeat3shape',
    presentationUrl:
      'https://slideshare.net/CalebSabila/caleb-sabila-writing-parsers-in-c-3shape-meetup',
  },
  // ... (omit remaining entries for brevity)
  {
    title: 'Reality-Driven Testing Using TestContainers',
    kind: 'talk',
    event: '.flutter community',
    date: '2023-12-13',
    language: 'english',
    eventUrl: 'https://flutter.com',
    presentationUrl:
      'https://slideshare.net/CalebSabila/realitydriven-testing-using-testcontainers',
    recordingUrl: 'https://youtube.com/',
  },
];

// This doesn't need to be an async iterator, but I wanted it to be consistent
// with other data sources.
export const loadSpeakingEngagements = async function* () {
  yield* engagements;
};
