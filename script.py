import os
import sys
import io
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from dotenv import load_dotenv
import psycopg2
from together import Together

load_dotenv()
client = Together()

# Connect to DB
connection_string = os.getenv("DATABASE_URL")
connection = psycopg2.connect(connection_string)
cursor = connection.cursor()
print("✅ Connected to database")

# Ensure vector extension + table
cursor.execute("CREATE EXTENSION IF NOT EXISTS vector")
cursor.execute("""
CREATE TABLE IF NOT EXISTS pdf_embeddings (
    id SERIAL PRIMARY KEY,
    pdf_name TEXT,
    page_num INTEGER,
    content TEXT,
    embedding VECTOR(768)
)
""")

cursor.execute(
    "ALTER TABLE pdf_embeddings ADD COLUMN IF NOT EXISTS semester TEXT")
connection.commit()


# Utility functions

def upload_to_vectordb(pdf_name, page_num, content, embedding):
    try:
        cursor.execute(
            "INSERT INTO pdf_embeddings (pdf_name, page_num, content, embedding, semester) VALUES (%s, %s, %s, %s, %s)",
            (pdf_name, page_num, content, embedding, "S4")
            # S4 & S3 is set manually
        )
        connection.commit()
        print(f"✅ Stored embedding for {pdf_name}, page {page_num}")
    except Exception as e:
        connection.rollback()
        print(f"❌ Error storing embedding: {e}")


def get_embedding(text):
    try:
        response = client.embeddings.create(
            model="BAAI/bge-base-en-v1.5",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"❌ Error getting embedding: {e}")
        return None


def ocr_image(image):
    try:
        return pytesseract.image_to_string(image)
    except Exception as e:
        print(f"❌ OCR failed: {e}")
        return ""


def is_image_dominant(pixmap, text):
    if text.strip():
        return False
    return pixmap.width * pixmap.height > 800 * 800  # adjust threshold if needed



def extract_pdf_content(path):
    try:
        doc = fitz.open(path)
        pdf_name = os.path.basename(path)

        for page_num, page in enumerate(doc, start=1):
            text = page.get_text().strip()
            pix = page.get_pixmap(dpi=300)
            img_data = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_data))

            ocr_text = ""
            if is_image_dominant(pix, text):
                print(f"📷 OCR for image-based page {page_num}")
                ocr_text = ocr_image(image)

            full_content = (text + "\n" + ocr_text).strip()

            if full_content:
                print(f"🔍 Embedding page {page_num}...")
                embedding = get_embedding(full_content)
                if embedding:
                    upload_to_vectordb(pdf_name, page_num,
                                       full_content, embedding)
            else:
                print(f"⚠️ Page {page_num} has no usable content.")

    except Exception as e:
        print(f"❌ Error processing PDF {path}: {e}")


# run script

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_embedder.py path/to/file.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]
    extract_pdf_content(pdf_path)

    cursor.close()
    connection.close()
    print("✅ Done. Connection closed.")
