import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.documento import documento as crud_documento
from app.models.documento import Documento
from app.schemas.documento import DocumentoRead

router = APIRouter(prefix="/documentos", tags=["Documentos"])

# Límite generoso para PDFs/Word/Excel de estados de cuenta, contratos
# escaneados, etc. El contenido se guarda directamente en Postgres.
TAMANO_MAXIMO_BYTES = 20 * 1024 * 1024  # 20 MB


def _to_read(db_obj: Documento) -> DocumentoRead:
    return DocumentoRead(
        id=db_obj.id,
        nombre_archivo=db_obj.nombre_archivo,
        tipo_contenido=db_obj.tipo_contenido,
        tamano_bytes=db_obj.tamano_bytes,
        descripcion=db_obj.descripcion,
        creado_en=db_obj.creado_en,
        propiedad_ids=[p.id for p in db_obj.propiedades],
    )


@router.get("/", response_model=list[DocumentoRead])
def listar_documentos(
    propiedad_id: uuid.UUID = Query(..., description="Filtra los documentos vinculados a esta propiedad"),
    db: Session = Depends(get_db),
):
    docs = crud_documento.get_multi_by_propiedad(db, propiedad_id=propiedad_id)
    return [_to_read(d) for d in docs]


@router.post("/", response_model=DocumentoRead, status_code=status.HTTP_201_CREATED)
async def subir_documento(
    archivo: UploadFile = File(...),
    propiedad_ids: list[uuid.UUID] = Form(..., description="IDs de las propiedades a las que aplica"),
    descripcion: str | None = Form(default=None),
    db: Session = Depends(get_db),
):
    if not propiedad_ids:
        raise HTTPException(status_code=400, detail="Selecciona al menos una propiedad")

    contenido = await archivo.read()
    if len(contenido) > TAMANO_MAXIMO_BYTES:
        raise HTTPException(status_code=400, detail="El archivo excede el tamaño máximo permitido (20 MB)")
    if not contenido:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    db_obj = crud_documento.create(
        db,
        nombre_archivo=archivo.filename or "documento",
        tipo_contenido=archivo.content_type or "application/octet-stream",
        contenido=contenido,
        descripcion=descripcion,
        propiedad_ids=propiedad_ids,
    )
    return _to_read(db_obj)


@router.get("/{documento_id}/descargar")
def descargar_documento(documento_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_documento.get(db, documento_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return Response(
        content=db_obj.contenido,
        media_type=db_obj.tipo_contenido,
        headers={"Content-Disposition": f'inline; filename="{db_obj.nombre_archivo}"'},
    )


@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_documento(documento_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_documento.remove(db, id=documento_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
