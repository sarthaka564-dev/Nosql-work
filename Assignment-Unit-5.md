# Assignment Unit-5 Riak + Neo4j

## Q1. Riak arch
Dynamo masterless KV: Bucket/Key/Value, 160-bit hash ring, N replicas, R/W quorum, gossip, hinted handoff. PUT hash->N nodes, GET R nodes + vector-clock reconcile. Vs RDBMS: schema-less opaque, O(1) key lookup, horizontal AP, single-key only.

## Q2. KV model
`Bucket users: user:101 -> {name,cart}`. API GET/PUT/DELETE, schema-less, hash-partitioned. Limits: no JOINs, no value search natively. Fast: hash locates node, no parsing/planning.

## Q3. Consistency N-R-W CAP
N total, R read acks, W write acks. R+W>N strong, else eventual. Ex N=3 R=2 W=2 tolerates 1 fail. Riak AP: partition -> both sides writable, siblings merged later.

## Q4. Transactions
No multi-key ACID. Problems: half-fail, no isolation (siblings), no rollback. Workarounds: pack in one key (one PUT atomic), check-and-set via vclock, saga compensations, queue + idempotent worker.

## Q5. Query by key vs data
By key O(1) native. By data needs 2i (`age_int` range), Search (Solr full-text `city:Pune`), or app lookup keys / external index.

## Q6. Millions sessions
Bucket `sessions`, key token `sess:xyz`, value `{user_id,login,expiry}`, TTL, N=3 R=1 W=1/2. Advantages: linear scale, O(1) cookie lookup, no relations, fault-tolerant, flexible.

## Q7. Profiles/carts KV
`profiles user:101`, `carts cart:101 {items,total}`, `email_to_id` lookup. GET by key, read-modify-write whole JSON, vclock to avoid lost update. One-key cart = atomic.

## Q8. Relationships in KV
Opaque values can't traverse. Vs relational FK/JOIN and graph native edges. Techniques: embed (`order:{items,user}`), ref keys, composite keys, materialized views, hybrid KV+graph.

## Q9. Scaling
Consistent-hash vnodes auto-distribute, add node rebalances only affected partitions. N replicas + gossip, no master failover. Quorum tunes latency vs consistency.

## Q10. Set ops
Set CRDT unique mergeable: `product:p1:tags={mobile,5G}`. ADD/REMOVE/UNION/INTERSECT/DIFF/MEMBERSHIP. Use: groups, tags, recommendations without locks.

## Q11. Graph DB
Nodes entities, edges directed named connections, properties KV on both, labels types. Ex `(u:User)-[:FOLLOWS]->(v)`. Index-free adjacency: traversal cost ~ subgraph, not table size. Best for connected queries.

## Q12. Neo4j vs RDBMS
Neo4j: Cypher patterns, ACID, HA cluster, read replicas, Fabric sharding. Vs RDBMS tables/JOINs: multi-hop fast in graph (pointer chase) vs JOIN explosion, both ACID, graph write-scale harder.

## Q13. Traversal vs JOINs
SQL friends-of-friends = 4 JOINs exponential. Cypher `MATCH (u)-[:FOLLOWS*2]->(fof)` + `shortestPath()`. Traversal proportional to visited subgraph, declarative paths.

## Q14. Social modeling
`(User)-[:FOLLOWS]->(User), (User)-[:POSTED]->(Post), -[:LIKED]->, -[:MEMBER_OF]->(Group)`. Queries: suggestions, mutuals in one pattern. Advantages: first-class edges, fast feed/reco, easy new edge types.

## Q15. Riak vs Neo4j
| | Riak | Neo4j |
|---|---|---|
| Model | Bucket/Key opaque | Nodes/edges |
| Query | Key GET, 2i | Cypher traversal |
| Txn | Single-key eventual | ACID |
| Scale | Linear masterless | Read-scale, write harder |
Cart -> Riak (key-known high-write), Profile -> Riak (point lookup), Social reco -> Neo4j (multi-hop).
