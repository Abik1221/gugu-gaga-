from pydantic import BaseModel
from typing import Optional, List


class ThreadCreate(BaseModel):
    title: Optional[str] = None


class ThreadOut(BaseModel):
    id: int
    title: Optional[str] = None


class MessageCreate(BaseModel):
    prompt: str


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
