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
  level: string;
  institutionName: string;
  marks: string;
  passingYear: string;
}

export interface Student {
  userId: string | undefined;
  gender: string;
  mobile: string;
  dateOfBirth: Date | null;
  branch: string;
  address: string;
  profilePhoto?: File | null;
  academicDetails: IAcademicDetail[];
  skills: string;
}

export interface StudentProfileResponse {
  success: boolean;
  profileCompletion: boolean;
  message: string;
  student: Student | null;
}

export type StudentSaveRequest = {
  studentDTO: Student,
  file: File | null
}
