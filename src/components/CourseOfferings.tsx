'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Type definitions
interface Course {
  id: number
  name: string
}

interface CourseType {
  id: number
  name: string
}

interface Offering {
  id: number
  course: number
  course_type: number
}

export default function CourseOfferings() {
  const [courses, setCourses] = useState<Course[]>([])
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: courseData } = await supabase.from('courses').select('*')
    const { data: typeData } = await supabase.from('course_types').select('*')
    const { data: offeringData } = await supabase.from('offerings').select('*')

    if (courseData) setCourses(courseData as Course[])
    if (typeData) setCourseTypes(typeData as CourseType[])
    if (offeringData) setOfferings(offeringData as Offering[])
  }

  const handleAdd = async () => {
    if (!selectedCourse || !selectedType) {
      alert('Please select both course and type')
      return
    }

    const { error } = await supabase
      .from('offerings')
      .insert([{ course: selectedCourse, course_type: selectedType }])

    if (error) {
      console.error('Error adding offering:', error)
    } else {
      setSelectedCourse(null)
      setSelectedType(null)
      fetchAll()
    }
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('offerings').delete().eq('id', id)
    if (error) {
      console.error('Error deleting offering:', error)
    }
    fetchAll()
  }

  const getLabel = <T extends Course | CourseType>(id: number, list: T[]): string =>
    list.find(item => item.id === id)?.name || 'N/A'

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Course Offerings</h2>

      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedType ?? ''}
          onChange={e => setSelectedType(Number(e.target.value))}
        >
          <option value="">Select Course Type</option>
          {courseTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedCourse ?? ''}
          onChange={e => setSelectedCourse(Number(e.target.value))}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {offerings.map(o => (
          <div
            key={o.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {getLabel(o.course_type, courseTypes)} -{' '}
              {getLabel(o.course, courses)}
            </span>
            <button
              onClick={() => handleDelete(o.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
