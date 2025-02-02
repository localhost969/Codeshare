# CodeShare

**CodeShare** is a web application that allows users to share, edit, delete, and generate QR codes for their code snippets. The app uses Firebase for data storage and provides a neon-themed UI with CRUD functionalities.
![image](https://github.com/user-attachments/assets/251eb5af-5c94-4668-a107-5bbf4312b1e8)

![image](https://github.com/user-attachments/assets/4f604e48-f4a2-490d-a81e-8575b968f78f)
![image](https://github.com/user-attachments/assets/29a41355-87d3-4611-9787-d94941b1250c)
![image](https://github.com/user-attachments/assets/5382ef3b-31d8-4ecc-83f7-eac84c4c670f)



# Features
- **Username-based Access**: Users enter a username to access their personalized dashboard.
- **CRUD Operations**: Create, read, update, and delete code snippets.
- **QR Code Sharing**: Generate a QR code for each code snippet to share easily.


# Tech Stack
- **HTML5**: Page structure and content.
- **CSS3**: Neon-themed styling.
- **JavaScript**: Client-side functionality.
- **Firebase**: Firestore for data storage.
- **QR Code Generator**: For generating and sharing QR codes.

# Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/localhost969/Codeshare.git
   ```

2. **Navigate to the project folder**:
   Open the project folder in your code editor.

3. **Firebase Configuration**:
   Replace the Firebase configuration in `index.html` & `dashboard.html` with your Firebase project credentials:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

4. **Start the Application**:
   Open `index.html` in a web browser to run the app.

# File Structure

```
/CodeShare
├── index.html              # Landing page for username input
├── dashboard.html          # Dashboard to manage code snippets
└── README.md               # Project documentation
```

# Contributing
Feel free to fork the repository, make changes, and submit a pull request.

# License
This project is open-source and available under the [MIT License](LICENSE).

## Future Enhancements
- **User Authentication**: Implement Firebase Authentication for secure logins.
- **Code Snippet Categories**: Organize snippets by categories/tags.
- **Dark/Light Mode**: Toggle between dark and light modes for better UX.
