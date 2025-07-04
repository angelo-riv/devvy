
import zipfile
import io
import uuid
import os
import asyncio
import shutil
from docker import from_env

client = from_env()

async def run_user_code(folder_bytes: bytes):
    
    job_id = str(uuid.uuid4())
    workdir = f"./tmp/{job_id}"
    os.makedirs(workdir, exist_ok=True)
    print(len(folder_bytes), "bytes received")
    # Step 1: Extract zip contents into temp directory
    try:
        with zipfile.ZipFile(io.BytesIO(folder_bytes)) as zip_ref:
            print("Zip file contains:", zip_ref.namelist())
            zip_ref.extractall(workdir)
    except Exception as e:
        shutil.rmtree(workdir, ignore_errors=True)
        return f"Error unzipping folder: {str(e)}"

    # Step 2: Locate Dockerfile (recursive search)
    dockerfile_path = None
    for root, dirs, files in os.walk(workdir):
        if "Dockerfile" in files:
            dockerfile_path = os.path.join(root, "Dockerfile")
            break

    if not dockerfile_path:
        shutil.rmtree(workdir, ignore_errors=True)
        return "Error: Dockerfile not found in the submitted folder."

    # Step 3: Build Docker image
    image_tag = f"user_image_{job_id}"
    loop = asyncio.get_event_loop()

    try:
        build_dir = os.path.dirname(dockerfile_path)

        await loop.run_in_executor(
            None,
            lambda: client.images.build(path=build_dir, tag=image_tag, dockerfile="Dockerfile")
        )

        # Step 4: Run container
        def run_container():

            timeout_sec=1

            container = client.containers.create(
                image=image_tag,
                detach=True,
                mem_limit="256m",
                cpu_quota=50000,
                network_disabled=True
            )

            container.start()
            try:
                # Wait for container to finish with timeout
                result = container.wait(timeout=timeout_sec)
                logs = container.logs()
            except Exception as e:
                # Timeout or other error: stop container forcibly
                result = 1
                container.stop()
                logs = container.logs()

            container.remove(force = True)

            return [result, logs.decode()]

        result = await loop.run_in_executor(None, run_container)
        
        return result 

    except Exception as e:
        return f"Error: {str(e)}"

    finally:
        shutil.rmtree(workdir, ignore_errors=True)

'''
'''
if __name__ == "__main__":
    import asyncio


    with open("backend\\app\\tradingBot.zip", "rb") as f:
        zip_bytes = f.read()

    result = asyncio.run(run_user_code(zip_bytes))
    print(result)
    ''''''