## 📖 About

Shell Agent is an innovative web app designed for software engineering students to explore and learn Linux commands through an engaging chat-like terminal interface 💻. Built with insights from real teachers' courses 📚 and enhanced by Retrieval-Augmented Generation (RAG) 🤖, AceOS makes Linux fun, accessible, and effective!

## ✨ Features

- 🖥️ **Terminal Interface**: Simulates a terminal for a hands-on learning experience.
- 🧠 **AI driven learning**: Ask Linux-related questions or type commands, and get instant, AI-driven responses.
- 📂 **RAG Integration**: Delivers precise and contextual answers based on real course material.
- 🎓 **Beginner Friendly**: Perfect for students and aspiring engineers.

## 🔧 Setup

In order for you to setup this project with your own resources, consider following instructions below.

> [!IMPORTANT]
>
> - You should create a postgres database with vector extension enabled.
> - Create a .env file with DATABASE_URL

##### 1 - Create python script

Python script that take pdf as argument then extract it's data page by page, convert each page data into embedding and finally insert each page with it's corresponding embedding into vector database.

```python
import os
import sys
import fitz
from together import Together
from dotenv import load_dotenv
import psycopg2

load_dotenv()
client = Together()

# Connect to database
connection_string = os.getenv("DATABASE_URL")
connection = psycopg2.connect(connection_string)
print("Connected to database successfully")

cursor = connection.cursor()

# Enable vector extension and create table if not exists
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
connection.commit()


# upload text and its embedding to the vector database.
def upload_to_vectordb(pdf_name, page_num, content, embedding):
    try:
        cursor.execute(
            "INSERT INTO pdf_embeddings (pdf_name, page_num, content, embedding) VALUES (%s, %s, %s, %s)",
            (pdf_name, page_num, content, embedding)
        )
        connection.commit()
        print(f"Successfully stored embedding for {pdf_name}, page {page_num}")
    except Exception as e:
        connection.rollback()
        print(f"Error storing embedding: {e}")


# get embeddings from Together API
def get_embedding(text):
    try:
        response = client.embeddings.create(
            model="togethercomputer/m2-bert-80M-8k-retrieval",
            input=text
        )
        embedding = response.data[0].embedding
        return embedding
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return None


# extract text from PDF and create embeddings for each page
def extract_pdf_content(path):
    try:
        doc = fitz.open(path)
        pdf_name = os.path.basename(path)

        for page_num, page in enumerate(doc):
            text = page.get_text()
            if text.strip():  # Only process non-empty pages
                print(f"Processing {pdf_name} - page {page_num+1}")

                # get embedding for the page text
                embedding = get_embedding(text)

                if embedding:
                    # upload to vector database
                    upload_to_vectordb(pdf_name, page_num+1, text, embedding)
    except Exception as e:
        print(f"Error processing PDF {path}: {e}")


if __name__ == "__main__":
    pdf_path = sys.argv[1]
    extract_pdf_content(pdf_path)
    # close database connection
    cursor.close()
    connection.close()
```

##### 2 - Create inserting bash script

This function well be used to loop through the PDFs (courses) and run the `python script` on each one of them.

```bash
#!/bin/bash

for file in public/courses/*; do
  echo "Start Processing: $file"
  python3 script.py $file
  echo "Finish Processing: $file"
done
```

With that setup you should be able to use your own resources with shell agent as infrastructure to learn more effectively.
