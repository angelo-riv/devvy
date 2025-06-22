import requests
import os
from git import Repo
from pathlib import Path
import tempfile
from openai import OpenAI
from dotenv import load_dotenv
import re
import zipfile
import shutil


load_dotenv()


client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


def download_repo(searched_result, base_dir="backend/app/repos"):
    clone_url = searched_result["clone_url"]
    repo_name = searched_result["name"].split("/")[-1]
    target_path = os.path.join(base_dir, repo_name)

    os.makedirs(base_dir, exist_ok=True)

    if os.path.exists(target_path):
        print(f"⚠️ Repo already exists at {target_path}, skipping clone.")
        return target_path
    
    Repo.clone_from(clone_url, target_path)

    return target_path


LANGUAGES = ["JavaScript", "Python", "Go", "Java", "Rust"]
TOPICS = ["backend", "api", "rest-api", "express", "django", "flask", "spring"]

def search_repos_all_languages():
    all_results = []
    for lang in LANGUAGES:
        for topic in TOPICS:
            query = f"topic:{topic} language:{lang} stars:>20 size:<50 fork:false"
            #print(f"Searching: {query}")
            res = requests.get("https://api.github.com/search/repositories", params={
                "q": query,
                "sort": "stars",
                "order": "desc",
                "per_page": 10
            }, headers={
                "Accept": "application/vnd.github+json",
                # "Authorization": f"Bearer {GITHUB_TOKEN}"
            })

            if res.status_code == 200:
                items = res.json()["items"]
                for item in items:
                    all_results.append({
                        "name": item["full_name"],
                        "url": item["html_url"],
                        "clone_url": item["clone_url"],
                        "language": item["language"],
                        "stars": item["stargazers_count"]
                    })
    return all_results


def clone_repo_and_save_text(repo, output_dir="backend\\app\\repos_files"):
    repo_name = repo['name']

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with tempfile.TemporaryDirectory() as tmpdir:
        print(f"Cloning {repo['clone_url']} into temporary folder {tmpdir} ...")
        Repo.clone_from(repo['clone_url'], tmpdir, depth=1)

        all_text = []
        for root, dirs, files in os.walk(tmpdir):
            if ".git" in dirs:
                dirs.remove(".git")  # skip .git folder
            for file in files:
                try:
                    file_path = os.path.join(root, file)
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    relative_path = os.path.relpath(file_path, tmpdir)
                    all_text.append(f"// File: {relative_path}\n")
                    all_text.append(content)
                    all_text.append("\n\n")
                except Exception as e:
                    print(f"Failed to read {file_path}: {e}")

        output_file = os.path.join(output_dir, f"{repo_name.replace('/', '_')}.txt")
        with open(output_file, "w", encoding="utf-8") as out_f:
            out_f.writelines(all_text)

def clean_code(text):
    # Basic removal of common single-line and multi-line comments:
    # - Python (# comment)
    # - JavaScript/Java/C++ (// comment and /* ... */)
    text = re.sub(r"(#.*?$)|(//.*?$)|(/\*.*?\*/)", "", text, flags=re.MULTILINE | re.DOTALL)
    # Remove blank lines
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

def reduce_text_files_in_folder(folder_path="backend/app/repos_files", max_lines=300):
    """
    Runs reduce_text_file_inplace on every .txt file in the given folder.
    """
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
            if len(lines) > max_lines:
                lines = lines[:max_lines]
            cleaned_text = clean_code("".join(lines))
            with open(file_path, "w", encoding="utf-8") as f_out:
                f_out.write(cleaned_text)


def llm_to_repo(text: str, base_dir="backend\\app\\questions", zip_output_dir="backend\\app\\zipped_questions"):
    """
    Converts improved LLM output format into a real repository on disk, zips it,
    and deletes the original unzipped folder.

    Returns:
        zip_path (str): path to the .zip file
    """
    # Step 1: Extract repo name
    match = re.search(r"<REPO:\s*(.+?)>", text)
    if not match:
        raise ValueError("Missing <REPO: ...> header.")
    folder_name = match.group(1).strip()
    repo_path = os.path.join(base_dir, folder_name)
    os.makedirs(repo_path, exist_ok=True)

    # Step 2: Extract files
    pattern = r"---- FILE: (.+?) ----\n(.*?)\n----"
    files = re.findall(pattern, text, re.DOTALL)
    if not files:
        raise ValueError("No files found in LLM output.")

    for relative_path, content in files:
        abs_path = os.path.join(repo_path, relative_path.strip())
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")

    print(f"✅ Repository written to: {repo_path}")

    # Step 3: Zip the repo
    os.makedirs(zip_output_dir, exist_ok=True)
    zip_path = os.path.join(zip_output_dir, f"{folder_name}.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, file_list in os.walk(repo_path):
            for file in file_list:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, repo_path)
                zipf.write(full_path, arcname=rel_path)

    print(f"📦 Zipped repo created at: {zip_path}")

    # Step 4: Delete the original unzipped folder
    try:
        shutil.rmtree(repo_path)
        print(f"🗑️ Deleted unzipped repo: {repo_path}")
    except Exception as e:
        print(f"⚠️ Failed to delete repo folder: {e}")

    return zip_path
def write_repo(project_name: str, files: dict):
    base_dir = Path("backend/app/questions") / project_name
    for filepath, content in files.items():
        full_path = base_dir / filepath
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")


'''
result = search_repos_all_languages()

for resultant in result:
    clone_repo_and_save_text(resultant)
'''

def inputGPT(repoText: str):
    response = client.responses.create(
        model="gpt-4o",
        instructions='''
            You are a problem generator for a leetcode style problem with a RAG style inputting. We give you popular small backend repos from github in textform
            and we expect you to generate problems based on the repo, down to the same language, goal, etc under these guidelines

            2. You need to do these things 
                1. Based on the supplement info generate some sort of add on file 
                2. Generate a route file that the user works on 
                3. A read me file in telling the user what it needs to do to satisfy cases in the route files and also include the difficulty of either easy, medium, or hard (Make it obvious like a leetcode rank) also please give credit of the source it is from on it 
                4. A test case files that host a series of tests to do. It should not require pytest or anything. Accuracy is determined by outputting "True" or "False" onto the terminal and accuracy is determined by counting the number of T or F 
                5. A docker file to run it 

            (You do not need a bash, code already exist to run it as long as it has a dockerfile)

            Output format 

            <REPO: FOLDERNAME>

            ---- FILE: path/to/filename.ext ----
            <file content>
            <more lines>
            ----

            ---- FILE: another/file.py ----
            <file content>
            ----

            ''',
        input= repoText

    )

    print(response.output_text)
    llm_to_repo(response.output_text, base_dir="backend\\app\\questions")

def generateQuestions(repos_dir="backend/app/repos_files"):
    # List all files in the repos_dir
    files = [f for f in os.listdir(repos_dir) if os.path.isfile(os.path.join(repos_dir, f))]
    if not files:
        raise FileNotFoundError(f"No files found in {repos_dir}")
    # Sort files alphabetically and pick the first one
    for fil in files:
        file_path = os.path.join(repos_dir, fil)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            try:
                inputGPT(content)
            except:
                pass

generateQuestions()


'''
result = search_repos_all_languages()

for resultant in result:
    clone_repo_and_save_text(resultant)
'''


#reduce_text_files_in_folder("backend/app/repos_files")