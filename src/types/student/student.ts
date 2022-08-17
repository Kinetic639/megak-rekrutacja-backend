import { ContractType, WorkType } from '../user';

export interface csvStudent {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

export interface filterStudents extends Omit<csvStudent, 'email'> {
  expectedSalaryFrom: number;
  expectedSalaryTo: number;
  expectedContractType: ContractType[];
  expectedTypeWork: WorkType[];
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}

export interface updateStudent {
  id: string;
  firstName: string;
  lastName: string;
  tel: number;
  bio: string;
  githubUsername: string;
  expectedTypeWork: WorkType;
  targetWorkCity: string;
  expectedContractType: ContractType;
  canTakeApprenticeship: string | boolean;
  expectedSalary: number;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
  portfolioUrls: string;
  teamProjectUrls: string;
}

export interface updateStudentResponse {
  statusCode: number;
  message: string;
  studentId?: string;
}

export enum ignoredStudentReason {
  EMAIL_INVALID = 'Niepoprawny email',
  NOTHING_TO_UPDATE = 'Brak zmian do wprowadzenia',
  COMPLETION_INVALID = 'Błędna ocena w courseCompletion',
  ENGAGEMENT_INVALID = 'Błędna ocena w CourseEngagement',
  PROJECT_DEGREE_INVALID = 'Błędna ocena w ProjectDegree',
  TEAM_PROJECT_DEGREE_INVALID = 'Błędna ocena w teamProjectDegree',
}

interface ignoredStudent {
  email: string;
  reason: ignoredStudentReason;
}

export type createUsersResponse = {
  studentsIgnored: ignoredStudent[];
  studentsUpdated: string[];
  studentsAdded: string[];
};
