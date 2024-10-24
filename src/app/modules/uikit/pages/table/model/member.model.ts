import { StatusCodes } from 'src/app/core/enums/status.enum';

export interface Member {
  id: string;
  name: string;
  dni: string;
  memberNumber: string;
  email: string;
  comments: string;
  selected: boolean;
  status: StatusCodes;
}
