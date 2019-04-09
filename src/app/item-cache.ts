export class ItemCache {
  cacheSet = new Map();

  addToSet(...items) {
    items.forEach((item) => this.cacheSet.set(item.id, item))
  }

  clearItems() {
    this.cacheSet.clear()
  }

  isIdInSet(id) {
    return this.cacheSet.has(id)
  }

  getItem(id) {
    return this.cacheSet.get(id)
  }

  removeItem(id) {
    this.cacheSet.delete(id)
  }
}
