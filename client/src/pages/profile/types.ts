export const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }
]

export const level = [
  { label: 'SSC', value: 'SSC' },
  { label: 'HSC', value: 'HSC' },
  { label: 'DIPLOMA', value: 'DIPLOMA' },
  { label: 'BE', value: 'BE' }
]

export interface IAcademicDetail {
  level: 'SSC' | 'HSC' | 'DIPLOMA' | 'BE';
  institutionName: string;
  marks: number | null;
  passingYear: number | null;
}

export interface Student {
  userId: string | undefined;
  gender: 'Male' | 'Female' | 'Other' | null;
  mobile: string;
  dateOfBirth: Date | null | string;
  branch: string;
  address: string;
  profilePhoto?: string | File | null;
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
