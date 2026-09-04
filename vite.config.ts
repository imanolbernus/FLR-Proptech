import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Field, Input } from "@/components/ui/FormField";
import { documentosApi } from "@/api/documentos";
import { ApiError } from "@/api/client";
import { qk, useDocumentosByPropiedad } from "@/hooks/useEntities";
import { formatBytes } from "@/utils/format";
import type { Propiedad } from "@/types/entities";

const dateFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" });

export function DocumentosSection({
  propiedad,
  todasLasPropiedades,
}: {
  propiedad: Propiedad;
  todasLasPropiedades: Propiedad[];
}) {
  const { data, isLoading, error } = useDocumentosByPropiedad(propiedad.id);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [otrasPropiedades, setOtrasPropiedades] = useState<string[]>([]);

  const otrasOpciones = todasLasPropiedades.filter((p) => p.id !== propiedad.id);

  const invalidateAfectadas = (propiedadIds: string[]) => {
    const ids = new Set([propiedad.id, ...propiedadIds]);
    ids.forEach((id) => queryClient.invalidateQueries({ queryKey: qk.documentosPorPropiedad(id) }));
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error("Selecciona un archivo");
      return documentosApi.upload({
        archivo: file,
        propiedadIds: [propiedad.id, ...otrasPropiedades],
        descripcion: descripcion || undefined,
      });
    },
    onSuccess: (doc) => {
      invalidateAfectadas(doc.propiedad_ids);
      setShowForm(false);
      setDescripcion("");
      setOtrasPropiedades([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => documentosApi.remove(id),
    onSuccess: (_void, id) => {
      const doc = data?.find((d) => d.id === id);
      invalidateAfectadas(doc?.propiedad_ids ?? []);
    },
  });

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-primary">Documentos</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancelar" : "+ Subir documento"}
        </Button>
      </div>

      {showForm && (
        <form
          className="mb-4 rounded-lg border border-border bg-page/60 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            uploadMutation.mutate();
          }}
        >
          {uploadMutation.isError && (
            <div className="mb-3">
              <ErrorState
                message={
                  uploadMutation.error instanceof ApiError
                    ? JSON.stringify(uploadMutation.error.detail)
                    : (uploadMutation.error as Error).message
                }
              />
            </div>
          )}

          <Field label="Archivo (PDF, Word, Excel, imagen…)">
            <input
              ref={fileInputRef}
              type="file"
              required
              className="block w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            />
          </Field>

          <Field label="Descripción (opcional)">
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Estado de cuenta con corte al 3 de septiembre de 2026"
            />
          </Field>

          {otrasOpciones.length > 0 && (
            <div className="mb-1">
              <span className="mb-1 block text-sm font-medium text-ink-secondary">
                También aplica a (opcional)
              </span>
              <p className="mb-2 text-xs text-ink-muted">
                Útil cuando un mismo documento cubre varios inmuebles (ej. un inquilino con varias
                bodegas facturadas en conjunto).
              </p>
              <div className="flex flex-col gap-1.5">
                {otrasOpciones.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-ink-secondary">
                    <input
                      type="checkbox"
                      checked={otrasPropiedades.includes(p.id)}
                      onChange={(e) =>
                        setOtrasPropiedades((prev) =>
                          e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)
                        )
                      }
                    />
                    {p.nombre_referencia}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? "Subiendo…" : "Subir documento"}
            </Button>
          </div>
        </form>
      )}

      {isLoading && <LoadingState label="Cargando documentos…" />}
      {error && <ErrorState message="No se pudieron cargar los documentos." />}

      {data && data.length === 0 && !showForm && (
        <EmptyState
          title="Sin documentos"
          description="Sube el estado de cuenta, contratos escaneados o comprobantes de este inmueble."
        />
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-gridline">
          {data.map((doc) => {
            const otras = doc.propiedad_ids
              .filter((id) => id !== propiedad.id)
              .map((id) => todasLasPropiedades.find((p) => p.id === id)?.nombre_referencia)
              .filter(Boolean);
            return (
              <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-primary">{doc.nombre_archivo}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatBytes(doc.tamano_bytes)} · {dateFormatter.format(new Date(doc.creado_en))}
                    {doc.descripcion ? ` · ${doc.descripcion}` : ""}
                  </p>
                  {otras.length > 0 && (
                    <p className="mt-0.5 text-xs text-ink-muted">
                      También vinculado a: {otras.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => documentosApi.descargar(doc)}
                  >
                    Descargar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={removeMutation.isPending}
                    onClick={() => {
                      if (confirm(`¿Eliminar "${doc.nombre_archivo}"?`)) {
                        removeMutation.mutate(doc.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
