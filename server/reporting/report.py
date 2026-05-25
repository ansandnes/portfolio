import os
from jinja2 import Template
from weasyprint import HTML


def generate_pdf(df, output_dir):
    total_kwh = df["kwh"].sum()
    total_cost = df["total_cost"].sum()

    html_template = """
    <html>
    <body>
        <h1>Energy Report</h1>
        <p>Total kWh: {{ total_kwh }}</p>
        <p>Total Cost: {{ total_cost }}</p>
    </body>
    </html>
    """

    template = Template(html_template)
    html_content = template.render(
        total_kwh=total_kwh,
        total_cost=total_cost
    )

    pdf_path = os.path.join(output_dir, "report.pdf")

    HTML(string=html_content).write_pdf(pdf_path)

    return pdf_path