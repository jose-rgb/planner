import { FormEvent, useEffect, useState } from "react"
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Plus } from "lucide-react";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { CreateActivityModal } from "./create-activity-modal";
import { CreateImportantLinkModal } from "./create-important-link-modal";
import { ManageGuestsModal } from "./manage-guests-modal";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
  const [isCreateImportantLinkModalOpen, setIsCreateImportantLinkModalOpen] = useState(false)
  const [isManageGuestsModalOpen, setIsManageGuestsModalOpen] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])

  const { tripId } = useParams()

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  function openCreateImportantLinkModal() {
    setIsCreateImportantLinkModalOpen(true)
  }

  function closeCreateImportantLinkModal() {
    setIsCreateImportantLinkModalOpen(false)
  }

  function openManageGuestsModal() {
    setIsManageGuestsModalOpen(true)
  }

  function closeManageGuestsModal() {
    setIsManageGuestsModalOpen(false)
    window.document.location.reload()
  }

  async function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    let emailAlreadyExistys = false

    participants.map(participant => {
      if(participant.email === email) {
          emailAlreadyExistys  = true
      }
    })

    if(emailAlreadyExistys) {
      return
    }

    event.currentTarget.reset()

    const response = await api.post(`/trip/${tripId}/invites`, {
      email: email,
    })

    const newParticipant = response.data.participant

    setParticipants([
      ...participants,
      newParticipant
    ])

    console.log(participants)
  }


  async function removeEmailFromInvites(participantId: string) {
    const updatedParticipants = participants.filter(participant => participant.id !== participantId)

    setParticipants(updatedParticipants)

    await api.delete(`/participants/${participantId}`)
  }

  useEffect(() => {
    api.get(`trip/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])


  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>

            <button onClick={openCreateActivityModal} className="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>

          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks openCreateImportantLinkModal={openCreateImportantLinkModal}/>

          <div className="w-full h-px bg-zinc-800" />

          <Guests participants={participants} openManageGuestsModal={openManageGuestsModal}/>
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal 
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}

      {isCreateImportantLinkModalOpen && (
        <CreateImportantLinkModal
          closeCreateImportantLinkModal={closeCreateImportantLinkModal}
        />
      )}

      {isManageGuestsModalOpen && (
        <ManageGuestsModal 
          participants={participants}
          closeManageGuestsModal={closeManageGuestsModal}
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}
    </div>
  )
}