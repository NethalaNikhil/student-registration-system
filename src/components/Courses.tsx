'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Course {
  id: number
  name: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*')
    if (!error && data) {
      setCourses(data)
    }
  }

  const handleAdd = async () => {
    if (!newCourse) return
    await supabase.from('courses').insert({ name: newCourse })
    setNewCourse('')
    fetchCourses()
  }

  const handleDelete = async (id: number) => {
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  const handleEdit = (course: Course) => {
    setEditingId(course.id)
    setEditValue(course.name)
  }

  const handleUpdate = async () => {
    if (!editingId) return
    await supabase.from('courses').update({ name: editValue }).eq('id', editingId)
    setEditingId(null)
    setEditValue('')
    fetchCourses()
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          className="border p-2 rounded"
          placeholder="Add course"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {courses.map((course) => (
  <div key={course.id} className="flex justify-between items-center mb-2">
    {editingId === course.id ? (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="border p-1 rounded"
      />
    ) : (
      <span>{course.name}</span>
    )}
    <div className="flex gap-2">
      {editingId === course.id ? (
        <>
          <button onClick={handleUpdate} className="text-green-600 hover:underline">Save</button>
          <button onClick={() => setEditingId(null)} className="text-gray-600 hover:underline">Cancel</button>
        </>
      ) : (
        <>
          <button onClick={() => handleEdit(course)} className="text-blue-600 hover:underline">Edit</button>
          <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:underline">Delete</button>
        </>
      )}
    </div>
  </div>
))}

    </div>
  )
}
