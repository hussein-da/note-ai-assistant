
import { Meeting, ActionItem, MeetingFormData } from '@/types/meeting';

// Mock data for demonstration
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Weekly Marketing Team Sync',
    date: '2025-04-10T10:00:00Z',
    duration: '45 minutes',
    status: 'completed',
    transcript: `
    John: Good morning everyone, let's get started with our weekly marketing sync.
    Sarah: Hi John, before we start, I wanted to share the results from our latest campaign.
    John: Great, go ahead.
    Sarah: So we've seen a 25% increase in engagement compared to our previous campaign. The new ad creatives are performing really well.
    Alex: That's amazing news! Do we have any feedback on the landing page conversion rates?
    Sarah: Yes, conversion rates are up by 12%. But I think we can do better if we optimize the call-to-action buttons.
    John: I agree. Alex, can you work on optimizing those CTAs by next Friday?
    Alex: Sure, I'll have a proposal ready by then.
    John: Perfect. Now, let's discuss our Q4 campaign planning. We need to finalize the budget allocation.
    Maria: I've prepared a draft budget breakdown. I'll share it with everyone after the meeting.
    John: Thanks Maria. Can you make sure to highlight the social media spending portion? We need to increase that for Q4.
    Maria: Will do, I'll have that updated by tomorrow.
    John: Great. Sarah, please connect with our agency by next week to brief them on the Q4 campaign.
    Sarah: Got it, I'll schedule a meeting with them.
    John: Alright, that covers our agenda for today. Let's meet again next week. Thanks everyone!
    `,
    summary: 'The marketing team discussed the positive results from their latest campaign, showing a 25% increase in engagement and 12% improvement in conversion rates. The team agreed to optimize call-to-action buttons, plan the Q4 campaign, and increase social media spending for Q4. Budget allocation drafts are being prepared and the team will brief the agency on the new campaign plans next week.',
    actionItems: [
      {
        id: 'a1',
        meetingId: '1',
        text: 'Optimize call-to-action buttons on the landing page',
        assignee: 'Alex',
        dueDate: '2025-04-19',
        completed: false
      },
      {
        id: 'a2',
        meetingId: '1',
        text: 'Update budget breakdown with highlighted social media spending',
        assignee: 'Maria',
        dueDate: '2025-04-14',
        completed: false
      },
      {
        id: 'a3',
        meetingId: '1',
        text: 'Schedule meeting with agency to brief on Q4 campaign',
        assignee: 'Sarah',
        dueDate: '2025-04-21',
        completed: false
      }
    ]
  },
  {
    id: '2',
    title: 'Product Development Sprint Planning',
    date: '2025-04-08T14:30:00Z',
    duration: '60 minutes',
    status: 'completed',
    summary: 'The product team reviewed the progress on the current sprint and planned the next sprint goals. Several bugs were prioritized for fixing, and new feature development for the user dashboard was discussed. The team decided to postpone the mobile app release to ensure better quality.',
    actionItems: [
      {
        id: 'a4',
        meetingId: '2',
        text: 'Create tickets for all identified bugs',
        assignee: 'David',
        dueDate: '2025-04-15',
        completed: true
      },
      {
        id: 'a5',
        meetingId: '2',
        text: 'Finalize user dashboard wireframes',
        assignee: 'Emma',
        dueDate: '2025-04-22',
        completed: false
      },
      {
        id: 'a6',
        meetingId: '2',
        text: 'Update roadmap to reflect new mobile app release date',
        assignee: 'Michael',
        dueDate: '2025-04-12',
        completed: false
      }
    ]
  },
  {
    id: '3',
    title: 'Quarterly Business Review',
    date: '2025-04-05T09:00:00Z',
    duration: '120 minutes',
    status: 'completed',
    summary: 'The executive team reviewed the Q1 performance, which exceeded revenue targets by 15%. The team identified challenges in the APAC region and decided to allocate additional resources. New hiring plans were approved for the engineering and marketing departments.',
    actionItems: [
      {
        id: 'a7',
        meetingId: '3',
        text: 'Prepare detailed APAC region strategy document',
        assignee: 'Lisa',
        dueDate: '2025-04-25',
        completed: false
      },
      {
        id: 'a8',
        meetingId: '3',
        text: 'Update headcount plan for engineering team',
        assignee: 'Robert',
        dueDate: '2025-04-18',
        completed: true
      },
      {
        id: 'a9',
        meetingId: '3',
        text: 'Schedule follow-up meeting to review marketing budget allocation',
        assignee: 'Jennifer',
        dueDate: '2025-04-20',
        completed: false
      }
    ]
  }
];

