export interface Placement {
  _id?: string;
  companyName?: string;
  jobRole: string;
  package: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
  studentId?: string;
  studentEmail?: string;
  companyId?: string;
  companyEmail?: string;
  search?: string | number;
  status?: 'Placed' | 'Pending' | 'Rejected';
}

export interface PlacementSaveRequest {
  placementDTO: Placement;
}

export interface PlacementListParams {
  size?: number;
  page?: number;
  [key: string]: string | number | undefined;
}
