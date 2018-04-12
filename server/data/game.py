import json
import os.path

class Game:
    def __init__(self, json_string):
        self.__dict__ = json.loads(json_string)

    def toJSON(self):
        return json.dumps(
            self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

    def filename(self):
        """ Store the data in ./data with a json extension """
        return Game.filename_from_id(self.id)

    def exists(self):
        filename = self.filename()
        return filename is not None and os.path.isfile(filename)

    def save(self):
        filename = self.filename()
        if filename is None:
            raise ValueError('No filename')

        with open(filename, 'w') as outfile:
            outfile.write(self.toJSON())

    @staticmethod
    def filename_from_id(id):
        if id is not None:
            return "./data/{0}.json".format(id)
        return None

    @classmethod
    def load(cls, id):
        filename = cls.filename_from_id(id)
        if not os.path.isfile(filename):
            return None

        with open(filename, "r") as infile:
            content = infile.read()
            return cls(content)

