# **App Name**: Zenos Project

## Core Features:

- Authentication: User authentication via email/password and social login (Google) with Firebase Auth. Includes password recovery.
- Dashboard: Display a dashboard with a grid of project cards, a sidebar for navigation (Home, Notifications, Settings), and a FAB for creating new projects. Allow user to view projects where they've been invited.
- Kanban View: Visualize tasks in a Kanban board with columns (To Do, In Progress, Blocked, Done). Enable drag-and-drop functionality to update task status in Firestore. Allow quick task addition with a text field, and implement filters (e.g., 'Only my tasks', 'Overdue').
- List View: Provide a list/table view of tasks with columns for checkbox, task name, assignee (avatar), due date, and priority (color-coded tag). Allow inline editing of dates and sorting by column headers.
- Task Details Modal: Display task details in a modal or side-drawer, featuring an editable title, rich text description (using Quill or Tiptap), status dropdown, assignee selection, date picker, tags, subtasks (with progress bar), file attachments (using Firebase Storage), and a comment section.
- Real-time Presence: Show which users are currently viewing a task in real-time using Firebase Presence. Indication if someone is typing.
- Intelligent Notifications: Use Cloud Functions to monitor Firestore and trigger notifications based on task assignments or changes.

## Style Guidelines:

- Primary color: Deep blue (#39FF14) for a professional and trustworthy feel.
- Background color: Light gray (#0a0a0a) for a clean and modern look.
- Accent color: A shade of purple (#FAFF00) analogous to blue, offering contrast for interactive elements.
- Body and headline font: 'Inter' for a modern, neutral look, suitable for both headlines and body text.
- Use minimalist, line-based icons to maintain a clean and professional aesthetic.
- Maintain a clean and organized layout with clear visual hierarchy and ample spacing.
- Use subtle animations and transitions to enhance the user experience and provide visual feedback.