'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
  course_id: number
  course_type_id: number
}

export default function CourseOfferings() {
  const [courses, setCourses] = useState<Course[]>([])
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null)

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
        },
        () => {
          fetchCourses()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchData = async () => {
    fetchCourses()
    fetchTypes()
    fetchOfferings()
  }

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*')
    if (!error && data) setCourses(data)
  }

  const fetchTypes = async () => {
    const { data, error } = await supabase.from('course_types').select('*')
    if (!error && data) setCourseTypes(data)
  }

  const fetchOfferings = async () => {
    const { data, error } = await supabase.from('offerings').select('*')
    if (!error && data) {
      const mapped: Offering[] = data.map((o) => ({
        id: o.id,
        course_id: o.course,
        course_type_id: o.course_type,
      }))
      setOfferings(mapped)
    }
  }

  const handleAdd = async () => {
    if (!selectedCourse || !selectedType) {
      alert('Please select both course and type')
      return
    }

    const { data, error } = await supabase
      .from('offerings')
      .insert([{ course: selectedCourse, course_type: selectedType }])
      .select()
      .single()

    if (!error && data) {
      setOfferings((prev) => [
        ...prev,
        {
          id: data.id,
          course_id: data.course,
          course_type_id: data.course_type,
        },
      ])
      setSelectedCourse(null)
      setSelectedType(null)
    }
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('offerings').delete().eq('id', id)
    if (!error) {
      setOfferings((prev) => prev.filter((o) => o.id !== id))
    }
  }

  const getLabel = <T extends Course | CourseType>(id: number, list: T[]): string =>
    list.find((item) => item.id === id)?.name || 'N/A'

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Course Offerings</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedType ?? ''}
          onChange={(e) => setSelectedType(Number(e.target.value))}
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedCourse ?? ''}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {offerings.map((o) => (
          <div
            key={o.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {getLabel(o.course_type_id, courseTypes)} - {getLabel(o.course_id, courses)}
            </span>
            <button
              onClick={() => handleDelete(o.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