// Function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all meetings
export const getMeetings = async (): Promise<Meeting[]> => {
  await delay(800); // Simulate network delay
  return [...mockMeetings];
};

// Get a single meeting by ID
export const getMeetingById = async (id: string): Promise<Meeting | undefined> => {
  await delay(600); // Simulate network delay
  return mockMeetings.find(meeting => meeting.id === id);
};

// Create a new meeting
export const createMeeting = async (meetingData: MeetingFormData): Promise<Meeting> => {
  await delay(1000); // Simulate upload and processing delay
  
  // Create a new meeting object with mock data
  const newMeeting: Meeting = {
    id: String(mockMeetings.length + 1),
    title: meetingData.title,
    date: new Date().toISOString(),
    duration: '45 minutes', // Mock duration
    status: 'processing',
    audioUrl: meetingData.file ? URL.createObjectURL(meetingData.file) : undefined
  };
  
  // Simulate the async processing of the meeting
  setTimeout(() => {
    newMeeting.status = 'completed';
    newMeeting.transcript = `
    [Meeting Transcript would be here after processing]
    Participant 1: Hello everyone, let's start the meeting.
    Participant 2: I've been working on the project and have some updates.
    Participant 1: Great, please share.
    Participant 2: We've completed the initial phase and are now moving to implementation.
    Participant 3: I have a question about the timeline. Are we still on track for the June release?
    Participant 1: Yes, we are. But we need to make sure the QA team is prepared.
    Participant 4: I'll coordinate with the QA team to ensure they're ready by May 15th.
    Participant 1: Perfect. Also, we need to update the documentation. Can someone take that?
    Participant 2: I can work on the documentation. I'll have it ready by the end of next week.
    Participant 1: Thank you. Anything else we need to discuss?
    Participant 3: I think we covered everything for now.
    Participant 1: Great, then let's meet again next week. Thank you everyone.
    `;
    newMeeting.summary = 'The team discussed project progress, confirming they are on track for the June release. They assigned responsibilities for QA preparation and documentation updates. The initial phase is complete and implementation is beginning. The next meeting is scheduled for next week.';
    newMeeting.actionItems = [
      {
        id: `a${Math.random().toString(36).substring(7)}`,
        meetingId: newMeeting.id,
        text: 'Coordinate with QA team for May 15th readiness',
        assignee: 'Participant 4',
        dueDate: '2025-05-10',
        completed: false
      },
      {
        id: `a${Math.random().toString(36).substring(7)}`,
        meetingId: newMeeting.id,
        text: 'Update project documentation',
        assignee: 'Participant 2',
        dueDate: '2025-04-21',
        completed: false
      }
    ];
    
    // Add the new meeting to our mock data (in a real app, this would be stored in a database)
    mockMeetings.push(newMeeting);
  }, 10000); // Simulate 10 seconds of processing time
  
  return newMeeting;
};

// Update meeting action item status
export const updateActionItem = async (
  meetingId: string, 
  actionItemId: string, 
  completed: boolean
): Promise<ActionItem | undefined> => {
  await delay(500); // Simulate network delay
  
  const meeting = mockMeetings.find(m => m.id === meetingId);
  if (!meeting || !meeting.actionItems) return undefined;
  
  const actionItem = meeting.actionItems.find(item => item.id === actionItemId);
  if (!actionItem) return undefined;
  
  actionItem.completed = completed;
  return actionItem;
};
