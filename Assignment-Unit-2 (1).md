# Assignment Unit-2 NoSQL Database

## Q1. RDBMS vs NoSQL
| Param | RDBMS | NoSQL |
|---|---|---|
| Schema | Fixed, ALTER costly | Dynamic, per-record fields |
| Scalability | Vertical scale-up | Horizontal scale-out |
| Data model | Tables + JOINs | KV, Document, Column, Graph |
| Consistency | ACID strong | BASE tunable/eventual |
| Performance | Slow for huge unstructured (joins/locks) | High throughput, denormalized |
| Apps | Banking, ERP (MySQL, Oracle) | Social, IoT, catalog (MongoDB, Cassandra, Neo4j) |

## Q2. MongoDB / Cassandra / HBase / Neo4j
- **MongoDB (Document):** BSON docs, rich queries. Use: catalog, CMS, profiles.
- **Cassandra (Wide-column P2P):** Always-on, high writes. Use: IoT, feeds, Netflix history.
- **HBase (Column on HDFS):** CP, versioned, Spark/MR. Use: logs, analytics.
- **Neo4j (Graph):** Nodes+edges, Cypher traversals. Use: social, fraud, recommendations.

## Q3. RDBMS approach + challenges
Approach: normalize tables, PK/FK, JOINs, ACID locks. Challenges: vertical limit, cross-node JOINs slow, 2PC latency, rigid ALTER on TBs, single-master SPOF.

## Q4. NoSQL approach
Schema-less, denormalize together-what-is-queried-together, shard + replicate, BASE. Fixes scale (add nodes), flex (no migration), perf (one-read aggregates, partitioned writes).

## Q5. Data models
- **KV:** `User:101 -> "{...}"` Redis/Riak. Sessions, carts.
- **Document:** `{_id:1,name:"Laptop",specs:{ram:"16GB"}}` MongoDB. Catalogs.
- **Column:** `Row 101 | Profile:{name} | Orders:{o1}` Cassandra/HBase. Time-series.
- **Graph:** `(Asha)-[:FRIEND]->(Ravi)` Neo4j. Social/fraud.

## Q6. Aggregate-oriented
Aggregate = related objects stored as one unit (e.g. Order + items + address). KV/Doc/Column are aggregate-oriented. Useful: one-write atomicity, one-read no JOIN, natural shard unit.

## Q7. Mongo vs Cassandra
| | MongoDB | Cassandra |
|---|---|---|
| Model | BSON docs, ad-hoc queries | Partition+clustering keys, CQL |
| Consistency | Primary strong | ONE/QUORUM/ALL tunable |
| Scale | Shard + replica-set | P2P linear writes |
| App | Catalog/CMS | IoT/messaging |

## Q8. Replication vs Sharding
Replication = copies for HA/durability. Sharding = splits by shard-key for scale. Both needed: production = sharded + each shard replicated.

## Q9. Distribution models
```
Single: [App]->[DB all data]
Sharding: [Router]->[ShardA][ShardB][ShardC]
Master-Slave: [W]->[Master]->[Slave1][Slave2]
P2P: [N1]-[N2]-[N3]-[N4] ring, all equal
```

## Q10. Master-Slave
Writes to primary, oplog to secondaries, election on fail. Adv: strong reads, read-scale, backups. Limit: write bottleneck, lag, failover pause. Apps: blogs, e-commerce reads>>writes.

## Q11. P2P vs Master-Slave
P2P (Cassandra): no master, any node writes, gossip + consistent hashing, RF=3, QUORUM. Difference: writes anywhere vs primary-only, no SPOF vs election, eventual vs strong, linear write scale.

## Q12. Sharding
Hash/range/directory/geo split. Adv: storage+throughput scale, parallelism. Challenges: shard-key hotspot, cross-shard queries, rebalancing, ops complexity.

## Q13. Sharding + Replication
```
[App]->[mongos]-> ShardA[P][S][S] ShardB[P][S][S] ShardC[P][S][S]
```
Router hashes to shard primary, replicates to secondaries. Scale + HA.

## Q14. MapReduce
Map -> Shuffle/Sort -> Reduce. Ex: count words: Map (hello,1),(world,1) -> Shuffle (hello,[1,1]) -> Reduce (hello,2).

## Q15. Role in large-scale analysis
Parallel where-data-lives, fault-tolerant retries, linear scale. Uses: log analysis, ETL, index build, PageRank. Limit: batch only, use Spark for iterative.
