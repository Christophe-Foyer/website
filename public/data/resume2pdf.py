# %%
import markdown
from weasyprint import HTML
import sys
import os

def generate_pdf(font_size_pt, margin_in, output_filename="resume.pdf"):
    # Load your markdown content
    with open("resume.md", "r") as f:
        md_text = f.read()

    # Convert to HTML
    html_body = markdown.markdown(
        md_text,
        extensions=["extra", "sane_lists"]
    )

    # Wrap with basic HTML structure and optional styling
    html_content = f"""
    <html>
    <head>
        <style>
            @page {{
                margin: {margin_in}in;
            }}
            body {{
                font-family: Arial, sans-serif;
                font-size: {font_size_pt}pt;
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
                margin-top: 10px;
            }}
            p {{
                margin-bottom: 5px;
            }}
            a {{
                color: #313859;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        {html_body}
    </body>
    </html>
    """
    
    html_obj = HTML(string=html_content)
    document = html_obj.render()
    return document

def main():
    target_pages = 1
    
    # Start with desired large settings
    font_size = 11.0
    margin = 0.4
    
    min_font = 8.0
    min_margin = 0.2
    
    output_file = "resume.pdf"

    print(f"Attempting to fit resume on {target_pages} page(s)...")

    while font_size >= min_font:
        doc = generate_pdf(font_size, margin, output_file)
        page_count = len(doc.pages)
        print(f"  Generated with font_size={font_size}pt, margin={margin}in -> {page_count} pages")
        
        if page_count <= target_pages:
            doc.write_pdf(output_file)
            print(f"Success! Saved to {output_file} ({page_count} pages)")
            return
            
        # Reduce settings to try to fit
        font_size -= 0.5
        if margin > min_margin:
            margin -= 0.05
            
    print("Could not fit on target pages with minimum settings. Saving last attempt.")
    doc.write_pdf(output_file)

if __name__ == "__main__":
    main()