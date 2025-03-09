"""
Author: Thomas De Sa

Utilities for the console_chat database
"""

import pymysql
import os
from dotenv import load_dotenv, dotenv_values
import bcrypt

load_dotenv()
host = os.getenv("DB_HOST")
user = os.getenv("DB_USERNAME")
dbpass = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")


def create_database(conn: pymysql.Connection):
    """
    If database with 'DB_NAME' does not exist, create it and its tables
    """
    with conn.cursor() as cur:

        stmt = f"CREATE DATABASE {db_name}"
        cur.execute(stmt)

    conn.commit()


def create_tables(conn: pymysql.Connection):
    """
    Create the database tables if they don't already exist
    """
    with conn.cursor() as cur:
        stmt = f"""CREATE TABLE USERS(
            username        varchar(25)     NOT NULL,
            hashed_password varbinary(1024) NOT NULL,    
            session_key     int             DEFAULT NULL,
            PRIMARY KEY username)"""

        cur.execute(stmt)

    conn.commit()

    with conn.cursor() as cur:
        stmt = """CREATE TABLE Chat_logs(
            from    varchar(25)   NOT NULL,
            to      varchar(25)   NOT NULL,
            message varchar(4000) NOT NULL,
            time    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (from) REFERENCES USERS(username),
            FOREIGN KEY (to)   REFERENCES USERS(username)
            
            CONSTRIANT pk PRIMARY KEY (from, to, message, time)
            )"""
    conn.commit()

    return


def create_user(username: str, password: str):
    """
    Add user to database
    """
    conn = pymysql.connect(host=host, user=user, password=dbpass)

    try:
        conn.select_db(db_name)

    except Exception as e:
        create_database(conn)
        create_tables(conn)
        print("created database and tables")
    else:
        #CHECK IF TABLES EXIST!!!
        #TODO SQL STATEMENTS TO CREATE TABLES DIDN'T WORK
        pass

    conn.close()


"""
Hashing password methods.
Courtesy of https://stackoverflow.com/questions/9594125/salt-and-hash-a-password-in-python-
"""


def get_hashed_password(plain_text_password):
    """
    "Hash a password for the first time
    (Using bcrypt, the salt is saved into the hash itself)
    """
    return bcrypt.hashpw(plain_text_password, bcrypt.gensalt())


def check_password(plain_text_password, hashed_password):
    """
    Check hashed password. Using bcrypt, the salt is saved into the hash itself
    """
    return bcrypt.checkpw(plain_text_password, hashed_password)


create_user("peepee", "poopoo")
