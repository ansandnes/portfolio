import os
import shutil
import tempfile
import zipfile
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from processing.pipeline import process_files

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    files: List[UploadFile] = File(...),
    dataset: Optional[UploadFile] = File(None),
):
    tmpdir = tempfile.mkdtemp()

    upload_dir = os.path.join(tmpdir, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    # Save uploaded PDFs
    pdf_paths = []
    for file in files:
        path = os.path.join(upload_dir, file.filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        pdf_paths.append(path)

    dataset_path = None
    if dataset:
        dataset_path = os.path.join(upload_dir, dataset.filename)
        with open(dataset_path, "wb") as buffer:
            shutil.copyfileobj(dataset.file, buffer)

    # Process files
    output_dir = os.path.join(tmpdir, "output")
    os.makedirs(output_dir, exist_ok=True)

    pdf_report, csv_file, json_file = process_files(
        pdf_paths,
        dataset_path,
        output_dir
    )

    # Create ZIP
    zip_path = os.path.join(tmpdir, "results.zip")

    with zipfile.ZipFile(zip_path, "w") as zipf:
        zipf.write(pdf_report, arcname="report.pdf")
        zipf.write(csv_file, arcname="data.csv")
        zipf.write(json_file, arcname="data.json")

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename="energy-analysis.zip",
        background=BackgroundTask(lambda: shutil.rmtree(tmpdir))
    )