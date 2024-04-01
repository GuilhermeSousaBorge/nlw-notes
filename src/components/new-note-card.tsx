import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface  newNoteProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export default function NewCard({ onNoteCreated }: newNoteProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [contentNote, setContentNote] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    const handleStartEditor = () =>{
        setShouldShowOnboarding(false)
    }
    const handleContentChanged = (event:ChangeEvent<HTMLTextAreaElement>) =>{
        setContentNote(event.target.value)
        console.log(event.target.value)
        if(event.target.value === ''){
            setShouldShowOnboarding(true)
        }
    }
    const handleSaveNote = (event: FormEvent) =>{
        if(contentNote === ''){
            toast.error('Por favor, insira uma nota',{position: 'top-right'})
            return
        }
        onNoteCreated(contentNote)
        toast.success('Nota salva com sucesso!',{position: 'top-right'})
        setContentNote('')
        setShouldShowOnboarding(true)
        event.preventDefault()
    }

    const handleStartRecording = () => {
        const isSpeechRecognitionIsAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        if(!isSpeechRecognitionIsAvailable){
            toast.error('Navegador não suporta o reconhecimento de fala', {position: 'top-right'})
            return
        }
        setIsRecording(true)
        setShouldShowOnboarding(false)
        const SpeechRegonitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        speechRecognition = new SpeechRegonitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            // console.log(event)
            const transcription = Array.from(event.results).reduce((text, result) => { return text.concat(result[0].transcript) },'')
            setContentNote(transcription)
        }
        speechRecognition.onerror = (event) => {
            console.error(event)
        }
        speechRecognition.start()
    }

    const handleStoptRecording = () => {
        setIsRecording(false)

        speechRecognition?.stop()
    }

    return(
        <>
            <Dialog.Root>
                <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col text-left gapy-3 outline-none hover:ring-2  focus-visible:ring-lime-400'>
                    <span className='text-sm font-medium text-slate-200'>adicionar nota</span>
                    <p className='text-sm leading-6 text-slate-400'>Grave uma nota em audio que será convertida em texto</p>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className='fixed bg-black/60 inset-0'/>
                        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none'>
                            <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400'>
                                <X className='size-5'/>
                            </Dialog.Close>
                            <form className='flex flex-1 flex-col h-full'>
                                <div className='flex flex-1 flex-col gap-3 p-5'>
                                    <span className='text-sm font-medium text-slate-400'>
                                        Adicionar nota
                                    </span>
                                    {shouldShowOnboarding ? 
                                        (<p className='text-sm leading-6 text-slate-400'>
                                            Começe <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota em audio</button> ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texato</button>
                                        </p>)
                                        :
                                        (<textarea 
                                            autoFocus
                                            className='text-sm leading-6 text-slate-400 bg-transparent outline-none rezine-none flex-1'
                                            onChange={handleContentChanged}
                                            value={contentNote}
                                            >
                                        </textarea>)
                                    }
                                </div>
                                {isRecording ? (
                                        <button 
                                            type='button'
                                            onClick={handleStoptRecording}
                                            className='w-full flex justify-center items-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                                                <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                                            Gravando (Clique para interromper)
                                        </button>
                                    ) : (
                                        <button 
                                            type='button'
                                            onClick={handleSaveNote}
                                            className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                                            Salvar nota
                                        </button>
                                    )}
                                {/* <button 
                                    type='submit'
                                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                                    Salvar nota
                                </button> */}
                            </form>
                        </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}