# CodeShare

<img width="1352" height="767" alt="image" src="https://github.com/user-attachments/assets/c042a503-b40e-4a53-b151-e7fe55f05bb1" />


A real-time collaborative code editing platform built with Next.js, Chakra UI, and Firebase. This platform allows multiple users to create and join code spaces, edit code together in real-time, and run code snippets in various programming languages.



## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously
- **Password-Protected Spaces**: Create private code spaces with password protection
- **Multiple Language Support**: JavaScript, Python, Java, C++, PHP, HTML, CSS, and more
- **Code Execution**: Run your code snippets directly in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: Next.js, Chakra UI, React
- **Backend**: Next.js API Routes, Firebase Firestore
- **Real-time Communication**: Socket.io
- **Code Editing**: CodeMirror

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a New Code Space

1. Visit the homepage and select the "Create Space" tab
2. Enter a name for your space and a password
3. Click "Create Space" to generate a new code space
4. Share the space ID and password with collaborators

### Joining an Existing Space

1. Visit the homepage and select the "Join Space" tab
2. Enter the space ID and password
3. Click "Join Space" to enter the collaborative environment

### Working with Code Snippets

1. Create new code snippets using the "New Snippet" button in the sidebar
2. Select a programming language from the dropdown menu
3. Write or paste your code in the editor
4. All changes are automatically saved and synced with collaborators
5. Switch to the "Run Code" tab to execute your code and see the output



## Firebase Configuration

The project uses Firebase for data storage and authentication. Make sure to update the Firebase configuration in `/lib/firebase.js` with your own Firebase project details.

---

Happy coding!
