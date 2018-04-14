import tornado.web
import tornado.template
from data.game import Game

class HomeHandler(tornado.web.RequestHandler):
    def get(self, *args):
        # Get ID and make sure the file exists
        path_elements = [x for x in self.request.path.split("/") if x]
        if len(path_elements) == 2 and path_elements[1] == 'game':
            game = Game.load(path_elements[0])
            if game is None:
                self.set_header('Content-Type', 'application/json')
                self.set_status(404)
                self.finish({"message": "Le jeu n'existe pas"})
            else:
                self.set_header('Content-Type', 'application/json')
                self.finish(game.toJSON())
        else:
            loader = tornado.template.Loader("./server/pages")
            self.finish(loader.load("home.html").generate())

    def put(self, *args):
        path_elements = [x for x in self.request.path.split("/") if x]
        game = Game(self.request.body)
        game.id = path_elements[0]
        game.save()
        self.set_header('Content-Type', 'application/json')
        self.finish(game.toJSON())
