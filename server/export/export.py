import os


def export_csv_json(df, output_dir):
    csv_path = os.path.join(output_dir, "data.csv")
    json_path = os.path.join(output_dir, "data.json")

    df.to_csv(csv_path, index=False)
    df.to_json(json_path, orient="records")

    return csv_path, json_path