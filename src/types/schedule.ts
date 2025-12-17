export interface Church {
  id: string;
  name: string;
  location: string;
}

export interface ScheduleEntry {
  date: string; // DD.MM.YYYY format
  day: string; // Tamil day name
  time: string; // Tamil time notation
  serviceType: string; // Editable
  speaker: string; // Editable
}

export interface GroupedScheduleEntry {
  date: string; // DD.MM.YYYY format
  day: string; // Tamil day name
  services: Array<{
    time: string;
    serviceType: string;
    speaker: string;
  }>;
}

export interface ScheduleData {
  churchId: string;
  month: number;
  year: number;
  entries: ScheduleEntry[];
}

export interface FilterState {
  month: number | null;
  year: number;
  place: string | null;
}
