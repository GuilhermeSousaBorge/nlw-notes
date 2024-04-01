import { ChangeEvent, useState } from 'react'
import logo from './assets/Logo.svg'
import NewCard from './components/new-note-card'
import NoteCart from './components/note-card'

interface Note {
  id: string
  content: string
  date: Date
}
export default function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {

    const storedNotes = localStorage.getItem('notes')
    if(storedNotes){
      console.log('achou uma nota')
      return JSON.parse(storedNotes)
    }

    return []
  })

  const onNoteCreated = (content: string) => {
    const newNote = { id: crypto.randomUUID(), content, date: new Date(), }
    setNotes([newNote, ...notes])
    localStorage.setItem('notes', JSON.stringify([newNote, ...notes]))
  }

  const onNoteDelete = (id: string) => {
    const newNotesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(newNotesArray)
    localStorage.setItem('notes', JSON.stringify(newNotesArray))
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const filterdNotes = search !== ' '
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes

  return(
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>
      <img src={logo}/>

      <form action="">
        <input 
          className='w-full bg-transparent text-3xl font-semibold -tracking-tight outline-none placeholder:text-slate-500' 
          type="text" 
          placeholder='Busque suas notas...'
          onChange={handleSearch}
          />
      </form>
      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewCard onNoteCreated={onNoteCreated}/>
        {filterdNotes.map((el, idx) => {
          return(
            <NoteCart key={idx} note={el} onNoteDelete={onNoteDelete}/>
          )
        })}
      </div>
    </div>
  )
}