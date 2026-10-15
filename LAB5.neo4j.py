# pip install neo4j
from neo4j import GraphDatabase
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
with driver.session() as s:
    s.run("MATCH (n) DETACH DELETE n")
    s.run("CREATE (:Student {name:'Aarav'})")
    print(list(s.run("MATCH (s:Student) RETURN s.name AS n")))
    s.run("MATCH (s:Student {name:'Aarav'}) SET s.age=21")
    s.run("MATCH (s:Student {name:'Aarav'}) DETACH DELETE s")
driver.close()
print("LAB5 python done")
