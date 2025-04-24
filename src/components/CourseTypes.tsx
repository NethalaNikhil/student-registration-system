'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CourseTypes() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [newCourseType, setNewCourseType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchCourseTypes = async () => {
    const { data, error } = await supabase.from('course_types').select();
    if (!error) setCourseTypes(data);
  };

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  const handleAdd = async () => {
    if (!newCourseType) return;
    const { error } = await supabase.from('course_types').insert({ name: newCourseType });
    if (!error) {
      setNewCourseType('');
      fetchCourseTypes();
    }
  };

  const handleDelete = async (id: number) => {
    await supabase.from('course_types').delete().eq('id', id);
    fetchCourseTypes();
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setEditValue(type.name);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await supabase.from('course_types').update({ name: editValue }).eq('id', editingId);
    setEditingId(null);
    setEditValue('');
    fetchCourseTypes();
  };

  return (
    <div className="p-4  border rounded">
      <h2 className="text-xl font-bold mb-4">Course Types</h2>
      <div className="mb-4">
        <input
          value={newCourseType}
          onChange={(e) => setNewCourseType(e.target.value)}
          placeholder="New course type"
          className="border p-2 mr-2 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      {courseTypes.map((type) => (
        <div key={type.id} className="flex justify-between items-center mb-2">
          {editingId === type.id ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="border p-1 rounded"
            />
          ) : (
            <span>{type.name}</span>
          )}
          <div className="flex gap-2">
            {editingId === type.id ? (
              <>
                <button onClick={handleUpdate} className="text-green-600 hover:underline">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-600 hover:underline">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleEdit(type)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(type.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
