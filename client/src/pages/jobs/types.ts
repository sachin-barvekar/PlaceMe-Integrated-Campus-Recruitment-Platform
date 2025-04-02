export interface Job {
  _id?: any;
  recruiterId?: any;
  role: string;
  jobDescription: string;
  location: string;
  jobType: any | undefined;
  package?: string;
  skillsRequired: string;
  eligibilityCriteria?: string;
  lastDateToApply: Date | undefined | string;
  driveDate: Date | undefined | string;
  active?: boolean;
  search?: string;
  applicants?: any[];
}
