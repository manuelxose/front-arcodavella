import { StatusCodes } from '../enums/status.enum';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  dni: string;
  memberNumber: string;
  status: StatusCodes;
  phone: string;
  accountNumber: string;
  address: string;
  comments: string;
  selected: boolean;
}
