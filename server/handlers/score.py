import tornado.web
import tornado.template

class ScoreHandler(tornado.web.RequestHandler):
    def get(self):
        loader = tornado.template.Loader("../pages")
        self.finish(loader.load("score.html").generate(myvalue="XXX"))
