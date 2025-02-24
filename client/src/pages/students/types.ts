interface AcademicDetail {
  level: string;
  institutionName: string;
  marks: number;
  passingYear: number;
  _id: string;
}

interface UserId {
  _id: string;
  name: string;
  email: string;
}

export interface Students {
  _id: string;
  userId: UserId;
  name: string;
  mobile: string;
  gender: string;
  search: string;
  dateOfBirth: string;
  branch: string;
  address: string;
  profilePhoto: string;
  academicDetails: AcademicDetail[];
  skills: string;
  appliedJobs: any[];
  linkedIn: string;
  github: string;
  profileCompletion: boolean;
}

export interface StudentsListParams {
  size?: number;
  page?: number;
  [key: string]: string | number | undefined;
}
