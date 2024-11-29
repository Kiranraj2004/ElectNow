# ElectNow

**ElectNow** is a React-based election management platform that allows users to create, participate in, and manage custom elections. The project leverages Supabase as the backend database and is deployed on [Vercel](https://elect-now.vercel.app/). 

## **Features**

### Core Features:
- **Create Elections**: Users can create elections with customizable positions and members.
- **Voting System**: Voters can cast their votes for a single member in each position, ensuring fairness.
- **Result Display**: Real-time result updates and winner declaration for each position.
- **User Dashboard**: Displays recently visited elections and provides easy navigation to ongoing elections.
- **Authentication**: Google Sign-In for secure access.
- **Timers**: Countdown timers for voting deadlines, ensuring time-bound voting.

### Additional Features:
- **Dynamic Routing**: Navigate seamlessly to election pages and voting pages using room codes.
- **Caching**: Avoid redundant database requests with local caching.
- **Responsive Design**: Fully optimized for mobile and desktop devices.

---

## **Live Demo**

Access the live project here: [ElectNow](https://elect-now.vercel.app/)

---

## **Tech Stack**

### Frontend:
- **React**: Built with React for a dynamic and seamless user experience.
- **Vite**: Fast development environment with optimized build tools.
- **Tailwind CSS**: For responsive and modern styling.

### Backend:
- **Supabase**: PostgreSQL-based backend for real-time data storage and APIs.

### Deployment:
- **Vercel**: Continuous integration and deployment.

---

## **Setup and Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/kiranraj2004/elect-now.git
   cd elect-now
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_REACT_APP_DOMIN=your-auth0-domin
   VITE_REACT_CLIENT_ID=your-client-id
   ```

4. Run the project locally:
   ```bash
   npm run dev
   ```

5. Open in the browser:
   Visit `http://localhost:5173` to see the app.

---

## **Project Flow**

1. **User Authentication**: Log in using Google Sign-In.
2. **Dashboard**: 
   - Create new elections.
   - Enter room codes to join ongoing elections.
   - View recently visited elections.
3. **Create Election**: 
   - Input election name, positions, members, and voting deadlines.
   - Store election data in Supabase.
4. **Vote**:
   - Navigate to the voting page using the room code.
   - Cast votes for members in each position.
5. **Results**:
   - Real-time updates of results.
   - Display winners for each position after the deadline.

---

## **Key Functionalities**

### Create Election:
- Input fields for positions, members, and result deadlines (days, hours, minutes).
- Validation for required fields.

### Voting Page:
- Cast a vote for a single member in each position.
- Prevent multiple votes for the same position.

### Countdown Timer:
- Countdown for voting deadlines.
- Automatically disables voting after the deadline.

### Results:
- Display total votes for each member.
- Highlight winners dynamically.

---

## **Deployment**

The project is deployed on **Vercel** for seamless hosting and scalability.

### Deployment Steps:
1. Connect your GitHub repository to Vercel.
2. Add the necessary environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
3. Deploy the project.

---

## **Contributing**

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For queries or feedback, please reach out to **Kiran Raj** at [kiranrajb5882@gmail.com](mailto:your-email@example.com).