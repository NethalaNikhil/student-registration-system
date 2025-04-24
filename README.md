# Student Registration System

A simple web application built with **React** and **Next.js** for managing student registrations. This application allows users to:
- Register students for various courses and course offerings.
- Display a list of registered students.
- Manage course types and course offerings.

The application uses **Supabase** for the backend and **Vercel** for hosting.

---

## Features
- **Student Registration**: Allows the registration of students to specific courses and course offerings.
- **List Registered Students**: Displays a list of students who have been registered, including their names and selected offerings.
- **Responsive Design**: Built with **Tailwind CSS** for a responsive UI.
- **Supabase Integration**: Uses Supabase to store and retrieve registration data, course offerings, courses, and course types.

---

## Technologies Used
- **React**: For building the frontend UI.
- **Next.js**: For server-side rendering and routing.
- **Tailwind CSS**: For styling the UI with a utility-first approach.
- **Supabase**: For backend database management.
- **Vercel**: For deploying the application.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://yarnpkg.com/) (Optional but recommended)
- A **Supabase** account (for the database setup)

### Steps to Run Locally
1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/NethalaNikhil/student-registration-system.git
    ```

2. Navigate into the project folder:

    ```bash
    cd student-registration-system
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

    Or if you are using Yarn:

    ```bash
    yarn install
    ```

4. Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

    You can get these values from your Supabase project.

5. Run the application locally:

    ```bash
    npm run dev
    ```

    Or with Yarn:

    ```bash
    yarn dev
    ```

    The app will be available at `http://localhost:3000`.

---

## Deployment

This project is deployed on **Vercel**. Once the repository is connected to Vercel, the app is automatically deployed. You can find the live demo at:

[Live Demo](https://student-registration-system.vercel.app)

---

## Database Schema

The project uses **Supabase** as the backend for storing data. Below are the tables used in the project:

### `registrations`
- **Columns**:
  - `id`: Auto-incrementing primary key.
  - `student`: The name of the student.
  - `offering_id`: Foreign key referencing the `offerings` table.

### `offerings`
- **Columns**:
  - `id`: Auto-incrementing primary key.
  - `course`: Foreign key referencing the `courses` table.
  - `course_type`: Foreign key referencing the `course_types` table.

### `courses`
- **Columns**:
  - `id`: Auto-incrementing primary key.
  - `name`: The name of the course.

### `course_types`
- **Columns**:
  - `id`: Auto-incrementing primary key.
  - `name`: The name of the course type (e.g., "Full-Time", "Part-Time").

---

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and create a pull request. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Open a pull request.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgments
- [Supabase](https://supabase.io/) for providing an open-source backend solution.
- [Vercel](https://vercel.com/) for easy deployment.
- [Tailwind CSS](https://tailwindcss.com/) for responsive design.
