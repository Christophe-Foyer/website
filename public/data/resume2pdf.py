# %%
import markdown
from weasyprint import HTML
import argparse
import sys
from pathlib import Path

# CONFIGURATION: Adjust these percentages to change search bounds
# These are relative to the default values
FONT_SIZE_VARIATION = 0.20  # ±20% of default font size
MARGIN_VARIATION = 0.50     # ±50% of default margin

def generate_pdf_doc(font_size_pt, margin_in, md_text):
    """Generate a PDF document from markdown text with specified formatting."""
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
                size: letter;
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

def get_page_utilization(document):
    """
    Calculate how well the last page is utilized (0.0 to 1.0).
    Returns the ratio of content height to available height on the last page.
    """
    if not document.pages:
        return 0.0
    
    last_page = document.pages[-1]
    
    # Get page dimensions (in points, 72 points = 1 inch)
    page_height = last_page._page_box.height
    
    # Get margin (top + bottom)
    margin_box = last_page._page_box.margin_height()
    
    # Available content height
    available_height = margin_box
    
    # Get actual content height on last page
    # The content_box contains all the rendered content
    content_height = 0
    for box in last_page._page_box.descendants():
        if hasattr(box, 'height') and hasattr(box, 'position_y'):
            # Track the lowest point of content
            box_bottom = box.position_y + box.height
            if box_bottom > content_height:
                content_height = box_bottom
    
    # Calculate utilization ratio
    if available_height > 0:
        utilization = min(content_height / available_height, 1.0)
    else:
        utilization = 0.0
    
    return utilization

def calculate_score(document, target_pages=None):
    """
    Score a document based on page utilization.
    Higher score = better utilization.
    
    If target_pages is specified, we penalize being far from that target.
    Otherwise, we prefer documents close to integer page counts with high last-page utilization.
    """
    num_pages = len(document.pages)
    
    if num_pages == 0:
        return -1000.0
    
    last_page_util = get_page_utilization(document)
    
    if target_pages is not None:
        # Penalize being over or under the target
        page_distance = abs(num_pages - target_pages)
        
        if num_pages == target_pages:
            # Perfect page count - maximize last page utilization
            return 1000.0 + last_page_util * 100
        elif num_pages < target_pages:
            # Under target - reward high utilization but penalize being under
            return 500.0 - page_distance * 200 + last_page_util * 100
        else:
            # Over target - heavily penalize
            return -page_distance * 500
    else:
        # General optimization: prefer documents close to round page counts
        # with high last-page utilization
        fractional_pages = num_pages - int(num_pages)
        
        # Distance from nearest integer page count (0.0 to 0.5)
        distance_from_integer = min(fractional_pages, 1.0 - fractional_pages)
        
        # Score based on last page utilization and closeness to integer pages
        # Higher utilization = better
        # Closer to integer pages = better
        score = last_page_util * 100 - distance_from_integer * 50
        
        return score

def optimize_parameters(md_text, default_font, default_margin):
    """
    Find the best font size and margin combination to maximize page utilization.
    Uses a grid search within configurable bounds.
    """
    # Calculate search bounds based on configuration
    min_font = default_font * (1 - FONT_SIZE_VARIATION)
    max_font = default_font * (1 + FONT_SIZE_VARIATION)
    min_margin = default_margin * (1 - MARGIN_VARIATION)
    max_margin = default_margin * (1 + MARGIN_VARIATION)
    
    # Use finer steps for better optimization
    font_steps = 9  # Will create 9 steps between min and max
    margin_steps = 9
    
    print(f"\nOptimization bounds:")
    print(f"  Font size: {min_font:.1f}pt to {max_font:.1f}pt")
    print(f"  Margin: {min_margin:.2f}in to {max_margin:.2f}in")
    print(f"\nSearching {font_steps * margin_steps} parameter combinations...\n")
    
    best_score = -float('inf')
    best_params = (default_font, default_margin)
    best_doc = None
    best_utilization = 0.0
    
    # Generate font and margin values to test
    font_range = [min_font + (max_font - min_font) * i / (font_steps - 1) 
                  for i in range(font_steps)]
    margin_range = [min_margin + (max_margin - min_margin) * i / (margin_steps - 1) 
                    for i in range(margin_steps)]
    
    # Grid search
    for font_size in font_range:
        for margin in margin_range:
            doc = generate_pdf_doc(font_size, margin, md_text)
            score = calculate_score(doc)
            utilization = get_page_utilization(doc)
            num_pages = len(doc.pages)
            
            if score > best_score:
                best_score = score
                best_params = (font_size, margin)
                best_doc = doc
                best_utilization = utilization
                print(f"  New best: font={font_size:.2f}pt, margin={margin:.2f}in "
                      f"→ {num_pages} pages, {utilization*100:.1f}% last page fill "
                      f"(score: {score:.1f})")
    
    font_size, margin = best_params
    num_pages = len(best_doc.pages)
    
    print(f"\n{'='*70}")
    print(f"Optimal parameters found:")
    print(f"  Font size: {font_size:.2f}pt")
    print(f"  Margin: {margin:.2f}in")
    print(f"  Pages: {num_pages}")
    print(f"  Last page utilization: {best_utilization*100:.1f}%")
    print(f"  Score: {best_score:.1f}")
    print(f"{'='*70}\n")
    
    return best_doc, best_params, num_pages, best_utilization

def main():
    parser = argparse.ArgumentParser(
        description="Generate optimized PDF from Markdown resume",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Configuration:
  Adjust FONT_SIZE_VARIATION and MARGIN_VARIATION at the top of this script
  to control the search bounds. These are percentages of the default values.
  
  Current settings:
    FONT_SIZE_VARIATION = {:.0%} (±{:.0%} of default)
    MARGIN_VARIATION = {:.0%} (±{:.0%} of default)
        """.format(FONT_SIZE_VARIATION, FONT_SIZE_VARIATION, 
                   MARGIN_VARIATION, MARGIN_VARIATION)
    )
    parser.add_argument(
        "input_file",
        nargs="?",
        default="resume.md",
        help="Input markdown file (default: resume.md)"
    )
    parser.add_argument(
        "--no-optimize",
        action="store_true",
        help="Use default settings without optimization"
    )
    args = parser.parse_args()
    
    input_path = Path(args.input_file)
    output_file = input_path.with_suffix(".pdf")
    
    # Load markdown content
    with open(input_path, "r") as f:
        md_text = f.read()

    # Default/Ideal settings
    default_font = 11.0
    default_margin = 0.4
    
    if args.no_optimize:
        print(f"Generating PDF with default settings...")
        doc = generate_pdf_doc(default_font, default_margin, md_text)
        doc.write_pdf(output_file)
        num_pages = len(doc.pages)
        utilization = get_page_utilization(doc)
        print(f"Generated {num_pages} page(s) with {utilization*100:.1f}% last page fill.")
        print(f"Saved to {output_file}")
        return
    
    print(f"Optimizing PDF generation for {input_path}...")
    print(f"Default settings: font={default_font}pt, margin={default_margin}in")
    
    # Run optimization
    best_doc, (best_font, best_margin), num_pages, utilization = optimize_parameters(
        md_text, default_font, default_margin
    )
    
    # Save the optimized PDF
    best_doc.write_pdf(output_file)
    print(f"Success! Optimized PDF saved to {output_file}")

if __name__ == "__main__":
    main()