# Assignment Unit-3 MongoDB

## Q1. MongoDB vs RDBMS
MongoDB = BSON docs in collections, flexible, embedded, horizontal sharding, MQL. RDBMS = fixed tables, JOINs, vertical scale, SQL. Ex: user+orders in one doc vs 2 tables + JOIN.

## Q2. Document DB features
Flexible schema, hierarchy (embedded arrays), rich query + aggregation, indexes (single/compound/text/geo/TTL), replica+shard scale. Impl via BSON, validators optional.

## Q3. Consistency
Primary + secondaries via oplog. `w:1/majority/all`, `j:true`, `readConcern local/majority/snapshot`. `w:majority + read:majority` = no rollback reads.

## Q4. Transactions
Single-doc atomic always. Multi-doc since 4.0 via sessions:
```javascript
const s=db.getMongo().startSession(); s.startTransaction();
db.accounts.updateOne({_id:"A"},{$inc:{bal:-500}},{session:s});
s.commitTransaction();
```

## Q5. Availability
Replica-set 1 primary + N secondaries, oplog, auto-election 5-10s, `retryWrites`, readPref secondary for HA. 3 nodes tolerate 1 fail.

## Q6. Query CRUD
```javascript
db.books.insertOne({title:"Dune",tags:["sci-fi"]});
db.books.find({year:{$gte:1960}});
db.books.updateOne({title:"Dune"},{$set:{stock:9}});
db.books.deleteOne({title:"X"});
```

## Q7. Scaling
Vertical = bigger box. Horizontal = sharded cluster mongos + shards. `sh.shardCollection("shop.orders",{userId:"hashed"})`. Shard-key high-cardinality, non-monotonic.

## Q8. Use cases
Catalogs, CMS, IoT, mobile backends. Flexible: shoe `{size:42}` and phone `{ram:"8GB"}` in same collection, no migration.

## Q9. Event logging
One doc per event `{ts,level,service,ctx}` or hourly buckets. Index `{ts,service}`, TTL 30d. Time-series collections for scale.

## Q10. CMS
Single `pages` with polymorphic `blocks:[{type:"hero"},{type:"video"}]`. One read renders page, new block types no migration.

## Q11. Blogging
`users`, `posts` (authorId ref, tags[], topComments embedded), `comments` separate when unbounded. Indexes slug unique, tags, text search.

## Q12. Analytics
Raw events + pre-aggregated minute buckets via `$inc` upsert. Change streams push live dashboards.

## Q13. E-commerce
products, customers (addresses[]), orders (items snapshot priceAtBuy), carts (per-user, upsert). Checkout = txn: decrement stock + insert order.

## Q14. Complex txn challenges
Multi-doc atomicity, oversell races, long txn, cross-shard slowness. Fix: txns + `{stock:{$gte:qty}}` check, idempotency keys, outbox + change streams.

## Q15. Varying aggregates
Book `{author:"X",pages:412}` vs movie `{director:{},cast:[]}` vs user v1/v2 coexist. Query via `$exists`, flexible schema-on-read.
