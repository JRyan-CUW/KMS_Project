import { environment as env } from '@env/environment';

export interface Feature {
  name: string;
  description: string;
  imageLoc: string;
  value: string;
}

export const features: Feature[] = [
  {
    name: "New Basketball Jerseys",
    description: '$200/500',
    imageLoc: '../../../assets/jersey.jpg',
    value: '40'
  },
  {
    name: 'New Books for Library',
    description: '$75/100',
    imageLoc: '../../../assets/book.png',
    value: '75'
  },
  {
    name: 'Field Trip to Capitol',
    description: '$3500/5000',
    imageLoc: '../../../assets/capital.jpg',
    value: '70'
  },
  {
    name: 'New Instruments for Band',
    description: '$500/600',
    imageLoc: '../../../assets/band.jpg',
    value: '83',
  },
  {
    name: 'New Basketball Hoop',
    description: '$100/500',
    imageLoc: '../../../assets/bballHoop.jpg',
    value: '20',
  },
  {
    name: 'Smartboard for Classroom',
    description: '$1000/2000',
    imageLoc: '../../../assets/smartBoard.jpg',
    value: '50',
  }
];
