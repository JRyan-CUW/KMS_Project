import { Fund } from './fund.model';

export class School {
    address?: string;
    funds: Fund[];
    email?: string;
    name?: string;
    phone?: string;
    picLoc?: string;
    picFullLoc?: string;
    state: string;
    city: string;
    docID: string;
    userUID: string;
}