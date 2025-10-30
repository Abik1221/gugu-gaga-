from pydantic import BaseModel, Field
from typing import Optional, List


class ThreadCreate(BaseModel):
    title: Optional[str] = None


class ThreadOut(BaseModel):
    id: int
    title: Optional[str] = None


class MessageCreate(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=300)


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
