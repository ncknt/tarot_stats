import os
import tornado.web


class SingleFileHandler(tornado.web.StaticFileHandler):
    def initialize(self, path):
        self.dirname, self.filename = os.path.split(path)
        super(SingleFileHandler, self).initialize(self.dirname)

    def get(self, path=None, include_body=True):
        # Ignore 'path'.
        super(SingleFileHandler, self).get(self.filename, include_body)