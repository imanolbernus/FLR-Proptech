"""Esquema inicial: usuarios, propiedades, inquilinos, contratos, pagos,
tickets_mantenimiento (Fase 1). El DDL es el mismo que app/db/schema.sql,
ya validado corriéndolo contra Postgres 16.

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-20
"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')

    op.execute("""
        CREATE TYPE user_role AS ENUM ('admin', 'property_manager', 'viewer');
    """)
    op.execute("""
        CREATE TYPE property_type AS ENUM (
            'bodega', 'oficina', 'bodega_oficina', 'local_comercial',
            'nave_industrial', 'terreno', 'departamento', 'casa', 'otro'
        );
    """)
    op.execute("""
        CREATE TYPE property_status AS ENUM (
            'disponible', 'ocupada', 'en_mantenimiento', 'inactiva'
        );
    """)
    op.execute("""
        CREATE TYPE tenant_type AS ENUM ('persona_fisica', 'persona_moral');
    """)
    op.execute("""
        CREATE TYPE contract_status AS ENUM (
            'borrador', 'activo', 'vencido', 'renovado', 'terminado_anticipadamente'
        );
    """)
    op.execute("""
        CREATE TYPE payment_status AS ENUM (
            'pendiente', 'pagado', 'atrasado', 'pago_parcial', 'cancelado'
        );
    """)
    op.execute("""
        CREATE TYPE payment_method AS ENUM (
            'transferencia', 'efectivo', 'cheque', 'deposito_bancario', 'tarjeta', 'otro'
        );
    """)
    op.execute("""
        CREATE TYPE ticket_priority AS ENUM ('baja', 'media', 'alta', 'urgente');
    """)
    op.execute("""
        CREATE TYPE ticket_status AS ENUM (
            'abierto', 'en_proceso', 'resuelto', 'cancelado'
        );
    """)

    op.execute("""
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)

    op.execute("""
        CREATE TABLE usuarios (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre          VARCHAR(150) NOT NULL,
            email           VARCHAR(255) NOT NULL UNIQUE,
            password_hash   VARCHAR(255) NOT NULL,
            rol             user_role NOT NULL DEFAULT 'property_manager',
            telefono        VARCHAR(20),
            activo          BOOLEAN NOT NULL DEFAULT true,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    """)
    op.execute("""
        CREATE TRIGGER trg_usuarios_updated_at
            BEFORE UPDATE ON usuarios
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)

    op.execute("""
        CREATE TABLE propiedades (
            id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            usuario_id          UUID REFERENCES usuarios(id) ON DELETE SET NULL,
            nombre_referencia   VARCHAR(150) NOT NULL,
            calle               VARCHAR(200) NOT NULL,
            numero_exterior     VARCHAR(20),
            numero_interior     VARCHAR(20),
            colonia             VARCHAR(150),
            ciudad              VARCHAR(100) NOT NULL DEFAULT 'Ciudad de México',
            estado_republica    VARCHAR(100) NOT NULL DEFAULT 'Ciudad de México',
            codigo_postal       VARCHAR(10),
            pais                VARCHAR(60) NOT NULL DEFAULT 'México',
            tipo                property_type NOT NULL,
            estado_ocupacion    property_status NOT NULL DEFAULT 'disponible',
            superficie_m2       NUMERIC(10,2) CHECK (superficie_m2 IS NULL OR superficie_m2 > 0),
            renta_base          NUMERIC(12,2) NOT NULL CHECK (renta_base >= 0),
            renta_incluye_iva   BOOLEAN NOT NULL DEFAULT true,
            notas               TEXT,
            created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    """)
    op.execute("CREATE INDEX idx_propiedades_usuario_id ON propiedades(usuario_id);")
    op.execute("CREATE INDEX idx_propiedades_tipo ON propiedades(tipo);")
    op.execute("CREATE INDEX idx_propiedades_estado_ocupacion ON propiedades(estado_ocupacion);")
    op.execute("""
        CREATE TRIGGER trg_propiedades_updated_at
            BEFORE UPDATE ON propiedades
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)

    op.execute("""
        CREATE TABLE inquilinos (
            id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tipo_persona        tenant_type NOT NULL DEFAULT 'persona_fisica',
            nombre_razon_social VARCHAR(255) NOT NULL,
            rfc                 VARCHAR(13),
            representante_legal VARCHAR(255),
            email               VARCHAR(255),
            telefono            VARCHAR(20),
            direccion           TEXT,
            notas               TEXT,
            created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    """)
    op.execute("CREATE INDEX idx_inquilinos_rfc ON inquilinos(rfc);")
    op.execute("CREATE INDEX idx_inquilinos_nombre ON inquilinos(nombre_razon_social);")
    op.execute("""
        CREATE TRIGGER trg_inquilinos_updated_at
            BEFORE UPDATE ON inquilinos
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)

    op.execute("""
        CREATE TABLE contratos (
            id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            propiedad_id                UUID NOT NULL REFERENCES propiedades(id) ON DELETE RESTRICT,
            inquilino_id                UUID NOT NULL REFERENCES inquilinos(id) ON DELETE RESTRICT,
            fecha_inicio                DATE NOT NULL,
            fecha_fin                   DATE NOT NULL,
            renta_mensual               NUMERIC(12,2) NOT NULL CHECK (renta_mensual >= 0),
            renta_incluye_iva           BOOLEAN NOT NULL DEFAULT true,
            deposito_garantia           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (deposito_garantia >= 0),
            penalizacion_mora_diaria    NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (penalizacion_mora_diaria >= 0),
            ajuste_indexado_inpc        BOOLEAN NOT NULL DEFAULT true,
            margen_ajuste_pp            NUMERIC(5,2),
            uso_permitido               VARCHAR(255),
            jurisdiccion                VARCHAR(150),
            estado                      contract_status NOT NULL DEFAULT 'activo',
            archivo_url                 TEXT,
            notas                       TEXT,
            created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT chk_contrato_fechas CHECK (fecha_fin > fecha_inicio)
        );
    """)
    op.execute("CREATE INDEX idx_contratos_propiedad_id ON contratos(propiedad_id);")
    op.execute("CREATE INDEX idx_contratos_inquilino_id ON contratos(inquilino_id);")
    op.execute("CREATE INDEX idx_contratos_estado ON contratos(estado);")
    op.execute("CREATE INDEX idx_contratos_fecha_fin ON contratos(fecha_fin);")
    op.execute("""
        CREATE TRIGGER trg_contratos_updated_at
            BEFORE UPDATE ON contratos
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)
    op.execute("""
        CREATE UNIQUE INDEX uq_contrato_activo_por_propiedad
            ON contratos(propiedad_id)
            WHERE estado = 'activo';
    """)

    op.execute("""
        CREATE TABLE pagos (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            contrato_id     UUID NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
            monto           NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
            fecha_vencimiento DATE NOT NULL,
            fecha_pago      DATE,
            estado          payment_status NOT NULL DEFAULT 'pendiente',
            metodo_pago     payment_method,
            comprobante_url TEXT,
            notas           TEXT,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT chk_pago_fecha_pago CHECK (
                (estado = 'pagado' AND fecha_pago IS NOT NULL)
                OR (estado <> 'pagado')
            )
        );
    """)
    op.execute("CREATE INDEX idx_pagos_contrato_id ON pagos(contrato_id);")
    op.execute("CREATE INDEX idx_pagos_estado ON pagos(estado);")
    op.execute("CREATE INDEX idx_pagos_fecha_vencimiento ON pagos(fecha_vencimiento);")
    op.execute("""
        CREATE TRIGGER trg_pagos_updated_at
            BEFORE UPDATE ON pagos
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)

    op.execute("""
        CREATE TABLE tickets_mantenimiento (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            propiedad_id    UUID NOT NULL REFERENCES propiedades(id) ON DELETE CASCADE,
            contrato_id     UUID REFERENCES contratos(id) ON DELETE SET NULL,
            reportado_por   UUID REFERENCES usuarios(id) ON DELETE SET NULL,
            titulo          VARCHAR(200) NOT NULL,
            descripcion     TEXT NOT NULL,
            prioridad       ticket_priority NOT NULL DEFAULT 'media',
            estado          ticket_status NOT NULL DEFAULT 'abierto',
            asignado_a      VARCHAR(150),
            costo_estimado  NUMERIC(12,2),
            costo_real      NUMERIC(12,2),
            fecha_apertura  DATE NOT NULL DEFAULT CURRENT_DATE,
            fecha_cierre    DATE,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT chk_ticket_cierre CHECK (
                (estado IN ('resuelto', 'cancelado') AND fecha_cierre IS NOT NULL)
                OR (estado NOT IN ('resuelto', 'cancelado'))
            )
        );
    """)
    op.execute("CREATE INDEX idx_tickets_propiedad_id ON tickets_mantenimiento(propiedad_id);")
    op.execute("CREATE INDEX idx_tickets_estado ON tickets_mantenimiento(estado);")
    op.execute("CREATE INDEX idx_tickets_prioridad ON tickets_mantenimiento(prioridad);")
    op.execute("""
        CREATE TRIGGER trg_tickets_updated_at
            BEFORE UPDATE ON tickets_mantenimiento
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS tickets_mantenimiento CASCADE;")
    op.execute("DROP TABLE IF EXISTS pagos CASCADE;")
    op.execute("DROP TABLE IF EXISTS contratos CASCADE;")
    op.execute("DROP TABLE IF EXISTS inquilinos CASCADE;")
    op.execute("DROP TABLE IF EXISTS propiedades CASCADE;")
    op.execute("DROP TABLE IF EXISTS usuarios CASCADE;")
    op.execute("DROP FUNCTION IF EXISTS set_updated_at() CASCADE;")
    op.execute("DROP TYPE IF EXISTS ticket_status;")
    op.execute("DROP TYPE IF EXISTS ticket_priority;")
    op.execute("DROP TYPE IF EXISTS payment_method;")
    op.execute("DROP TYPE IF EXISTS payment_status;")
    op.execute("DROP TYPE IF EXISTS contract_status;")
    op.execute("DROP TYPE IF EXISTS tenant_type;")
    op.execute("DROP TYPE IF EXISTS property_status;")
    op.execute("DROP TYPE IF EXISTS property_type;")
    op.execute("DROP TYPE IF EXISTS user_role;")
