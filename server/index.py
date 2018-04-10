import tornado.ioloop
import tornado.web
from handlers.score import ScoreHandler
from handlers.upload import UploadHandler
from handlers.home import HomeHandler
from handlers.single_file import SingleFileHandler

def make_app():
    return tornado.web.Application(
        [(r"/", HomeHandler), (r"/scores/([0-9]+)", ScoreHandler),
         (r"/upload/([0-9]+)", UploadHandler),
         (r"/output/(.*)", tornado.web.StaticFileHandler, {
             "path": "./output"
         }), (r"/manifest.json", SingleFileHandler, {
             "path": "./server/pages/manifest.json"
         })],
        debug=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()