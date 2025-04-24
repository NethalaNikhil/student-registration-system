import CourseTypes from "@/components/CourseTypes";
import Courses from "@/components/Courses";
import CourseOfferings from "@/components/CourseOfferings";
import StudentRegistrations from "@/components/StudentRegistrations";

export default function Home() {
  return (
    <>
    <p className="bg-white text-5xl text-black font-medium ps-4 font-serif">Student Registration</p>
    <main className="min-h-screen p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white text-black">
      <CourseTypes />
      <Courses />
      <CourseOfferings />
      <StudentRegistrations />
    </main>
    </>
  );
}
