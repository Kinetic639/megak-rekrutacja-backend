export enum WorkType {
  'REMOTE' = 'Zdalnie',
  'OFFICE' = 'Biuro',
  'MOVE' = 'Gotowość do przeprowadzki',
  'HYBRID' = 'Hybrydowo',
  'DEFAULT' = 'Dowolne',
}

export const WorkTypeMap = [
  WorkType.REMOTE,
  WorkType.OFFICE,
  WorkType.MOVE,
  WorkType.HYBRID,
  WorkType.DEFAULT,
];
