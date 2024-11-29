import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Navbar() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch data from Supabase
  const fetchPersons = async () => {
    const { data, error } = await supabase.from('persons').select('*');
    if (error) console.error('Error fetching data:', error);
    else setPersons(data);
  };

  // Create or Update a person
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update operation
      const { error } = await supabase
        .from('persons')
        .update({ name, gender })
        .eq('id', editingId);

      if (error) console.error('Error updating person:', error);
      else console.log('Person updated successfully!');
    } else {
      // Create operation
      const { error } = await supabase
        .from('persons')
        .insert([{ name, gender }]);

      if (error) console.error('Error creating person:', error);
      else console.log('Person created successfully!');
    }
    setName('');
    setGender('');
    setEditingId(null);
    fetchPersons();
  };

  // Delete a person
  const handleDelete = async (id) => {
    const { error } = await supabase.from('persons').delete().eq('id', id);
    if (error) console.error('Error deleting person:', error);
    else console.log('Person deleted successfully!');
    fetchPersons();
  };

  // Edit a person
  const handleEdit = (person) => {
    setName(person.name);
    setGender(person.gender);
    setEditingId(person.id);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <div className="App">
      <h1>Person Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h2>Person List</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} ({person.gender})
            <button onClick={() => handleEdit(person)}>Edit</button>
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
