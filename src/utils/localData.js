import { AsyncStorage } from 'react-native';

function get(key) {
  return AsyncStorage.getItem(key);
}

function set(key, value) {
  return AsyncStorage.setItem(key, value);
}

function remove(key) {
  return AsyncStorage.removeItem(key);
}

function update(key, value) {
  return AsyncStorage.mergeItem(key, value);
}

function dangerouslyClearEverything() {
  return AsyncStorage.clear();
}

function getAllKeys() {
  return AsyncStorage.getAllKeys();
}

function flushGetRequests() {
  AsyncStorage.flushGetRequests();
}

module.exports = {
  get: get,
  set: set,
  remove: remove,
  update: update,
  dangerouslyClearEverything: dangerouslyClearEverything,
  getAllKeys: getAllKeys,
  flushGetRequests: flushGetRequests
};
