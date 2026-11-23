import { useState } from 'react'
import AvisoCard from '@/components/aviso/AvisoCard'
import AvisoFormModal from '@/components/modals/AvisoFormModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Carregando, ErroBox, Vazio } from '@/components/ui/Estados'
import { useAsync } from '@/hooks/useAsync'
import { excluirAviso } from '@/services/avisos.service'
import { getMeusAvisos } from '@/services/usuarios.service'
import type { AvisoResponse } from '@/types'

// Figma: Consumidor 7 — Meus Avisos
export default function MeusAvisosPage() {
  const { data: avisos, carregando, erro, recarregar } = useAsync(() => getMeusAvisos({ size: 50 }), [])
  const [editando, setEditando] = useState<AvisoResponse | null>(null)
  const [excluindo, setExcluindo] = useState<AvisoResponse | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1092px] px-4 py-10 sm:px-8">
      <h1 className="font-rotulo text-[26px] font-extrabold text-texto">Meus avisos</h1>
      <p className="mt-1 font-corpo text-[13px] text-texto-secundario">O que você postou sobre negócios do bairro.</p>

      <div className="mt-8 flex flex-col gap-3">
        {carregando && !avisos && <Carregando />}
        {erro && <ErroBox erro={erro} onRetry={recarregar} />}
        {avisos?.length === 0 && <Vazio>Você ainda não postou nenhum aviso. Abra o perfil de um negócio e conte para os vizinhos.</Vazio>}
        {avisos?.map((aviso) => (
          <AvisoCard
            key={aviso.id}
            aviso={aviso}
            variante="meus"
            comNegocio
            acoes={
              <span className="flex gap-5 font-rotulo text-[13px] font-semibold">
                <button type="button" className="text-primaria hover:underline" onClick={() => setEditando(aviso)}>
                  Editar
                </button>
                <button type="button" className="text-perigo hover:underline" onClick={() => setExcluindo(aviso)}>
                  Excluir
                </button>
              </span>
            }
          />
        ))}
      </div>

      {editando && (
        <AvisoFormModal
          aviso={editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null)
            recarregar()
          }}
        />
      )}
      {excluindo && (
        <ConfirmModal
          titulo="Excluir este aviso?"
          texto={`“${excluindo.texto}” deixa de aparecer para os vizinhos. Isso não pode ser desfeito.`}
          rotuloConfirmar="Excluir"
          onClose={() => setExcluindo(null)}
          onConfirm={async () => {
            await excluirAviso(excluindo.negocioId, excluindo.id)
            setExcluindo(null)
            recarregar()
          }}
        />
      )}
    </div>
  )
}
