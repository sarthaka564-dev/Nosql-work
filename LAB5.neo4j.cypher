// LAB5 Neo4j – paste into Neo4j Browser http://localhost:7474
MATCH (n) DETACH DELETE n;
CREATE (cs:Department {name:'Computer Science'});
CREATE (dbms:Course {title:'DBMS'}), (nosql:Course {title:'NoSQL Databases'});
CREATE (a:Student {name:'Aarav Sharma'}), (d:Student {name:'Diya Patel'});
MATCH (a:Student {name:'Aarav Sharma'}),(c:Course {title:'DBMS'}) CREATE (a)-[:ENROLLED_IN]->(c);
MATCH (c:Course {title:'DBMS'}),(d:Department {name:'Computer Science'}) CREATE (c)-[:BELONGS_TO]->(d);
MATCH (s:Student)-[:ENROLLED_IN]->(c:Course) RETURN s.name, c.title;
CREATE (x:Person {name:'Alice'}),(y:Person {name:'Bob'}),(z:Person {name:'Carol'});
MATCH (a:Person {name:'Alice'}),(b:Person {name:'Bob'}) CREATE (a)-[:FRIENDS_WITH]->(b);
MATCH (a:Person {name:'Alice'}),(c:Person {name:'Carol'}) CREATE (a)-[:FOLLOWS]->(c);
MATCH (p:Person {name:'Alice'})-[:FRIENDS_WITH]-(f) RETURN f.name;
CREATE (c1:Customer {name:'Aarav'}),(p1:Product {name:'Laptop'}),(o1:Order {orderId:'O1001'});
MATCH (c:Customer {name:'Aarav'}),(o:Order {orderId:'O1001'}) CREATE (c)-[:PLACED]->(o);
MATCH (o:Order {orderId:'O1001'}),(p:Product {name:'Laptop'}) CREATE (o)-[:CONTAINS]->(p);
MATCH (c:Customer {name:'Aarav'})-[:PLACED]->(:Order)-[:CONTAINS]->(p:Product) RETURN p.name;
