import { useEffect, useId, useState } from 'react'

/**
 * Caixa "📷 Adicionar foto". A API ainda não recebe imagem: a foto só aparece
 * como prévia nesta tela e não é enviada. // TODO backend: upload de foto
 */
export default function PhotoPicker({ rotulo }: { rotulo: string }) {
  const id = useId()
  const [previa, setPrevia] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa)
    }
  }, [previa])

  return (
    <label
      htmlFor={id}
      className="flex h-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-card border border-borda bg-superficie font-corpo text-[13px] text-texto-secundario hover:bg-fundo-claro"
    >
      {previa ? (
        <img src={previa} alt="Prévia da foto escolhida" className="h-full w-full object-cover" />
      ) : (
        <span>📷 {rotulo}</span>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const arquivo = e.target.files?.[0]
          if (arquivo) setPrevia(URL.createObjectURL(arquivo))
        }}
      />
    </label>
  )
}
