from app.crud.base import CRUDBase
from app.models.inquilino import Inquilino
from app.schemas.inquilino import InquilinoCreate, InquilinoUpdate

inquilino = CRUDBase[Inquilino, InquilinoCreate, InquilinoUpdate](Inquilino)
