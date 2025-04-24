'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Define types for data structures
interface Offering {
  id: number
  course_id: number
  course_type_id: number
}

interface Course {
  id: number
  name: string
}

interface CourseType {
  id: number
  name: string
}

interface Registration {
  id: number
  student: string
  offering_id: number
}

export default function StudentRegistrations() {
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [studentName, setStudentName] = useState('')
  const [selectedOffering, setSelectedOffering] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: o, error: oError } = await supabase.from('offerings').select('*')
      const { data: c, error: cError } = await supabase.from('courses').select('*')
      const { data: t, error: tError } = await supabase.from('course_types').select('*')
      const { data: r, error: rError } = await supabase.from('registrations').select('*')

      if (oError || cError || tError || rError) {
        console.error('Error fetching data:', oError || cError || tError || rError)
        return
      }

      // Map offering to match our local interface
      const mappedOfferings: Offering[] = o?.map((offering) => ({
        id: offering.id,
        course_id: offering.course, // DB column: course
        course_type_id: offering.course_type, // DB column: course_type
      })) || []

      setOfferings(mappedOfferings)
      if (c) setCourses(c)
      if (t) setCourseTypes(t)
      if (r) setRegistrations(r)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const registerStudent = async () => {
    if (!studentName || !selectedOffering) {
      console.error('Missing student name or offering')
      return
    }

    const { error } = await supabase
      .from('registrations')
      .insert([
        {
          student: studentName, // Changed from 'student_name' to 'student'
          offering_id: selectedOffering,
        },
      ])

    if (error) {
      console.error('Error registering student:', error.message)
    } else {
      setStudentName('')
      setSelectedOffering(null)
      fetchData()
    }
  }

  const getOfferingLabel = (offeringId: number) => {
    const offer = offerings.find((o) => o.id === offeringId)
    if (!offer) return 'Unknown Offering'

    const course = courses.find((c) => c.id === offer.course_id)
    const courseType = courseTypes.find((t) => t.id === offer.course_type_id)

    return `${courseType?.name || 'Unknown Course Type'} - ${course?.name || 'Unknown Course'}`
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Student Registration</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Student Name"
          className="border p-2 rounded"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={selectedOffering ?? ''}
          onChange={(e) => setSelectedOffering(Number(e.target.value))}
        >
          <option value="">Select Course Offering</option>
          {offerings.length === 0 ? (
            <option disabled>No offerings available</option>
          ) : (
            offerings.map((o) => (
              <option key={o.id} value={o.id}>
                {getOfferingLabel(o.id)}
              </option>
            ))
          )}
        </select>
        <button onClick={registerStudent} className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Registered Students</h3>
        <ul>
          {registrations.map((r) => (
            <li key={r.id}>
              {r.student} — {getOfferingLabel(r.offering_id)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
