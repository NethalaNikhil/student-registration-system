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
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
    fetchRegistrations()

    const channel = supabase
      .channel('offerings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offerings',
        },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchData = async () => {
    try {
      const { data: o, error: oError } = await supabase.from('offerings').select('*')
      const { data: c, error: cError } = await supabase.from('courses').select('*')
      const { data: t, error: tError } = await supabase.from('course_types').select('*')

      if (oError || cError || tError) {
        console.error('Error fetching data:', oError || cError || tError)
        return
      }

      const mappedOfferings: Offering[] = o?.map((offering) => ({
        id: offering.id,
        course_id: offering.course,
        course_type_id: offering.course_type,
      })) || []

      setOfferings(mappedOfferings)
      if (c) setCourses(c)
      if (t) setCourseTypes(t)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const { data: r, error: rError } = await supabase.from('registrations').select('*')
      if (rError) {
        console.error('Error fetching registrations:', rError)
      } else {
        setRegistrations(r || [])
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const registerStudent = async () => {
    if (!studentName || !selectedOffering) {
      console.error('Missing student name or offering')
      return
    }

    if (editingId) {
      // Update existing registration
      const { error } = await supabase
        .from('registrations')
        .update({
          student: studentName,
          offering_id: selectedOffering,
        })
        .eq('id', editingId)

      if (error) {
        console.error('Error updating student:', error.message)
      } else {
        resetForm()
        fetchRegistrations()
      }
    } else {
      // Insert new registration
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            student: studentName,
            offering_id: selectedOffering,
          },
        ])

      if (error) {
        console.error('Error registering student:', error.message)
      } else {
        resetForm()
        fetchRegistrations()
      }
    }
  }

  const editRegistration = (registration: Registration) => {
    setEditingId(registration.id)
    setStudentName(registration.student)
    setSelectedOffering(registration.offering_id)
  }

  const deleteRegistration = async (id: number) => {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting registration:', error.message)
    } else {
      fetchRegistrations()
    }
  }

  const resetForm = () => {
    setStudentName('')
    setSelectedOffering(null)
    setEditingId(null)
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
      <div className="flex flex-wrap gap-2 mb-4">
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
        <button
          onClick={registerStudent}
          className={`px-4 py-2 rounded ${editingId ? 'bg-blue-600' : 'bg-green-600'} text-white`}
        >
          {editingId ? 'Update' : 'Register'}
        </button>
        {editingId && (
          <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Registered Students</h3>
        <ul className="space-y-2">
          {registrations.map((r) => (
            <li key={r.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                {r.student} — {getOfferingLabel(r.offering_id)}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => editRegistration(r)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRegistration(r.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
