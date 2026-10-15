# Assignment Unit-4 HBase + Cassandra

## Q1. Column-oriented vs Relational
RDBMS row-wise fixed ACID SQL. Wide-column CF-wise sparse flexible distributed. Pros: horizontal scale, high throughput, sparse efficient. Cons: no JOINs, eventual, modeling-heavy, limited txns.

## Q2. HBase vs Cassandra
| | HBase | Cassandra |
|---|---|---|
| Arch | HMaster/RS/ZK/HDFS CP | P2P ring AP |
| Consistency | Strong per-row | ONE/QUORUM/ALL tunable |
| Query | Shell/API/Phoenix | CQL |
| App | Hadoop analytics | Always-on messaging/IoT |
Choose HBase for Hadoop + strong reads, Cassandra for 24x7 multi-DC writes.

## Q3. HBase arch
HMaster (DDL/assign), RS (serve regions, MemStore flush), ZK (coord), HDFS (HFiles+WAL), Region (key-range), MemStore/Cache. Write: WAL->MemStore->flush->compaction. Read: MemStore+Cache+HFiles merge.

## Q4. Column-family model
`Table->RowKey->CF->Qualifier->Cell(value+timestamp)`. Ex `student#001 info:name="Asha"`. Sparse (no storage if absent), versioned, dynamic qualifiers vs RDBMS fixed NULLs + ALTER.

## Q5. University billions records
RowKey `dept#year#id` (salt if hotspot), CFs `info,acad,logs` (2-3 only), pre-split by dept, secondary index table for course queries.

## Q6. Consistency/txns
RDBMS ACID. HBase strong per-row. Cassandra tunable + Paxos LWT only. Trade-off: strong = latency - availability. App: banking needs strong, likes/logs tolerate eventual.

## Q7. Cassandra HA
RF=3, NetworkTopologyStrategy across racks/DCs, coordinator W/R by level, hinted handoff + read-repair + gossip. QUORUM survives 1 loss.

## Q8. HBase vs CQL
HBase `put/get/scan/delete`, Cassandra `INSERT/SELECT/UPDATE/DELETE`. Modeling matters: must hit rowkey/partition key, else full scan / ALLOW FILTERING. Model queries first.

## Q9. Scaling
HBase range regions split + rebalance, Cassandra hash vnodes auto-rebalance. Both horizontal. Avoid monotonic keys, keep partitions <100MB.

## Q10. Event logging millions/min
`PRIMARY KEY ((app,day),ts)` clustering DESC, TimeUUID, RF3, W ONE / R QUORUM, Kafka buffer, TTL rolling tables. AP choice: never block ingestion.

## Q11. CMS varying schema
Dynamic qualifiers, CFs `meta,content,stats`, versioning, index tables by_author/by_tag. Challenge: secondary queries need extra tables.

## Q12. Counters
`cnt counter; UPDATE t SET cnt=cnt+1`. Concurrent: non-idempotent retries over-count, no TTL, eventual divergence. Fix native counter + QUORUM + sharded counters for hot keys.

## Q13. TTL 24h sessions
Cassandra `USING TTL 86400`, HBase `TTL=>86400`. Auto-expire, saves storage, tombstones compacted. Use VERSIONS=1, tune gc_grace.

## Q14. Analytics platform
Need Hadoop/Spark + strong aggregates -> HBase. Need global ingestion + always-on -> Cassandra. Recommend HBase for correctness + scans, Cassandra for ingestion layer.

## Q15. Poor modeling impact
Bad partition -> hotspot; monotonic rowkey -> last-region overload; many CFs -> flush amplification; RF1 -> loss / RF5 -> cost; full scans -> timeouts. Fix keys/CFs/query-first.
