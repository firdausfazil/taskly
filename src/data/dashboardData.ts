export interface DailyTask {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  priority: string;
  status: string;
  checklist: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

export interface DailyScheduleItem {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  isCompleted: boolean;
}

export const performanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 50],
      strokeWidth: 2
    }
  ],
  legend: ["Performance"]
};

export const dailyTasks: DailyTask[] = [
  {
    id: 1,
    title: "Design Homepage UI",
    description: "Create a modern and responsive UI design for the homepage following the brand guidelines",
    time: "10:00 AM - 11:30 AM",
    category: "Work",
    priority: "High",
    status: "In Progress",
    checklist: [
      { id: 1, text: "Create wireframes", completed: true },
      { id: 2, text: "Design mockups", completed: false },
      { id: 3, text: "Get feedback", completed: false },
    ],
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Weekly sprint planning meeting with the development team",
    time: "1:00 PM - 2:00 PM",
    category: "Work",
    priority: "Medium",
    status: "Pending",
    checklist: [
      { id: 1, text: "Prepare agenda", completed: true },
      { id: 2, text: "Send invitation", completed: true },
      { id: 3, text: "Review last sprint", completed: false },
    ],
  },
  {
    id: 3,
    title: "Grocery Shopping",
    description: "Buy essentials for the week from the supermarket",
    time: "5:30 PM - 6:30 PM",
    category: "Personal",
    priority: "Low",
    status: "Pending",
    checklist: [
      { id: 1, text: "Fruits and vegetables", completed: false },
      { id: 2, text: "Dairy products", completed: false },
      { id: 3, text: "Cleaning supplies", completed: false },
    ],
  },
];

export const dailyScheduleData: DailyScheduleItem[] = [
  {
    id: 1,
    title: "Wake Up",
    start_time: "5:30 AM",
    end_time: "6:00 AM",
    isCompleted: true
  },
  {
    id: 2,
    title: "Subuh Prayer",
    start_time: "6:30 AM",
    end_time: "",
    isCompleted: true
  },
  {
    id: 3,
    title: "Exercise",
    start_time: "7:00 AM",
    end_time: "8:00 AM",
    isCompleted: true
  },
  {
    id: 4,
    title: "Go to work",
    start_time: "8:30 AM",
    end_time: "",
    isCompleted: true
  },
]; 