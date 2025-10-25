from __future__ import annotations

import os
import uuid
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/uploads", tags=["admin"])


@router.post("/kyc")
async def upload_kyc_document(
    file: UploadFile = File(...),
    _rl=Depends(rate_limit_user("upload_kyc_doc")),
):
    # Basic validation
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file provided")
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".jpg", ".jpeg", ".png"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
    size = 0
    try:
        content = await file.read()
        size = len(content)
        if size > 10 * 1024 * 1024:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 10MB)")
        # Save
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        out_dir = os.path.join(base, "uploads", "kyc")
        os.makedirs(out_dir, exist_ok=True)
        token = uuid.uuid4().hex
        out_path = os.path.join(out_dir, f"{token}{ext}")
        with open(out_path, "wb") as f:
            f.write(content)
        # Return internal path (not public URL)
        rel = f"uploads/kyc/{token}{ext}"
        return {"path": rel, "size": size, "filename": file.filename}
    finally:
        await file.close()
