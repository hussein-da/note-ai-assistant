
export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'processing' | 'completed' | 'failed';
  transcript?: string;
  summary?: string;
  actionItems?: ActionItem[];
  audioUrl?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  text: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

export type MeetingFormData = {
  title: string;
  file?: File;
};
