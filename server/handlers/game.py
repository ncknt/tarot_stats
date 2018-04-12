import tornado.web
import tornado.template
import string
import random
from data.game import Game

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

class GameHandler(tornado.web.RequestHandler):
    def post(self):
        g = Game(self.request.body)
        g.id = id_generator()
        g.save()
        self.set_header('Content-Type', 'application/json')
        self.finish(g.toJSON())

    def get(self):
        pass

