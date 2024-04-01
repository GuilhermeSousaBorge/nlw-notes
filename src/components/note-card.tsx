import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { X } from 'lucide-react'

interface NoteCardProps {
    note: {
        id: string
        content: string
        date: Date
    }
    onNoteDelete: (id: string) => void
}

export default function NoteCart({note, onNoteDelete}: NoteCardProps) {
    return(
        <>
        <Dialog.Root>
            <Dialog.Trigger className='text-left rounded-md bg-slate-800 p-5 gap-3 flex flex-col overflow-hidden relative outline-none  hover:ring-2 hover:ring-slate-600 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-400'>{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
                <p className='text-sm leading-6 text-slate-400'>
                    {note.content}
                </p>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed bg-black/60 inset-0'/>
                <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-800 md:rounded-md flex flex-col outline-none'>
                    <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400'>
                        <X className='size-5'/>
                    </Dialog.Close>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                    <span className='text-sm font-medium text-slate-400'>{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
                    <p className='text-sm leading-6 text-slate-400'>
                        {note.content}
                    </p>
                    </div>
                    <button 
                        type='button'
                        className='w-full bg-slate-700 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
                        onClick={() => onNoteDelete(note.id)}
                    >
                        Deseja <span className='text-red-500 group-hover:underline'>apagar esta nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
        </>
    )
}