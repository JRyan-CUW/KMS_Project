import { Fund } from "./fund.model";

export class School {
  address?: string;
  funds: Fund[];
  email?: string;
  name?: string;
  phone?: string;
  picLoc?: string;
  state: string;
  city: string;
  userUID: string;
}
