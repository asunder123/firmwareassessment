import time

import redis
from flask import Flask
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)

# Add code to fix security hotspot
csrf = CSRFProtect()
csrf.init_app(app)   

cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)
