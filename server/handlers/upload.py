import tornado.web
import tornado.template


class UploadHandler(tornado.web.RequestHandler):
    def post(self):
        file_body = self.request.files['spreadsheet'][0]['body']
        response =  { hash: 'xyz' }
        self.set_header('Content-Type', 'application/json')
        self.finish(response)
