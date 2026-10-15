-- LAB4 Cassandra – run with: cqlsh -f LAB4.cassandra.cql
CREATE KEYSPACE IF NOT EXISTS collegedb WITH replication={'class':'SimpleStrategy','replication_factor':1};
USE collegedb;
CREATE TABLE IF NOT EXISTS students (student_id int PRIMARY KEY, name text, dept text, cgpa decimal);
INSERT INTO students (student_id,name,dept,cgpa) VALUES (101,'Aarav Sharma','CS',8.9);
INSERT INTO students (student_id,name,dept,cgpa) VALUES (102,'Diya Patel','IT',9.1);
INSERT INTO students (student_id,name,dept,cgpa) VALUES (103,'Rohan Verma','ENTC',7.8);
INSERT INTO students (student_id,name,dept,cgpa) VALUES (104,'Sneha Kulkarni','CS',9.4);
INSERT INTO students (student_id,name,dept,cgpa) VALUES (105,'Arjun Mehta','AIDS',8.2);
SELECT * FROM students;
CREATE TABLE IF NOT EXISTS employees (emp_id int PRIMARY KEY, name text, dept text, salary int);
INSERT INTO employees (emp_id,name,dept,salary) VALUES (1,'Rahul Desai','Eng',75000);
SELECT * FROM employees WHERE emp_id=1;
UPDATE employees SET salary=80000 WHERE emp_id=1;
CREATE TABLE IF NOT EXISTS events (user_id text, event_time timestamp, event_type text, status text, PRIMARY KEY ((user_id), event_time));
INSERT INTO events (user_id,event_time,event_type,status) VALUES ('u101','2024-01-01 10:00:00','login','success');
SELECT * FROM events WHERE user_id='u101';
