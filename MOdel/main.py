from model import get_yolov5
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from io import BytesIO
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import base64

app = FastAPI(
    title="Logo Detection API",
    description="Upload a logo image and the API will respond with the merchant name",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains if needed, e.g., ["http://localhost", "http://192.168.1.51:8081"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_logo = get_yolov5(0.5)

latest_image_bytes = None
label_result =None

@app.post("/detectImage")
async def detect_image(file: UploadFile):
    global latest_image_bytes

    img = Image.open(BytesIO(await file.read()))
    results = model_logo(img, size=416)
    results.render()
    
    bytes_io = BytesIO()
    img_base64 = Image.fromarray(results.ims[0])
    img_base64.save(bytes_io, format="jpeg")
    
    latest_image_bytes = bytes_io.getvalue()
    
    return {"message": "Image processed and saved successfully"}

@app.get("/latestImage")
async def get_latest_image():
    global latest_image_bytes

    if latest_image_bytes is None:
        return {"error": "No image has been processed yet."}
    
    encoded_image = base64.b64encode(latest_image_bytes).decode('utf-8')
    return JSONResponse(content={"image": encoded_image})

@app.post("/getLabel")
async def detect_image_label(file: UploadFile):
    global label_result
    img = Image.open(BytesIO(await file.read()))
    results = model_logo(img, size=416)
    label_result_df = results.pandas().xyxy[0].groupby('name')[['confidence']].max().reset_index()
    label_result = label_result_df.to_dict(orient='records')  # Convert DataFrame to list of dictionaries
    return {"labels": label_result}
@app.get("/valuelabel")
async def getvaluelabel():
    if label_result is None:
        return JSONResponse(content={"error": "No label has been detected yet."}, status_code=404)
    
    return JSONResponse(content={"labels": label_result})