export interface csvStudent {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

export enum ignoredStudentReason {
  EMAIL_INVALID = 'Invalid email.',
  NOTHING_TO_UPDATE = 'Nothing to update.',
  COMPLETION_INVALID = 'courseCompletion score is invalid',
  ENGAGEMENT_INVALID = 'CourseEngagement score is invalid.',
  PROJECT_DEGREE_INVALID = 'ProjectDegree score is invalid.',
  TEAM_PROJECT_DEGREE_INVALID = 'teamProjectDegree score is invalid.',
}

interface ignoredStudent {
  email: string;
  reason: ignoredStudentReason;
}

export type createUsersResponse = {
  studentsIgnored: ignoredStudent[];
  studentUpdated: string[];
  studentsAdded: string[];
};
