

# **ElectNow - Election Management System**

ElectNow is a full-stack web application that allows users to create and participate in elections seamlessly. The platform provides features to manage elections, vote, view results, and track participation efficiently.

---

## **Features**

### User Features
- **Authentication**: Secure login with Google Sign-In.
- **Dashboard**: 
  - Create new elections.
  - Enter room codes to join existing elections.
  - View recently visited elections.
- **Voting**: 
  - Vote for candidates in specific positions.
  - Ensure only one vote per position.
  - Option to skip a position if desired.
- **Results**: 
  - View live election results.
  - Display winners for each position.

### Admin Features
- Create and manage elections.
- Add positions and candidates dynamically.
- Monitor election progress.

---

## **Tech Stack**

### Frontend
- **React.js**: Component-based UI development.
- **Tailwind CSS**: Styling for modern, responsive design.
- **React Router**: Dynamic routing for a smooth user experience.

### Backend
- **Supabase**: Managed backend-as-a-service for authentication and database management.

### Database
- **PostgreSQL**: Relational database for storing election and user data.

---

## **Setup Instructions**

### Prerequisites
- Node.js (>= 16.x)
- Supabase account
- Git installed

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/electnow.git
   cd electnow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file and add the following variables:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_KEY=your_supabase_key
   ```

4. **Start the Development Server**:
   ```bash
   npm start
   ```

5. **Set Up Supabase**:
   - Create the required tables (`elections`, `positions`, `members`, `user_elections`) in your Supabase project.
   - Define the appropriate relationships and foreign keys.

---

## **Database Schema**

### Tables and Columns

#### 1. **`elections`**
- `id` (Primary Key)
- `name` (Election Name)
- `total_votes` (Integer)

#### 2. **`positions`**
- `id` (Primary Key)
- `election_id` (Foreign Key to `elections`)
- `position_name` (String)

#### 3. **`members`**
- `id` (Primary Key)
- `position_id` (Foreign Key to `positions`)
- `member_name` (String)
- `votes` (Integer)

#### 4. **`user_elections`**
- `id` (Primary Key)
- `user_email` (String)
- `election_id` (Foreign Key to `elections`)
- `voted` (Boolean)
- `joined_at` (Timestamp)

---

## **Project Structure**

```plaintext
src/
├── components/          # Reusable components (e.g., buttons, forms)
├── pages/               # Route pages (Dashboard, VotingPage, ResultsPage)
├── services/            # Supabase services and API functions
├── App.js               # Application entry point
├── index.js             # React DOM render
└── styles/              # Tailwind CSS configuration
```

---

## **Usage**

1. **Create an Election**:
   - Navigate to the dashboard.
   - Click on "Create Election" and fill in the required details.

2. **Join an Election**:
   - Enter the room code in the dashboard and submit.
   - Cast your vote on the voting page.

3. **View Results**:
   - Navigate to the results page to view live voting progress and winners.

---

## **Contributing**

We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

---

## **Future Enhancements**
- Add email notifications for election updates.
- Implement real-time voting progress with WebSocket.
- Support for multi-language interfaces.
- Add analytics for election trends.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgements**

- **Supabase**: For backend and authentication services.
- **React**: For a smooth frontend experience.
- **Tailwind CSS**: For modern and efficient styling.

---