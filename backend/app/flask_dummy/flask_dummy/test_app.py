from app import app

def test_home():
    client = app.test_client()
    response = client.get('/')
    print(response.get_json() == {"message": "Hello, World!"})

def test_add():
    client = app.test_client()
    response = client.get('/add/4/7')
    print(response.get_json() == {"result": 11})


test_home()
test_add()