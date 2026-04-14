from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="NEO_TASK_API")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Replace YOUR_ACTUAL_PASSWORD_HERE
MONGO_URI = "mongodb+srv://yajurxo:YOUR_ACTUAL_PASSWORD_HERE@cluster0.wchsllp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client.neo_task_db

# This defines what a Task looks like so Python can read it
class TaskModel(BaseModel):
    id: str
    user: str
    title: str
    type: str
    xp: int
    done: bool

@app.get("/api/tasks/{user_id}")
async def get_tasks(user_id: str):
    tasks = await db.tasks.find({"user": user_id}).to_list(100)
    for task in tasks: task["_id"] = str(task["_id"])
    return tasks

@app.post("/api/tasks")
async def add_task(task: TaskModel):
    # Inserts the new task into MongoDB
    await db.tasks.insert_one(task.dict())
    return {"message": "Task saved to cloud"}

@app.put("/api/tasks/{task_id}")
async def complete_task(task_id: str):
    # Updates the task in MongoDB to done: true
    await db.tasks.update_one({"id": task_id}, {"$set": {"done": True}})
    return {"message": "Task marked complete"}