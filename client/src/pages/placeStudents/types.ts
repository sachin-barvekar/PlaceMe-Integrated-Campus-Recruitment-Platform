export interface Placement {
  _id: string;
  companyName: string;
  jobRole: string;
  package: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  studentName: string;
  studentEmail: string;
  companyEmail: string;
  search: string | number;
}

export interface PlacementListParams {
  size?: number;
  page?: number;
  [key: string]: string | number | undefined;
}
