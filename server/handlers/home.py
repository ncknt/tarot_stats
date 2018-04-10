import tornado.web
import tornado.template

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        loader = tornado.template.Loader("./server/pages")
        self.finish(loader.load("home.html").generate())
