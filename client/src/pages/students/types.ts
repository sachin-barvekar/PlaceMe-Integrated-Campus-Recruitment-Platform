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
  mobile: string;
  gender: string;
  search: string;
  dateOfBirth: string; // ISO 8601 date string, could also be a Date type
  branch: string;
  address: string;
  profilePhoto: string;
  academicDetails: AcademicDetail[];
  skills: string;
  appliedJobs: any[]; // You may define an actual type for jobs if needed
  linkedIn: string;
  github: string;
  profileCompletion: boolean;
  __v: number;
}

export interface StudentsListParams {
  size?: number;
  page?: number;
  [key: string]: string | number | undefined;
}
