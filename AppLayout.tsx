"""Agrega documentos (adjuntos como estados de cuenta, contratos escaneados,
comprobantes, etc.) que pueden vincularse a una o más propiedades.

Revision ID: 0002_documentos
Revises: 0001_initial_schema
Create Date: 2026-09-04
"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0002_documentos"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE documentos (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre_archivo  VARCHAR(255) NOT NULL,
            tipo_contenido  VARCHAR(150) NOT NULL,
            tamano_bytes    INTEGER NOT NULL CHECK (tamano_bytes >= 0),
            descripcion     TEXT,
            contenido       BYTEA NOT NULL,
            creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    """)

    op.execute("""
        CREATE TABLE documento_propiedades (
            documento_id    UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
            propiedad_id    UUID NOT NULL REFERENCES propiedades(id) ON DELETE CASCADE,
            PRIMARY KEY (documento_id, propiedad_id)
        );
    """)
    op.execute("CREATE INDEX idx_documento_propiedades_propiedad_id ON documento_propiedades(propiedad_id);")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS documento_propiedades CASCADE;")
    op.execute("DROP TABLE IF EXISTS documentos CASCADE;")
