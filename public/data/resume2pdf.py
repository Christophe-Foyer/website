# %%

import markdown
from weasyprint import HTML

# Load your markdown content
with open("resume.md", "r") as f:
    md_text = f.read()

# Convert to HTML
html_body = markdown.markdown(
    md_text,
    extensions=["extra", "sane_lists"]
)

# %%

# Wrap with basic HTML structure and optional styling
html = f"""
<html>
<head>
    <style>
        @page {{
            margin: 0.15in;
        }}
        body {{
            font-family: Arial, sans-serif;
            font-size: 10pt;
            margin-top: 0.25in;
            margin-bottom: 0.2in;
            margin-left: 0.4in;
            margin-right: 0.4in;
        }}
        h1, h2 {{
            margin-top: 0.5em;
            margin-bottom: 0.2em;
        }}
        h3, h4 {{
            margin-top: 0.1em;
            margin-bottom: 0.1em;
        }}
        p {{
            margin: 0.1em 0;
        }}
        ul {{
            list-style-type: disc;
            padding-left: 1.2em;
            margin: 0.2em 0;
            margin-bottom: 0.8em;
        }}
        li {{
            margin: 0.1em 0;
        }}
        strong {{
            font-weight: bold;
        }}
        p strong {{
            margin-top: 10px;  /* Adds space above the bolded text inside paragraphs */
        }}
        p {{
            margin-bottom: 5px;  /* Ensures that spacing between paragraphs is adjusted */
        }}
        a {{
            color: #313859; /* Set to whatever color you prefer */
            text-decoration: none; /* Remove underline */
        }}
    </style>
</head>
<body>
    {html_body}
</body>
</html>
"""

# Export to PDF
HTML(string=html).write_pdf("resume.pdf")

# %%