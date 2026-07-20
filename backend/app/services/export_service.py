"""
Data export service (assessment section 2.3): JSON, XML, CSV, Markdown, PDF.
"""
import csv
import io
import json
from xml.etree import ElementTree as ET
from xml.dom import minidom

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def _record_to_flat_dict(r: dict):
    return {
        "id": r["id"],
        "location_query": r["location_query"],
        "resolved_name": r["resolved_name"],
        "country": r.get("country"),
        "latitude": r["latitude"],
        "longitude": r["longitude"],
        "start_date": str(r["start_date"]),
        "end_date": str(r["end_date"]),
        "notes": r.get("notes") or "",
        "daily_temperatures": json.dumps(r["daily_temperatures"]),
    }


def to_json(records: list) -> bytes:
    return json.dumps(records, indent=2, default=str).encode("utf-8")


def to_csv(records: list) -> bytes:
    if not records:
        return b""
    flat = [_record_to_flat_dict(r) for r in records]
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=list(flat[0].keys()))
    writer.writeheader()
    writer.writerows(flat)
    return buf.getvalue().encode("utf-8")


def to_xml(records: list) -> bytes:
    root = ET.Element("weather_records")
    for r in records:
        rec_el = ET.SubElement(root, "record")
        flat = _record_to_flat_dict(r)
        for key, val in flat.items():
            child = ET.SubElement(rec_el, key)
            child.text = str(val)
    rough = ET.tostring(root, encoding="utf-8")
    pretty = minidom.parseString(rough).toprettyxml(indent="  ")
    return pretty.encode("utf-8")


def to_markdown(records: list) -> bytes:
    lines = ["# Weather Records Export", ""]
    if not records:
        lines.append("_No records._")
        return "\n".join(lines).encode("utf-8")

    lines.append("| ID | Location | Start | End | Notes |")
    lines.append("|---|---|---|---|---|")
    for r in records:
        lines.append(f"| {r['id']} | {r['resolved_name']} | {r['start_date']} | "
                      f"{r['end_date']} | {(r.get('notes') or '').replace('|', '/')} |")
    lines.append("")
    for r in records:
        lines.append(f"## Record {r['id']}: {r['resolved_name']}")
        lines.append("")
        lines.append("| Date | Temp Max | Temp Min |")
        lines.append("|---|---|---|")
        for d in r["daily_temperatures"]:
            lines.append(f"| {d['date']} | {d.get('temp_max')} | {d.get('temp_min')} |")
        lines.append("")
    return "\n".join(lines).encode("utf-8")


def to_pdf(records: list) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter)
    styles = getSampleStyleSheet()
    story = [Paragraph("Weather Records Export", styles["Title"]), Spacer(1, 12)]

    if not records:
        story.append(Paragraph("No records.", styles["Normal"]))
    else:
        for r in records:
            story.append(Paragraph(f"{r['resolved_name']} ({r['start_date']} to {r['end_date']})",
                                    styles["Heading2"]))
            if r.get("notes"):
                story.append(Paragraph(f"Notes: {r['notes']}", styles["Normal"]))
            table_data = [["Date", "Temp Max", "Temp Min"]]
            for d in r["daily_temperatures"]:
                table_data.append([d["date"], str(d.get("temp_max")), str(d.get("temp_min"))])
            table = Table(table_data, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563eb")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
            ]))
            story.append(table)
            story.append(Spacer(1, 16))

    doc.build(story)
    return buf.getvalue()


EXPORTERS = {
    "json": (to_json, "application/json", "json"),
    "csv": (to_csv, "text/csv", "csv"),
    "xml": (to_xml, "application/xml", "xml"),
    "markdown": (to_markdown, "text/markdown", "md"),
    "pdf": (to_pdf, "application/pdf", "pdf"),
}
