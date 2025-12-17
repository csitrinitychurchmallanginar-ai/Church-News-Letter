export interface Church {
  id: string;
  name: string;
  location: string;
}

export interface ScheduleEntry {
  date: string;
  day: string;
  time: string;
  serviceType: string;
  speaker: string;
}

export interface ScheduleData {
  churchId: string;
  month: number;
  year: number;
  entries: ScheduleEntry[];
}

