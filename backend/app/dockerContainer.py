
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
    workdir = f"/tmp/{job_id}"
    os.makedirs(workdir, exist_ok=True)

    # Step 1: Extract zip contents into temp directory
    try:
        with zipfile.ZipFile(io.BytesIO(folder_bytes)) as zip_ref:
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

            timeout_sec=0.5  

            container = client.containers.run(
                image=image_tag,
                detach=True,
                mem_limit="256m",
                cpu_quota=50000,
                network_disabled=True,
                remove=True
            )
            try:
                # Wait for container to finish with timeout
                result = container.wait(timeout=timeout_sec)
                logs = container.logs()
            except Exception as e:
                # Timeout or other error: stop container forcibly
                result = 0
                container.stop()
                logs = container.logs()

            container.remove(force = True)

            return [result, logs.decode()]

        result = await loop.run_in_executor(None, run_container)
        testPassed = result[1].count("True")
        testFailed = result[1].count("False")

        if (result[0] == 0):
            result[1] = (testPassed, testPassed + testFailed)

        else:
            result[0] = 1

        return result #  [1, (testPassed, totalTessed)] or [0, error logs] 0 indicates success, 1 indicates failure 

    except Exception as e:
        return f"Error: {str(e)}"

    finally:
        shutil.rmtree(workdir, ignore_errors=True)


async def run_dummy_flask():
    # Get absolute path to the zip file
    zip_path = os.path.join(os.path.dirname(__file__),"flask_dummy.zip")

    # Read zip file as bytes
    with open(zip_path, "rb") as f:
        folder_bytes = f.read()

    # Call the updated run_user_code that accepts zip bytes
    output = await run_user_code(folder_bytes)
    print(output)


if __name__ == "__main__":
 asyncio.run(run_dummy_flask())

