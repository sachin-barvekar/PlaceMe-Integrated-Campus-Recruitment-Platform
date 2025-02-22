export interface IAcademicDetail {
  level: 'SSC' | 'HSC' | 'DIPLOMA' | 'BE';
  institutionName: string;
  marks: number | null;
  passingYear: number | null;
}

export interface Student {
  userId: any | undefined;
  gender: 'Male' | 'Female' | 'Other' | null;
  mobile: string;
  dateOfBirth: Date | undefined | string;
  branch: string;
  address: string;
  profilePhoto?: string | undefined;
  academicDetails: IAcademicDetail[];
  skills: string;
  linkedIn: string;
  github: string;
}

export interface StudentProfileResponse {
  success: boolean;
  profileCompletion: boolean;
  message: string;
  student: Student | null;
}

export type StudentSaveRequest = {
  studentDTO: Omit<Student, 'profilePhoto'>,
  file?: File | null
}
