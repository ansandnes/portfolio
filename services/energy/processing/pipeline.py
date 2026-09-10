import pandas as pd
import os

from reporting.report import generate_pdf
from export.export import export_csv_json


def process_files(pdf_paths, dataset_path, output_dir):
    # Placeholder parsing (replace later)
    rows = []

    for path in pdf_paths:
        rows.append({
            "provider": "Demo Energy",
            "period_start": "2026-01-01",
            "period_end": "2026-01-31",
            "kwh": 1200,
            "total_cost": 1500
        })

    df_new = pd.DataFrame(rows)

    if dataset_path:
        df_old = pd.read_csv(dataset_path)
        df = pd.concat([df_old, df_new]).drop_duplicates()
    else:
        df = df_new

    csv_file, json_file = export_csv_json(df, output_dir)
    pdf_file = generate_pdf(df, output_dir)

    return pdf_file, csv_file, json_file