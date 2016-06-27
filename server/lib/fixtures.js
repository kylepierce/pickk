var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Fixtures = {
  buckets: [],
  preHooks: [],
  postHooks: [],
  objectIds: [],
  push: function(collection, objects) {
    var bucket;
    bucket = _.find(this.buckets, function(bucket) {
      return bucket.collection === collection;
    });
    if (bucket) {
      return _.extend(bucket.objects, objects);
    } else {
      return this.buckets.push({
        collection: collection,
        objects: objects
      });
    }
  },
  pre: function(collection, handler) {
    return this.preHooks.push({
      collection: collection,
      handler: handler
    });
  },
  post: function(collection, handler) {
    return this.postHooks.push({
      collection: collection,
      handler: handler
    });
  },
  insertAll: function(reloadedCollectionNames) {
    var bucket, hook, i, j, len, len1, ref, ref1, results;
    ref = this.buckets;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      bucket = ref[i];
      ref1 = this.preHooks;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        hook = ref1[j];
        if (hook.collection === bucket.collection) {
          hook.handler(bucket.objects);
        }
      }
      this.insert(bucket.objects, bucket.collection, reloadedCollectionNames);
      results.push((function() {
        var k, len2, ref2, results1;
        ref2 = this.postHooks;
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          hook = ref2[k];
          if (hook.collection === bucket.collection) {
            results1.push(hook.handler(bucket.objects));
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  },
  insert: function(objects, collection, reloadedCollectionNames) {
    var _id, object, ref, results;
    for (_id in objects) {
      object = objects[_id];
      if (indexOf.call(this.objectIds, _id) < 0) {
        this.objectIds.push(_id);
      }
    }
    if ((ref = collection._name, indexOf.call(reloadedCollectionNames, ref) < 0) && reloadedCollectionNames.length) {
      return [];
    }
    if (collection.find().count()) {
      return [];
    }
    results = [];
    for (_id in objects) {
      object = objects[_id];
      object._id = _id;
      results.push(collection.insert(object));
    }
    return results;
  },
  ensureAll: function(collectionNames) {
    var bucket, i, len, ref, results;
    ref = this.buckets;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      bucket = ref[i];
      results.push(this.ensure(bucket.objects, bucket.collection, collectionNames));
    }
    return results;
  },
  ensure: function(objects, collection, collectionNames) {
    var _id, object, ref, results;
    if (collectionNames == null) {
      collectionNames = [];
    }
    if (ref = collection._name, indexOf.call(collectionNames, ref) < 0) {
      return [];
    }
    results = [];
    for (_id in objects) {
      object = objects[_id];
      if (collection.findOne(_id)) {
        results.push(collection.update(_id, {
          $set: object
        }));
      } else {
        object._id = _id;
        results.push(collection.insert(object));
      }
    }
    return results;
  }
};
