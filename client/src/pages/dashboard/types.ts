export type StudentQueriesResponse = {
  success: boolean,
  totalStudents: number,
  placedStudents: number,
  placementPercentage: number,
  totalRecruiters?: number,
  recruiterCountPerYear?: any,
  branchWisePlacement: { branch: string, count: number }[],
  highestPackageData: {
    year: number,
    package: number,
    company: string | null
  }[]
}
