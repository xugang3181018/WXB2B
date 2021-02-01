const events = {}

const on = (name, self, callback) => {
  const tuple = [self, callback]
  const callbacks = events[name]
  Array.isArray(callbacks) ? callbacks.push(tuple) : events[name] = [tuple]
}

const remove = (name, self) => {
  const callbacks = events[name]
  if (Array.isArray(callbacks)) events[name] = callbacks.filter((tuple) => tuple[0] != self)
}

const emit = (name, data) => {
  const callbacks = events[name]
  if (Array.isArray(callbacks)) {
    callbacks.map((tuple) => {
      const self = tuple[0]
      const callback = tuple[1]
      callback.call(self, data)
    })
  }
}

module.exports = {on, remove, emit}