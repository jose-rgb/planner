import { FormEvent } from "react";
import { AtSign, Plus, X } from "lucide-react"
import { Button } from "../../components/button"

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

interface ManageGuestsModalProps {
    participants: Participant[];
    closeManageGuestsModal: () => void;
    addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void;
    removeEmailFromInvites: (participantId: string) => void;
}

export function ManageGuestsModal({participants, closeManageGuestsModal, addNewEmailToInvite, removeEmailFromInvites}: ManageGuestsModalProps) {
    return(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">Gerenciar convidados</h2>
            <button>
              <X className="size-5 text-zinc-400" onClick={closeManageGuestsModal} />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Adicione ou remova convidados.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {participants.map(participant => {
            return (
              <div key={participant.id} className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2">
                <span className="text-zinc-300">{participant.email}</span>
                <button type="button">
                  <X onClick={() => removeEmailFromInvites(participant.id)} className="size-4 text-zinc-400" />
                </button>
              </div>
              )
            }
          )}
        </div>
        
        <div className="w-full h-px bg-zinc-800" />

        <form onSubmit={addNewEmailToInvite} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
          <div className="px-2 flex items-center flex-1 gap-2">
            <AtSign className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite o email do convidado"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <Button type="submit">
            Convidar
            <Plus className="size-5" />
          </Button>
        </form>
      </div>
    </div>
    )
}