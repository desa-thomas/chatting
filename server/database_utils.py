"""
Author: Thomas De Sa

Utilities for the console_chat database
"""

import pymysql
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

print(os.getenv("RANO"))