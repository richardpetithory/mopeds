import os
import uuid


def generate_upload_filename(instance, filename):
    ext = filename.split(".")[-1]
    new_filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join(getattr(instance, "upload_to") or "", new_filename)
