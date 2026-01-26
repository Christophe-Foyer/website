# %%
import markdown
from weasyprint import HTML
import math
import sys

def generate_pdf_doc(font_size_pt, margin_in, md_text):
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
    output_file = "resume.pdf"
    
    # Load your markdown content
    with open("resume.md", "r") as f:
        md_text = f.read()

    # Default/Ideal settings
    default_font = 11.0
    default_margin = 0.4
    
    # Limits
    min_font = 9.0
    min_margin = 0.25
    step_font = 0.5
    step_margin = 0.05

    print("Checking default page count...")
    doc = generate_pdf_doc(default_font, default_margin, md_text)
    initial_pages = len(doc.pages)
    
    # We want to fit into the floor of current pages (e.g., 1.2 -> 1)
    # unless it's already an integer.
    target_pages = math.floor(initial_pages)
    # If for some reason it's 0 (empty file?), default to 1
    if target_pages < 1:
        target_pages = 1
        
    print(f"Initial count: {initial_pages}. Target: {target_pages}.")

    # If we are already at target (e.g. exactly 1.0 or 2.0 pages), we are good.
    if initial_pages <= target_pages:
        doc.write_pdf(output_file)
        print(f"Success! Fits perfectly on {initial_pages} page(s). Saved to {output_file}.")
        return

    # Otherwise, try to shrink settings to fit target_pages
    current_font = default_font
    current_margin = default_margin
    
    while current_font >= min_font:
        current_font -= step_font
        if current_margin > min_margin:
            current_margin -= step_margin
            
        print(f"  Trying compression: font={current_font}pt, margin={current_margin:.2f}in")
        
        doc = generate_pdf_doc(current_font, current_margin, md_text)
        if len(doc.pages) <= target_pages:
            doc.write_pdf(output_file)
            print(f"Success! Compressed to fit on {len(doc.pages)} page(s). Saved to {output_file}.")
            return
            
    # If we exit loop, we couldn't fit it. Revert to defaults.
    print(f"Could not fit content into {target_pages} page(s) even with min settings.")
    print(f"Reverting to default settings ({initial_pages} pages).")
    
    # Re-generate with defaults
    doc = generate_pdf_doc(default_font, default_margin, md_text)
    doc.write_pdf(output_file)
    print(f"Saved default version to {output_file}.")

if __name__ == "__main__":
    main()