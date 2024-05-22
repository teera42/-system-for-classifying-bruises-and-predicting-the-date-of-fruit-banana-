import torch

## เราสร้างฟังก์ชั่นโดยรับตัวแปรเป็น confident value เข้าไป ซึ่งจะมีค่าตั้งแต่ 0-1 ไว้สำหรับเป็นค่า threshold prediction
def get_yolov5(confident_val):    
   ## path ในที่นี้คือจะเป็น path ที่ไปยังโมเดลของเราที่วางไว้ครับ ถ้ามีชื่ออื่น จะต้องเปลี่ยนให้ตรงด้วย  
   model = torch.hub.load('./yolov5', 'custom', path='./model/last.pt', source='local')
   model.conf = confident_val    
   return model